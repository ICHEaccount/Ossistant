import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

function Timeline({ labels, datasets }) {
  const data = {
    labels,
    datasets,
  };

  const options = {
    maintainAspectRatio: false,
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
        var tag =
          context.dataset.data[context.dataIndex].tag !== undefined
            ? context.dataset.data[context.dataIndex].tag
            : 'undefined';
        // 'y' 값을 tag에서 제외
        label += tag;
        return label;
      },
    },
  },
},
  };

  return (
    <div>
      <Line options={options} data={data} style={{height:"200px",width:"840px"}}/>
    </div>
  );
}

function TimelineVisualization(props) {
  const isDone = props.isDone
  const [datasets, setDatasets] = useState([
  // 기본 데이터
  {
    label: 'No Data',
    fill: false,
    data: [],
    pointRadius: 0, // 포인트를 숨깁니다.
    backgroundColor: 'rgba(0, 0, 0, 0)', // 배경을 투명하게 만듭니다.
    borderColor: 'rgba(0, 0, 0, 0)', // 테두리를 투명하게 만듭니다.
    borderWidth: 0, // 테두리 두께를 0으로 만듭니다.
  },]); // 데이터셋

  useEffect(() => {
    axios.get('/timeline/post').then((response) => {
      const serverData = response.data;

      const data = serverData.post_dicts;
      if (data.length >0){
      const backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        // 추가적인 색상을 필요한 만큼 추가
      ];

      const datasets = [];

      const uniqueLabels = Array.from(new Set(data.map(post => post['domain_name'])));

      data.forEach((post, index) => {
        let label = post['domain_name'];
        let tag = '';
        const xValue = post['regdate'];
        if (post['domain_name']) {
            label = post['domain_name'];
        }
        const backgroundColor = backgroundColors[index % backgroundColors.length];

        const postDataset = {
          label,
          fill: false,
          data: [
            {
              x: post['regdate'],
              y: 10,
              tag,
            },
          ],
          pointRadius: 7,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 2,
        };

        datasets.push(postDataset);
      });

      // React 상태로 데이터를 설정
      setDatasets(datasets);
      } else {
      // 데이터가 없는 경우, 빈 그래프를 보여주도록 datasets 업데이트
      setDatasets([
        {
          label: 'No Data',
          fill: false,
          data: [],
          pointRadius: 0,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
        },
      ]);
      }
    })
    .catch((error) => {
      // 서버에서 500 오류가 발생한 경우 처리
      console.error('서버 오류:', error);
      // 사용자에게 오류 메시지 표시 또는 다른 오류 처리 작업 수행
    });
  }, [isDone]);

  return (
      <Timeline datasets={datasets} />
  );
}
export default TimelineVisualization;