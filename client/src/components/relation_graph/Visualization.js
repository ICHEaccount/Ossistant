import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Network } from 'react-vis-network';

function GraphVisualization() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    axios.get('/api/getGraphData').then((response) => {
      const data = response.data;
      setGraphData(data);
    });
  }, []);

  return (
    <div>
      <h1>그래프 시각화</h1>
      <div style={{ height: '500px' }}>
        <Network data={graphData} options={{}} />
      </div>
    </div>
  );
}

export default GraphVisualization;
