import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';

const RELATION = 1
// whole = 2, suspect = 3, domain = 4
// Example : createReport(`${case_id}`,networkRef,1);

async function createReport(case_id, graphRef, graphType){
    if(graphType === RELATION){
        // graphRef should be 
        if(graphRef.current){
            graphRef.current.fit(); 

            graphRef.current.once('afterDrawing', (ctx) => {
                const dataURL = ctx.canvas.toDataURL();
                const inpData = {'case_id' : case_id, 'type':1, 'img':dataURL};
                console.log(dataURL);
                axios.post('/export/upload/img', inpData).then((response) => {
                  if(response.status === 200){
                    console.log('Success',graphType);
                    return true
                  }
                }).catch((error) => {
                  console.log('Error : ' + error);
                  return false
                })
              });
        }
    }else{
        const chart = graphRef.current;
        console.log(chart);
        const canvas = chart.canvas;
        console.log(canvas);
        const dataURL = canvas.toDataURL('image/png');
        const inpData = {'case_id' : case_id, 'type':graphType, 'img':dataURL};
        console.log(dataURL);
        axios.post('/export/upload/img', inpData).then((response) => {
            if(response.status === 200){
              console.log('Success',graphType);
              return true
            }
          }).catch((error) => {
            console.log('Error : ' + error,graphType);
            return false
          })
    }
}

export default createReport; 