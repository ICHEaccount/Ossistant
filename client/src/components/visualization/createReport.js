import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import axios from 'axios';

const RELATION = 1
// whole = 2, suspect = 3, domain = 4
// Example : createReport(`${case_id}`,networkRef,1);

async function createReport(case_id, graphRef, graphType){
  try {
    if (graphType === RELATION) {
        // graphRef should be 
        if (graphRef.current) {
            graphRef.current.fit();

            const dataURL = await new Promise((resolve) => {
                graphRef.current.once('afterDrawing', (ctx) => {
                    resolve(ctx.canvas.toDataURL());
                });
            });

            const inpData = { 'case_id': case_id, 'type': 1, 'img': dataURL };
            const response = await axios.post('/export/upload/img', inpData);

            if (response.status === 200) {
                // console.log('Success', graphType);
                return true;
            } else {
                return false;
            }
        }
    } else {
        const chart = graphRef.current;
        const canvas = chart.canvas;
        const dataURL = canvas.toDataURL('image/png');

        const inpData = { 'case_id': case_id, 'type': graphType, 'img': dataURL };
        const response = await axios.post('/export/upload/img', inpData);

        if (response.status === 200) {
            // console.log('Success', graphType);
            return true;
        } else {
            return false;
        }
    }
  } catch (error) {
      console.log('Error:', error);
      return false;
  }
}

export default createReport; 