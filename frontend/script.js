/**
 * script.js  –  FakeShield Frontend Logic
 *
 * Features:
 *  - Calls POST /predict on the Flask backend
 *  - Animated loading spinner with step progression
 *  - Color-coded verdict display (Real / Suspicious / Fake)
 *  - Animated progress bars for Confidence & Similarity
 *  - Top-3 matched article cards with per-card similarity bars
 *  - Character counter on textarea
 *  - Graceful error handling
 */

const API_URL = "http://localhost:5000/predict";

// ── DOM References ──────────────────────────────────────────────────────────
const newsInput      = document.getElementById("newsInput");
const charCount      = document.getElementById("charCount");
const verifyBtn      = document.getElementById("verifyBtn");
const loadingSection = document.getElementById("loadingSection");
const resultSection  = document.getElementById("resultSection");
const errorBanner    = document.getElementById("errorBanner");

// Verdict elements
const verdictCard    = document.getElementById("verdictCard");
const verdictIcon    = document.getElementById("verdictIcon");
const verdictText    = document.getElementById("verdictText");
const verdictMessage = document.getElementById("verdictMessage");

// Meters
const confidenceBar   = document.getElementById("confidenceBar");
const confidenceValue = document.getElementById("confidenceValue");
const similarityBar   = document.getElementById("similarityBar");
const similarityValue = document.getElementById("similarityValue");

// Articles
const articlesList = document.getElementById("articlesList");
const noResults    = document.getElementById("noResults");

// Loading steps
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");


// ── Character Counter ───────────────────────────────────────────────────────
newsInput.addEventListener("input", () => {
  charCount.textContent = newsInput.value.length;
});


// ── Main Verify Function ────────────────────────────────────────────────────
async function verifyNews() {
  const text = newsInput.value.trim();

  // Basic validation
  if (!text || text.length < 10) {
    showError("Please enter at least 10 characters of news text.");
    return;
  }

  // Reset and show loading
  hideError();
  showLoading();

  try {
    // Step 1 animation
    await sleep(600);
    markStepDone(step1, step2);

    // Make API call
    const response = await fetch(API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ news: text })
    });

    // Step 2 animation
    markStepDone(step2, step3);
    await sleep(500);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Step 3 animation
    markStepDone(step3, null);
    await sleep(400);

    // Render results
    hideLoading();
    renderResult(data);

  } catch (err) {
    hideLoading();
    showError(
      err.message.includes("Failed to fetch")
        ? "⚠️ Cannot connect to backend. Make sure Flask is running on port 5000."
        : `Error: ${err.message}`
    );
  }
}


// ── Render Result ───────────────────────────────────────────────────────────
function renderResult(data) {
  const { prediction, confidence, top_similarity, matched_articles, message } = data;

  // ── Verdict Badge ──────────────────────────────────────────────────────
  const verdict    = (prediction || "Fake").toLowerCase();
  const verdictMap = {
    real:       { icon: "✅", label: "Real",       cls: "real" },
    suspicious: { icon: "⚠️", label: "Suspicious", cls: "suspicious" },
    fake:       { icon: "❌", label: "Fake",        cls: "fake" }
  };
  const vm = verdictMap[verdict] || verdictMap.fake;

  verdictIcon.textContent = vm.icon;
  verdictText.textContent = vm.label;

  // Remove old classes, add new ones
  const iconWrap = document.querySelector(".verdict-icon-wrap");
  iconWrap.className    = `verdict-icon-wrap ${vm.cls}`;
  verdictText.className = `verdict-result ${vm.cls}`;

  verdictMessage.textContent = message || "";

  // ── Animated Meters ────────────────────────────────────────────────────
  const confPct = Math.round((confidence || 0) * 100);
  const simPct  = Math.round((top_similarity || 0) * 100);

  requestAnimationFrame(() => {
    confidenceBar.style.width   = `${confPct}%`;
    similarityBar.style.width   = `${simPct}%`;
    animateCount(confidenceValue, confPct, "%");
    animateCount(similarityValue, simPct, "%");
  });

  // ── Matched Articles ───────────────────────────────────────────────────
  articlesList.innerHTML = "";
  noResults.classList.add("hidden");

  if (!matched_articles || matched_articles.length === 0) {
    noResults.classList.remove("hidden");
  } else {
    matched_articles.forEach((article, index) => {
      const card = buildArticleCard(article, index);
      articlesList.appendChild(card);
    });

    // Animate bars after cards are in DOM
    setTimeout(() => {
      document.querySelectorAll(".article-sim-bar-fill").forEach(bar => {
        const target = bar.dataset.sim;
        bar.style.width = `${Math.round(target * 100)}%`;
      });
    }, 100);
  }

  // Show results
  resultSection.classList.remove("hidden");

  // Scroll into view
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}


// ── Build Article Card ──────────────────────────────────────────────────────
function buildArticleCard(article, index) {
  const simPct  = Math.round((article.similarity_score || 0) * 100);
  const srcKey  = (article.source || "").toUpperCase();
  const badgeCls = srcKey === "TOI" ? "badge-toi" : srcKey === "HT" ? "badge-ht" : "badge-trib";

  const card = document.createElement("div");
  card.className = "article-card";
  card.style.animationDelay = `${index * 0.12}s`;
  card.setAttribute("role", "listitem");

  const urlAttr = article.url && article.url !== "#"
    ? `href="${article.url}" target="_blank" rel="noopener noreferrer"`
    : `href="#"`;

  card.innerHTML = `
    <div class="article-top">
      <span class="article-source-badge ${badgeCls}">${article.source || "Source"}</span>
      <span class="article-sim-pill">🎯 ${simPct}% match</span>
    </div>
    <p class="article-headline">${escapeHtml(article.headline || "")}</p>
    <p class="article-desc">${escapeHtml(article.description || "")}</p>
    <div class="article-sim-bar-bg">
      <div class="article-sim-bar-fill" data-sim="${article.similarity_score || 0}" style="width:0%"></div>
    </div>
    <a class="article-link" ${urlAttr}>
      🔗 View original article <span>↗</span>
    </a>
  `;

  return card;
}


// ── Loading Steps ───────────────────────────────────────────────────────────
function showLoading() {
  // Reset steps
  [step1, step2, step3].forEach(s => {
    s.classList.remove("done", "active");
  });
  step1.classList.add("active");

  verifyBtn.disabled = true;
  verifyBtn.querySelector(".btn-text").textContent = "Analyzing…";

  resultSection.classList.add("hidden");
  loadingSection.classList.remove("hidden");
}

function hideLoading() {
  loadingSection.classList.add("hidden");
  verifyBtn.disabled = false;
  verifyBtn.querySelector(".btn-text").textContent = "Verify News";
}

function markStepDone(doneEl, nextEl) {
  if (doneEl) doneEl.classList.replace("active", "done");
  if (nextEl) nextEl.classList.add("active");
}


// ── Error Handling ──────────────────────────────────────────────────────────
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove("hidden");
  setTimeout(() => errorBanner.classList.add("hidden"), 7000);
}

function hideError() {
  errorBanner.classList.add("hidden");
}


// ── Reset ───────────────────────────────────────────────────────────────────
function resetForm() {
  resultSection.classList.add("hidden");
  newsInput.value = "";
  charCount.textContent = "0";
  newsInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// ── Utility: Animated Counter ───────────────────────────────────────────────
function animateCount(el, target, suffix = "") {
  let current = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}


// ── Utility: XSS-safe HTML escape ──────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


// ── Utility: Sleep ──────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ── Allow Enter key to trigger verify (Ctrl+Enter) ──────────────────────────
newsInput.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") verifyNews();
});
