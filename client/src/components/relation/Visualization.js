// import React, { useEffect } from 'react';
// import { Network } from 'vis-network/standalone';
// import 'vis-network/styles/vis-network.css'; // Import vis-network styles
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import options from './options'; // Make sure you have options set up properly

// function Visualization() {
//   useEffect(() => {
//     const container = document.getElementById('graph-container');

//     const data = {
//       nodes: [],
//       edges: [],
//     };

//     axios.get('http://127.0.0.1:5000/graph/node').then((response) => {
//       const graphData = response.data;
//       console.log(graphData);
  
//       graphData.forEach((item) => {
//         const label = item.n.name || item.n.id;
//         const group = item.n.label;

//         console.log(label);
//         const nodeId = uuidv4(); // Unique ID for nodes
//         data.nodes.push({ id: nodeId, label, group });
    
//         if (item.r && item.m) {
//           const fromNodeId = item.m.label + item.m.id;
//           const toNodeId = nodeId;
//           const relationshipId = uuidv4(); // Unique ID for relationships

//           data.edges.push({
//             id: relationshipId,
//             from: fromNodeId,
//             to: toNodeId,
//             label: item.r.type,
//           });
//         }
//       });

//       const network = new Network(container, data, options);

//       return () => {
//         network.destroy(); 
//       };
//     });
//   }, []);

//   return (
//     <div>
//       <div id="graph-container" style={{ width: '2000px', height: '2000px' }}></div>
//     </div>
//   );
// }

// export default Visualization;
import React, { useEffect } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import options from './options'; // Adjust the import path based on your project structure

function Visualization() {
  useEffect(() => {
    const container = document.getElementById('graph-container');

    const data = {
      nodes: new DataSet(),
      edges: new DataSet(),
    };

    axios.get('http://172.25.0.6:5000/graph/node').then((response) => {
      const graphData = response.data;
      graphData.forEach(item => {
        const label = item.n.name || item.n.id;
        const group = item.n.label;
        const nodeId = item.n.id || uuidv4(); // Use the existing ID or generate a new one

        data.nodes.add({ id: nodeId, label, group });

        if (item.r) {
          const fromNodeId = item.n.id;
          const toNodeId = item.r.id;
          const relationshipId = uuidv4();

          data.edges.add({
            id: relationshipId,
            from: fromNodeId,
            to: toNodeId,
            label: item.r.type,
          });
        }
      });
    });
    const network = new Network(container, data, options);

    return () => {
      network.destroy();
    };
  }, []);

  return (
    <div>
      <div id="graph-container" style={{ width: '100%', height: '700px' }}></div>
    </div>
  );
}

export default Visualization;
