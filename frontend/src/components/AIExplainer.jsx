import React, { useState, useEffect, useRef } from 'react';

// NEW: Added sandboxData to the props
const AIExplainer = ({ selectedCandidate, candidates, sandboxData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      type: 'welcome',
      content: 'Welcome to the Civic Lens AI Explainer. Please select a specific candidate from the dropdown above to generate a bilingual financial dossier.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Trigger AI when a new candidate is selected
  useEffect(() => {
    if (!selectedCandidate || selectedCandidate === "all" || candidates.length === 0) return;

    // Find the candidate's name for the UI
    const candidateObj = candidates.find(c => String(c.candidate_id) === String(selectedCandidate));
    const candidateName = candidateObj ? (candidateObj.full_name || candidateObj.name) : "the selected candidate";

    // 1. Add user prompt to chat history
    setMessages(prev => [...prev, { role: 'user', content: `Generate a financial dossier for ${candidateName}.` }]);
    setIsLoading(true);

    // --- BRANCH 1: ISOLATED SANDBOX MODE ---
    if (sandboxData && sandboxData.donations) {
      
      // A. Do the math directly in React
      const candDonations = sandboxData.donations.filter(d => {
        const safeName = (d.candidate_name || "").toLowerCase().replace(/ /g, "_").substring(0, 50);
        return safeName === selectedCandidate;
      });

      let totalRaised = 0;
      const donorMap = {};
      
      candDonations.forEach(d => {
        const amount = Number(d.amount) || 0;
        totalRaised += amount;
        donorMap[d.donor_name || "Unknown Donor"] = (donorMap[d.donor_name || "Unknown Donor"] || 0) + amount;
      });

      let topDonor = "None";
      let topDonorAmount = 0;
      Object.entries(donorMap).forEach(([donor, amount]) => {
        if (amount > topDonorAmount) {
          topDonorAmount = amount;
          topDonor = donor;
        }
      });

      const topPct = totalRaised > 0 ? (topDonorAmount / totalRaised) * 100 : 0;

      // B. Simulate the LLM Response so we don't have to rebuild the backend
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'bot',
          type: 'analysis',
          english: `${candidateName} has a highly concentrated funding network, with ${topPct.toFixed(1)}% of their total war chest originating from a single primary donor: ${topDonor}.`,
          swahili: `${candidateName} ana mtandao wa kifedha uliokolea sana, huku asilimia ${topPct.toFixed(1)}% ya jumla ya fedha zake zikitoka kwa mfadhili mkuu mmoja: ${topDonor}.`,
          infographic: [
            `Total extracted war chest amounts to KSh ${totalRaised.toLocaleString()}`,
            `Heavy reliance on ${topDonor}, contributing KSh ${topDonorAmount.toLocaleString()}`,
            `Financial network indicates a ${topPct > 50 ? 'high' : 'moderate'} concentration risk based on current document context.`
          ]
        }]);
        setIsLoading(false);
      }, 1500); // Simulate AI thinking time

    } 
    // --- BRANCH 2: GLOBAL DATABASE MODE ---
    else {
      // Fetch the actual LLM response from our backend route
      fetch(`http://127.0.0.1:8000/api/ai-explainer/${selectedCandidate}`)
        .then(res => {
          if (!res.ok) throw new Error("Backend AI Engine failed to respond.");
          return res.json();
        })
        .then(data => {
          setMessages(prev => [...prev, {
            role: 'bot',
            type: 'analysis',
            english: data.english,
            swahili: data.swahili,
            infographic: data.infographic
          }]);
        })
        .catch(err => {
          setMessages(prev => [...prev, { role: 'bot', type: 'error', content: `System Error: ${err.message}` }]);
        })
        .finally(() => setIsLoading(false));
    }

  }, [selectedCandidate, candidates, sandboxData]); // Added sandboxData to dependency array

  return (
    <div className="flex flex-col h-[500px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden font-sans">
      
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">AI</div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Financial Explainer Bot</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">LLM-Powered Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-500 font-medium">Online</span>
        </div>
      </div>

      {/* Chat History Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* User Message */}
            {msg.role === 'user' && (
              <div className="bg-blue-600 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[80%]">
                {msg.content}
              </div>
            )}

            {/* Bot Welcome / Error Message */}
            {msg.role === 'bot' && (msg.type === 'welcome' || msg.type === 'error') && (
              <div className="bg-white border border-slate-200 text-slate-700 text-sm px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[80%]">
                {msg.content}
              </div>
            )}

            {/* Bot Analysis Message (The Bilingual Dossier) */}
            {msg.role === 'bot' && msg.type === 'analysis' && (
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm w-full max-w-[90%] overflow-hidden">
                
                {/* English Section */}
                <div className="p-4 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Plain English Summary</span>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">{msg.english}</p>
                </div>
                
                {/* Kiswahili Section */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Muhtasari wa Kiswahili</span>
                  <p className="text-sm text-slate-700 italic leading-relaxed">{msg.swahili}</p>
                </div>

                {/* Infographic Bullets */}
                <div className="p-4 bg-blue-50/50">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">Key Insights Breakdown</span>
                  <ul className="space-y-2">
                    {msg.infographic.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-blue-900 leading-relaxed">
                        <span className="text-blue-500 mt-0.5">⚡</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        ))}

        {/* Loading State Indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-xs text-slate-500 ml-2 font-medium">Generating bilingual dossier...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AIExplainer;