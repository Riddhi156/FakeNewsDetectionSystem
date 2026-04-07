import React from 'react';
import Navbar from './components/Navbar';
import Verification from './components/Verification';

function DashboardMock() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
       <h1 className="text-xl font-bold mb-1">Editor's Oversight</h1>
       <p className="text-gray-500 text-sm mb-8">System status: All analytical nodes functional. Your recent verification queue is up to date.</p>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Verification Rate</div>
                  <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-veritas-navy">94.2%</span>
                      <span className="text-xs font-medium text-green-600">↑ 2.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-2">
                      <div className="bg-veritas-light-blue w-[94%] h-full rounded-full"></div>
                  </div>
                  <div className="text-[10px] text-gray-400">Based on last 500 analyzed sources.</div>
              </div>

              <div className="bg-veritas-navy text-white rounded-xl p-6 relative overflow-hidden">
                 <div className="text-sm font-semibold mb-1 relative z-10 text-veritas-light-blue">Total Trust Score</div>
                 <div className="text-xs opacity-70 mb-6 relative z-10 max-w-[80%]">Aggregate credibility of your digital footprint.</div>
                 <div className="text-5xl font-bold relative z-10">A+</div>
                 
                 {/* Decorative background element */}
                 <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-2xl rotate-12 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                 </div>
              </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold text-gray-800">Recent Analysis History</h2>
                 <button className="text-xs font-bold text-veritas-navy hover:underline">View Archives</button>
             </div>
             
             <div className="space-y-6">
                 {[
                     { title: "The Economic Impact of Modular Architecture in Urban Environments", time: "14 mins ago", source: "bloomberg.com", status: "VERIFIED", score: 98, color: "text-green-800 bg-veritas-green" },
                     { title: "Policy Shifts in Renewable Energy Subsidies: A Global Perspective", time: "2 hours ago", source: "reuters.com", status: "DISPUTED", score: 34, color: "text-red-800 bg-veritas-red" },
                     { title: "Quantum Computing: Breakthroughs in Error Correction Logic", time: "Yesterday", source: "wired.com", status: "IN REVIEW", score: "--", color: "text-gray-600 bg-gray-200" }
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                       <div className="flex gap-4">
                           <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400 text-xs shadow-inner">
                               📄 
                           </div>
                           <div>
                               <h3 className="font-bold text-sm text-gray-900 mb-1 max-w-md">{item.title}</h3>
                               <div className="text-xs text-gray-500 font-medium flex gap-3">
                                   <span>🕒 {item.time}</span>
                                   <span>🌍 {item.source}</span>
                               </div>
                           </div>
                       </div>
                       <div className="text-right flex flex-col items-end">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${item.color}`}>{item.status}</span>
                           <span className="text-xl font-bold">{item.score}</span>
                       </div>
                    </div>
                 ))}
             </div>
          </div>
       </div>
    </div>
  )
}

function InsightsMock() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold mb-2">Editorial Insights</h1>
        <p className="text-gray-500 text-sm max-w-2xl mb-10">Analyzing 2.4 million data points to map the current landscape of truth, bias, and digital integrity across global news cycles.</p>
        
        {/* We can fill this with more dummy content or leave it simpler since Verification is the main functional page */}
        <div className="flex flex-col items-center justify-center p-20 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-400">
            <span className="text-4xl mb-4">📊</span>
            <p className="mb-2 font-medium">Insights Dashboard Active</p>
            <p className="text-sm opacity-70">Model metrics will populate here upon processing the corpus.</p>
        </div>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = React.useState('verification');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F9FA]">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 w-full">
        {currentView === 'verification' && <Verification />}
        {currentView === 'dashboard' && <DashboardMock />}
        {currentView === 'insights' && <InsightsMock />}
      </main>

      <footer className="w-full bg-[#f6f7f9] border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 border-gray-200">
                 <div className="font-bold tracking-wider text-sm mb-4">VERITAS EDITORIAL</div>
                 <p className="text-xs text-gray-500 leading-relaxed pr-4">Restoring trust in digital media through rigorous, automated editorial standards.</p>
            </div>
            <div>
                 <div className="font-bold text-xs mb-4">Platform</div>
                 <ul className="text-xs text-gray-500 space-y-3">
                     <li className="hover:text-veritas-navy cursor-pointer">Methodology</li>
                     <li className="hover:text-veritas-navy cursor-pointer">Transparency Report</li>
                     <li className="hover:text-veritas-navy cursor-pointer">API Reference</li>
                 </ul>
            </div>
            <div>
                 <div className="font-bold text-xs mb-4">Legal</div>
                 <ul className="text-xs text-gray-500 space-y-3">
                     <li className="hover:text-veritas-navy cursor-pointer">Terms of Service</li>
                     <li className="hover:text-veritas-navy cursor-pointer">Privacy Policy</li>
                     <li className="hover:text-veritas-navy cursor-pointer">Contact Support</li>
                 </ul>
            </div>
            <div className="text-right self-end text-[10px] text-gray-400">
                 © 2024 Veritas Editorial. All Truths Verified.
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
