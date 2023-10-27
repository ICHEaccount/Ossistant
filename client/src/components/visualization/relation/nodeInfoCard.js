import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NodeInfoCard = ({ selectedNode }) => {
  const [nodeAttributes, setNodeAttributes] = useState({});

  const fetchNodeAttributes = async (nodeId) => {
    try {
      const response = await fetch(`/graph/node/${nodeId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching node attributes:', error);
      return {};
    }
  };

  // Call fetchNodeAttributes when the selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      fetchNodeAttributes(selectedNode).then((attributes) => {
        setNodeAttributes(attributes);
      });
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return <div>No node selected</div>;
  }

  return (
    <div className="card" style={{ width: '18rem' }}>
      <div className="card-body">
        <h5 className="card-title">Node Attributes</h5>
        <p className="card-text">Selected Node ID: {nodeAttributes.id}</p>
        <p className="card-text">Node Name: {nodeAttributes.name}</p>
        <p className="card-text">Node Type: {nodeAttributes.type}</p>
        {/* Render additional attributes here */}
      </div>
    </div>
  );
};

export default NodeInfoCard;
