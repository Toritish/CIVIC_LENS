import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="text-center mb-16 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 uppercase">
          Unveil Your Country's <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
            Funding Landscape
          </span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Choose your analytical path. Explore our global database of political networks, or upload your own raw documents to assess localized financial relationships.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl z-10 px-4">
        
        {/* Card 1: Civic Lens Lab (Global Database) */}
        <Link to="/hub" className="flex-1 group relative bg-white rounded-3xl p-10 border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            {/* Globe / Network Icon */}
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">Civic Lens Lab</h2>
          <p className="text-emerald-600 font-bold uppercase tracking-widest text-[11px] mb-4">Explore the Current Trend</p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Dive into the aggregated national database. Interact with the 5 analytical modules to view historical funding trends, geospatial wealth distribution, and vast network connections.
          </p>
        </Link>

        {/* Card 2: AI Extraction (Sandbox) */}
        <Link to="/data-intake" className="flex-1 group relative bg-slate-900 rounded-3xl p-10 border border-slate-700 shadow-xl hover:shadow-2xl hover:shadow-purple-900/40 hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div className="w-24 h-24 bg-slate-800 text-purple-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 border border-slate-700">
             {/* AI / Document Icon */}
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 group-hover:text-purple-300 transition-colors">AI Extraction</h2>
          <p className="text-purple-400 font-bold uppercase tracking-widest text-[11px] mb-4">Be Your Country's Assessor</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload unstructured text or raw financial documents. Our LLM will extract the entities and generate an isolated, interactive dashboard exclusively for your file's data.
          </p>
        </Link>

      </div>
    </div>
  );
};

export default LandingPage;