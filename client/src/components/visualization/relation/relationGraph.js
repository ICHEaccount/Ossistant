import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';
import options from './options'; 
import NodeInfoCard from './nodeInfoCard';
import { useSelector, useDispatch } from 'react-redux'
import {select} from '../../../reducers/node'

function RelationGraph(props) {
  const isDone = props.isDone
  const dispatch = useDispatch()
  const visJSRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null); 
  useEffect(() => {
    // const container = document.getElementById('graph-container');

    const data = {
      nodes: new DataSet(),
      edges: new DataSet(),
    };

    axios.get('/graph/node').then((response) => {
      const graphData = response.data;
      const addedNodes = new Set();
      const addedEdges = new Set();
    
      graphData.forEach(item => {
        const label = item.n.username || item.n.domain || item.n.title;
        const group = item.n.label;
        const nodeId = item.n.id;
    
        if (!addedNodes.has(nodeId)) {
          data.nodes.add({ id: nodeId, label, group });
          addedNodes.add(nodeId);
        }
    
        if (item.r) {
          const fromNodeId = item.n.id;
          const toNodeId = item.m.id;
          const relationshipId = item.r.id;
    
          if (!addedEdges.has(relationshipId)) {
            data.edges.add({
              id: relationshipId,
              from: fromNodeId,
              to: toNodeId,
              label: item.r.type,
            });
            addedEdges.add(relationshipId);
          }
        }
      });
    });
    const network = visJSRef.current && new Network(visJSRef.current, data, options);
    network.on('selectNode', (params) => {
      const { nodes } = params;
      if (nodes.length > 0) {
        // to use redux, pass the node info and its label to select({node,label})
        // then datapanel will automatically show user the info of the selected node
        // dispatch(select(res.data))
        setSelectedNode(nodes[0]);
      } else {
        setSelectedNode(null);
      }
    });

  }, [isDone,visJSRef]);

  return (
      <><div ref={visJSRef} style={{ height: "400px", width: "900px" }}></div>
      <NodeInfoCard selectedNode={selectedNode} />
      </>
  );
}

export default RelationGraph;
