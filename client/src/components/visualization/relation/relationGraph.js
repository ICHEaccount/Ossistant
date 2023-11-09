import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';
import options from './options'; 
import { useSelector, useDispatch } from 'react-redux'
import node, {select} from '../../../reducers/node'
import { useParams } from 'react-router-dom';

import { debounce } from "lodash";


function RelationGraph(props) {
  const params = useParams();
  const case_id = params.case_id;
  const isDone = props.isDone
  const dispatch = useDispatch()
  // const selected = useSelector(state => state.node.selected)
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
    
    
    const controlNodeDragEndHandler = debounce((dragInfo, data) => {
      if (dragInfo && dragInfo.controlEdge && dragInfo.controlEdge.from && dragInfo.controlEdge.to){
        const from_uid = dragInfo.controlEdge.from;
        const to_uid = dragInfo.controlEdge.to;
        
        if (from_uid && to_uid) {
          if(from_uid !== to_uid){
            const formData = {
              "from":from_uid,
              "to":to_uid,
              ...data
            }
            console.log(formData);
            axios.post("/graph/rel/create",formData).then((response) => {
              if(response.status === 200){
                if(formData.type == "0"){
                  const isRel = response.data.isrel;
                  if (isRel === false){
                    console.log("finish");
                    network.off("controlNodeDragEnd", controlNodeDragEndHandler);
                  }
                }else{
                  console.log('modify');
                  network.off("controlNodeDragEnd", controlNodeDragEndHandler);
                }
                network.disableEditMode();
              }
            })
          }
        }
      }
    }, 400);
    
    // Connect Relationship 
    network.on('selectNode', (params) => {
      const { nodes } = params;
      console.log(nodes);
      if (nodes.length > 0) {
        axios.get(`/graph/node/${nodes[0]}`).then((response) =>{

            const resData = response.data;
            const label = resData.property.label;
            delete resData.property.label;
            console.log(resData);
            dispatch(select({node:resData,label:label}))
          });
            setSelectedNode(nodes[0]);
            network.addEdgeMode();
            const inp_data = {'type':"0"}
            network.on("controlNodeDragEnd", (dragInfo) => controlNodeDragEndHandler(dragInfo,inp_data));
          } else {
            setSelectedNode(null);
          }
    });


    // // Modify relationship 
    // network.on('doubleClick', (params)=>{
    //   console.log("data : " + params.edges);
    //   const edge = params.edges;
    //   // const nodes = params.nodes;
      
    //   if (edge) {
    //     console.log("edit mode : " + edge);
    //     network.editEdgeMode();
    //     const inp_data = { 'type': "1", "rel_uid": edge }; 
    //     network.on("controlNodeDragEnd", (dragInfo) => controlNodeDragEndHandler(dragInfo, inp_data));
    //   }
    // });

    network.on('doubleClick', (nodeInfo)=>{
      console.log(nodeInfo); 
      
      if (nodeInfo.nodes.length > 0) {
        network.deleteSelected();
        const reqData = {
          "type": "node",
          "uid": nodeInfo.nodes[0]
        }
        axios.post('/graph/rel/delete', reqData)
        .then((response) => {
          if (response.status === 200) {
            console.log("Success");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      } else if (nodeInfo.edges.length > 0 && nodeInfo.nodes.length === 0) {
        network.deleteSelected();
        const reqData = {
          "type": "rel",
          "uid": nodeInfo.edges[0]
        }
        axios.post('/graph/rel/delete', reqData)
        .then((response) => {
          if (response.status === 200) {
            console.log("Success");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      }
    });

  }, [isDone,visJSRef]);

  return (
      <><div ref={visJSRef} style={{ height: "370px", width: "900px", position: 'relative'}}></div>
      </>
  );
}

export default RelationGraph;
