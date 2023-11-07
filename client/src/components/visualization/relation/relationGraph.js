import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';
import options from './options'; 
import { useSelector, useDispatch } from 'react-redux'
import node, {select} from '../../../reducers/node'
import { useParams } from 'react-router-dom';

function RelationGraph(props) {
  const params = useParams();
  const case_id = params.case_id;
  const isDone = props.isDone
  const dispatch = useDispatch()
  const selected = useSelector(state => state.node.selected)
  const visJSRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null); 
  const [selectedEdge, setSelectedEdge] = useState(null);

  useEffect(() => {
    const data = {
      nodes: new DataSet(),
      edges: new DataSet(),
    };

    axios.get(`/graph/nodes/${case_id}`).then((response) => {
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
              label: item.r.properties.label,
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
        axios.get(`/graph/node/${nodes[0]}`).then((response) =>{
          const resData = response.data;
          console.log(resData);
        })
        setSelectedNode(nodes[0]);
      } else {
        setSelectedNode(null);
      }
    });

  }, [isDone,visJSRef,selected]);

  return (
      <><div ref={visJSRef} style={{ height: "400px", width: "900px", position: 'relative'}}></div>

      </>
  );
}

export default RelationGraph;
