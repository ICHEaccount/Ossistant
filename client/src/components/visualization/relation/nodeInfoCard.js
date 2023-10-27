import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

const NodeInfoCard = ({ selectedNode }) => {
  const [nodeAttributes, setNodeAttributes] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editedValue, setEditedValue] = useState('');

  const fetchNodeAttributes = async (nodeId) => {
    try {
      const response = await axios.get(`/graph/node/${nodeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching node attributes:', error);
      return {};
    }
  };

  const handleEdit = async (key, newValue) => {
    const updatedAttributes = { ...nodeAttributes, [key]: newValue };
    setNodeAttributes(updatedAttributes);
    try {
      const jsonString = JSON.stringify(updatedAttributes);
      console.log('json : '+jsonString);
      await axios.post('/graph/node/modify', jsonString, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setEditIndex(null);
    } catch (error) {
      // Handle error appropriately
      console.error('An error occurred:', error);
    }
  };

  const handleKeyPress = (event, key) => {
    if (event.key === 'Enter') {
      handleEdit(key, editedValue);
    }
  };

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
    <div>
      {Object.entries(nodeAttributes).map(([key, value], index) => (
        <div key={index}>
          <Card style={{ width: '18rem' }}>
            <Card.Header>{key}</Card.Header>
            <Card.Body
              onDoubleClick={() => {
                setEditIndex(index);
                setEditedValue(value);
              }}
            >
              {editIndex === index ? (
                <input
                  type="text"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, key)}
                  onBlur={() => setEditIndex(null)}
                  autoFocus
                />
              ) : (
                value
              )}
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default NodeInfoCard;
