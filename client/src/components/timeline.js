import React,{useState,useEffect} from 'react';
import Axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const Timeline = () => {
    const labels= [
        //x 축
    '2023-09-10','2023-09-11','2023-09-12'
    ]
    const data = {
        labels,
        datasets: [
            { 
                label: 'Case 1',
                fill: false,
                data: [{ x: '2023-09-10', y: 10, tag: 'This is brief explaination of Case 1' },
                       { x: '2023-09-12', y: 20, tag: 'This is brief explaination of Second Case 1' }],
                pointRadius: 7,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor:  'rgba(255, 99, 132, 1)',
                borderWidth: 2 
            },
            {
                label: 'Case 2',
                fill: false,
                data: [{ x: '2023-09-10', y: 20, tag: 'This is brief explaination of Case 2' }],
                pointRadius: 7,
                backgroundColor:  'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            },
            {
                label: 'Case 3',
                fill: false,
                data: [{ x: '2023-09-10', y: 30, tag: 'This is brief explaination of Case 3' }],
                pointRadius: 7,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor:  'rgba(255, 206, 86, 1)',
                borderWidth: 2
            },
            {
                label: 'Case 4',
                fill: false,
                data: [{ x: '2023-09-11', y: 10, tag: 'This is brief explaination of Case 4' }],
                pointRadius: 7,
                backgroundColor:  'rgba(75, 192, 192, 0.2)',
                borderColor:  'rgba(75, 192, 192, 1)',
                borderWidth: 2
            },
            {
                label: 'Case 5',
                fill: false,
                data: [{ x: '2023-09-11', y: 20, tag: 'This is brief explaination of Case 5' },
                       { x: '2023-09-13', y: 10, tag: 'This is brief explaination of Second Case 5' } ],
                pointRadius: 7,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor:  'rgba(153, 102, 255, 1)',
                borderWidth: 2
            },
            {
                label: 'Case 6',
                fill: false,
                data: [{ x: '2023-09-12', y: 10, tag: 'This is brief explaination of Case 6' }],
                pointRadius: 7,
                backgroundColor:   'rgba(255, 159, 64, 0.2)',
                borderColor:   'rgba(255, 159, 64, 1)',
                borderWidth: 2
            },
            
        ]
        }
        
    
    const options = {
        showLine: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                suggestedMin: 0,
                suggestedMax: 50,
                display: true,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        var tag = context.dataset.data[context.dataIndex].tag !== undefined ? context.dataset.data[context.dataIndex].tag : 'undefined';
                        label += context.parsed.y + ' (' + tag + ')';
                        return label;
                    },
                },
            },
        },
    }

    return (
    <div>
        <Line options={options} data={data} height="40px"/>
    </div>

    )
}


export default Timeline;