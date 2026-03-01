import pandas as pd
import networkx as nx
from community import community_louvain #

def generate_network_data():
    # 1. Load the data
    try:
        df = pd.read_csv('data/DONATIONS.csv')
    except FileNotFoundError:
        return {"nodes": [], "links": []}

    # 2. Create a Bipartite Graph
    # Nodes are either Donors or Candidates; Edges are the money flow
    G = nx.Graph()
    
    for _, row in df.iterrows():
        G.add_node(row['donor_id'], type='donor')
        G.add_node(row['candidate_id'], type='candidate')
        G.add_edge(row['donor_id'], row['candidate_id'], weight=row['amount'])

    # 3. Calculate Centrality (Who has the most influence?)
    centrality = nx.degree_centrality(G)

    # 4. Apply Louvain Clustering (Find Funding Families)
    # We project the graph to find donor-to-donor connections based on shared candidates
    donor_nodes = [n for n, d in G.nodes(data=True) if d['type'] == 'donor']
    donor_projection = nx.bipartite.weighted_projected_graph(G, donor_nodes)
    
    # Run the Louvain algorithm on the projected donor network
    partition = community_louvain.best_partition(donor_projection)

    # 5. Format data for your D3.js Frontend
    nodes = []
    for node, data in G.nodes(data=True):
        nodes.append({
            "id": node,
            "type": data['type'],
            "size": centrality[node] * 100, # Scale for visualization
            "group": partition.get(node, 0) if data['type'] == 'donor' else -1
        })

    links = []
    for u, v, data in G.edges(data=True):
        links.append({
            "source": u,
            "target": v,
            "value": data['weight']
        })

    return {"nodes": nodes, "links": links}

if __name__ == "__main__":
    network_results = generate_network_data()
    print(f"Network Generated: {len(network_results['nodes'])} nodes, {len(network_results['links'])} links.")