import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';
import options from './options'; 
import { useSelector, useDispatch } from 'react-redux'
import node, {select,changeBehavior} from '../../../reducers/node'
import { useParams } from 'react-router-dom';
import lbs from '../../../labels';

function RelationGraph(props) {
  const params = useParams();
  const case_id = params.case_id;
  const isDone = props.isDone
  const dispatch = useDispatch()
  const behavior = useSelector(state => state.node.behavior)
  const visJSRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null); 

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
        var label = item.n[lbs[item.n.label].title];
        const group = item.n.label;
        const nodeId = item.n.id;
    
        if (!addedNodes.has(nodeId)) {
          if(label.length > 20 && group ==="Post"){
            label = label.substring(0,15) + "...";
          }
          console.log("Node label : "+label);
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
              labelTo: item.r.properties.label,
              arrows: {
                to: { enabled: true, scaleFactor: 1, type: "arrow" }
              }
            });
            addedEdges.add(relationshipId);
          }
        }
      });
    });
    const network = visJSRef.current && new Network(visJSRef.current, data, options);
    
    
    // Connect Relationship 
    network.on('selectNode', (params) => {
      const { nodes } = params;
      network.disableEditMode();
      console.log(nodes);
      if (nodes.length > 0) {
        axios.get(`/graph/node/${nodes[0]}`).then((response) =>{
          const resData = response.data;
          const label = resData.property.label;
          delete resData.property.label;
          console.log(resData);
          dispatch(select({node:resData,label:label}))
          setSelectedNode(nodes[0]);
          network.addEdgeMode();
        });
      } else {
        setSelectedNode(null);
      }
      network.disableEditMode();
    });

    // Modify relationship 
    network.on('doubleClick', (properties)=>{

      if (properties.edges.length > 0 && properties.nodes.length === 0) {
        var edgeId = properties.edges[0];
        var clickedEdges = data.edges.get( edgeId );
        console.log("edit mode : " + JSON.stringify(clickedEdges));
        
        const inp_data = { 'type': "rel", "uid": clickedEdges.id };
        axios.post('/graph/rel/delete',inp_data).then((response) => {
          if(response.status === 200){
            network.editEdgeMode();
          }
        })
      }
      network.disableEditMode();
    });

    dispatch(changeBehavior('view'))
  }, [isDone,visJSRef,behavior]);


  return (
      <><div ref={visJSRef} style={{ height: "370px", width: "1102px", position: 'relative'}}></div>
      </>
  );
}

export default RelationGraph;
