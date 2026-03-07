import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Added for the navigation button

// NEW: Accept the setSandboxData function from App.jsx
const DataIntake = ({ setSandboxData }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAiResult(null);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Backend Error: ${errData.detail}`);
      }

      const data = await response.json();
      console.log("DataIntake: Raw response from backend:", data);
      console.log("DataIntake: extracted_data:", data.extracted_data);
      
      setAiResult(data.extracted_data);
      
      // NEW THE MAGIC STEP: Push the AI data directly into the App's Sandbox memory!
      if (setSandboxData) {
        console.log("DataIntake: Setting sandbox data with", data.extracted_data.donations?.length || 0, "donations");
        setSandboxData(data.extracted_data);
      }

    } catch (err) {
      setError(err.message);
      console.error("DataIntake Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-l-4 border-blue-600 pl-4">
        <h2 className="text-2xl font-bold text-slate-800">Data Intake Pipeline</h2>
        <p className="text-slate-500 text-sm italic">AI-Powered Entity Extraction for Raw Financial Documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload Zone */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Upload Raw Document</h3>
          <p className="text-sm text-slate-500 mb-6">
            Upload an unstructured text file (e.g., a news article or scanned declaration). 
            The AI Engine will extract Candidates, Donors, and Amounts automatically.
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
              <input 
                type="file" 
                accept=".txt" 
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={!file || isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${!file || isLoading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'AI is processing document...' : 'Extract Data via LLM'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 break-words">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: AI Visual Verification & Success State */}
        <div className="bg-slate-900 rounded-xl shadow-sm p-8 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-white">System Status</h3>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${aiResult ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-slate-800 text-blue-400 border-slate-700'}`}>
              {aiResult ? 'Sandbox Activated' : 'Awaiting Input'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col">
            {isLoading ? (
              <div className="flex items-center gap-3 text-slate-500 h-full justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                Analyzing linguistic structures...
              </div>
            ) : aiResult ? (
              // NEW UX: The Green Success State
              <div className="flex flex-col h-full justify-center items-center space-y-6 text-center animate-fade-in">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-500/50">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Extraction Complete!</h4>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Entities extracted and isolated in the Sandbox. Your global database has not been altered.
                  </p>
                </div>
                
                <Link to="/hub" className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-purple-900/20">
                  Analyze Data in Sandbox →
                </Link>

                {/* Keep a tiny preview for the developer */}
                <div className="w-full mt-4 text-left overflow-hidden h-20 opacity-30 hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Raw JSON Payload</p>
                  <pre className="text-[10px] font-mono text-blue-300 overflow-y-auto h-full">{JSON.stringify(aiResult, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                Awaiting document upload...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataIntake;