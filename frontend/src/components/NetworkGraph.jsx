import React, { useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// NEW: Accept the sandboxData prop
const NetworkGraph = ({ targetCandidateId, sandboxData }) => {
  const [rawData, setRawData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // --- BRANCH 1: ISOLATED SANDBOX MODE ---
    if (sandboxData && sandboxData.donations) {
      const nodesMap = new Map();
      const linksList = [];

      sandboxData.donations.forEach(don => {
        const cName = don.candidate_name || "Unknown Candidate";
        const dName = don.donor_name || "Unknown Donor";
        
        // Generate safe IDs matching our backend logic
        const cId = cName.toLowerCase().replace(/ /g, "_").substring(0, 50);
        const dId = dName.toLowerCase().replace(/ /g, "_").substring(0, 50);
        const amount = Number(don.amount) || 0;

        // 1. Create Nodes if they don't exist
        if (!nodesMap.has(cId)) {
          nodesMap.set(cId, { id: cId, name: cName, group: "Candidate", centrality_score: 0 });
        }
        if (!nodesMap.has(dId)) {
          nodesMap.set(dId, { id: dId, name: dName, group: "Donor", centrality_score: 0 });
        }

        // Add a simple centrality weight so the label math (toFixed) doesn't break
        nodesMap.get(cId).centrality_score += 0.1;
        nodesMap.get(dId).centrality_score += 0.05;

        // 2. Create or aggregate Links
        const existingLink = linksList.find(l => l.source === dId && l.target === cId);
        if (existingLink) {
          existingLink.amount += amount;
        } else {
          linksList.push({ source: dId, target: cId, amount: amount });
        }
      });

      // Update the graph instantly with our localized data!
      setRawData({ nodes: Array.from(nodesMap.values()), links: linksList });
    } 
    // --- BRANCH 2: GLOBAL DATABASE MODE ---
    else {
      fetch('http://127.0.0.1:8000/api/network-metrics')
        .then(res => res.json())
        .then(json => setRawData(json))
        .catch(err => console.error("Network Engine Error:", err));
    }
  }, [sandboxData]); // Re-run whenever sandbox data changes

  const graphData = useMemo(() => {
    if (targetCandidateId === "all") return rawData;

    const filteredLinks = rawData.links.filter(link => 
      link.source === targetCandidateId || link.target === targetCandidateId ||
      link.source.id === targetCandidateId || link.target.id === targetCandidateId
    );

    const connectedNodeIds = new Set([
      targetCandidateId,
      ...filteredLinks.map(l => typeof l.source === 'object' ? l.source.id : l.source),
      ...filteredLinks.map(l => typeof l.target === 'object' ? l.target.id : l.target)
    ]);

    const filteredNodes = rawData.nodes.filter(node => connectedNodeIds.has(node.id));

    return { nodes: filteredNodes, links: filteredLinks };
  }, [rawData, targetCandidateId]);

  return (
    <div className="h-[600px] w-full">
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="#ffffff"
        nodeLabel={(node) => `${node.name} (Centrality: ${node.centrality_score.toFixed(4)})`}
        
        nodeColor={node => node.group === "Candidate" ? "#2563eb" : "#94a3b8"}
        nodeRelSize={6}
        
        // REFINED: Logarithmic Edge Thickness
        linkWidth={link => {
          const baseWidth = Math.log10((link.amount / 5000) + 1); // Math logic to scale lines smoothly
          return targetCandidateId === "all" ? baseWidth : baseWidth * 1.5; 
        }}
        linkColor={link => link.amount > 500000 ? "#1e3a8a" : "#cbd5e1"} 
        
        // Added KSh Label on Hover for the edges
        linkLabel={link => `Donation: KSh ${Number(link.amount).toLocaleString()}`}

        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={link => link.amount > 1000000 ? 4 : 0} 
        
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 11 / globalScale;
          ctx.font = `${fontSize}px Inter`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#475569';
          ctx.fillText(label, node.x, node.y + 12);
        }}
      />
    </div>
  );
};

export default NetworkGraph;