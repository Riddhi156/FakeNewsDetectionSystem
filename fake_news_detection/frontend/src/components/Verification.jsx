import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

const Verification = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!text.trim()) {
        setError('Please enter some text to verify.');
        return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/predict', { text });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 fade-in h-screen">
      <div className="text-center mb-10">
        <span className="inline-block bg-veritas-green text-green-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          AI-Powered Truth Analysis
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-2 leading-tight">
          In Pursuit of the <span className="text-veritas-navy">Unaltered</span> <br/><span className="text-veritas-navy">Truth</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Veritas Editorial uses deep neural networks to verify claims, analyze sources, and restore trust in your information ecosystem.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-2 max-w-3xl mx-auto border border-gray-100 flex flex-col mb-12 relative overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste article text or news headline here for instant verification..."
          className="w-full h-40 p-6 bg-veritas-bg outline-none resize-none text-gray-700 placeholder-gray-400 rounded-t-lg focus:ring-1 focus:ring-veritas-light-blue"
        />
        <div className="flex justify-between items-center p-3 border-t border-gray-100 bg-white rounded-b-lg">
          <div className="text-xs text-gray-400 font-medium flex gap-4 ml-2">
            <span className="flex items-center gap-1">🔒 Encrypted Analysis</span>
            <span className="flex items-center gap-1">⏱️ Real-time</span>
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-veritas-navy hover:bg-veritas-accent text-white px-8 py-2.5 rounded shadow-md font-semibold text-sm transition-all flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Now'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 font-medium text-center bg-red-50 py-3 rounded border border-red-100 max-w-3xl mx-auto mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                 <div className="mb-4">
                     {result.label === 'REAL' ? (
                         <div className="w-16 h-16 bg-veritas-green/20 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <ShieldCheck size={32} />
                         </div>
                     ) : (
                        <div className="w-16 h-16 bg-veritas-red/40 rounded-full flex items-center justify-center mx-auto text-red-600">
                            <ShieldAlert size={32} />
                        </div>
                     )}
                 </div>
                 <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest mb-1">{result.label} NEWS</h2>
                 <p className="text-sm text-gray-500">Our models have classified this text.</p>
             </div>

             <div className="bg-veritas-navy text-white rounded-xl p-8 shadow-sm flex flex-col justify-center">
                <div className="mb-2 text-veritas-light-blue font-medium text-sm">Confidence Score</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{(result.confidence * 100).toFixed(1)}</span>
                    <span className="text-xl font-medium text-veritas-light-blue">%</span>
                </div>
                
                <div className="w-full bg-veritas-accent h-2 rounded-full mt-6 overflow-hidden">
                    <div 
                        className={`h-full ${result.label === 'REAL' ? 'bg-veritas-green' : 'bg-veritas-red'} rounded-full transition-all duration-1000`} 
                        style={{ width: `${result.confidence * 100}%` }}
                    />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
