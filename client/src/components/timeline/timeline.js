// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function Timeline({ labels, datasets }) {
//   const data = {
//     labels,
//     datasets,
//   };

//   const options = {
//     showLine: false,
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         suggestedMin: 0,
//         suggestedMax: 50,
//         display: true,
//         ticks: {
//           display: false,
//         },
//         grid: {
//           display: false,
//         },
//       },
//     },
//     plugins: {
//   tooltip: {
//     callbacks: {
//       label: function (context) {
//         var label = context.dataset.label || '';
//         if (label) {
//           label += ': ';
//         }
//         var tag =
//           context.dataset.data[context.dataIndex].tag !== undefined
//             ? context.dataset.data[context.dataIndex].tag
//             : 'undefined';
//         // 'y' 값을 tag에서 제외
//         label += tag;
//         return label;
//       },
//     },
//   },
// },
//   };

//   return (
//     <div>
//       <Line options={options} data={data} height="400px" />
//     </div>
//   );
// }

// function Visualization() {
//   const [datasets, setDatasets] = useState([]); // 데이터셋

//   useEffect(() => {
//     axios.get('/timeline/post').then((response) => {
//       const serverData = response.data;
//       console.log(serverData);
//       const data = serverData.post_dicts;

//       // 중복 작성자 이름 필터링
//       const uniqueLabels = Array.from(new Set(data.map(post => post['keyword-post_writer'])));

//       const backgroundColors = [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//         // 추가적인 색상을 필요한 만큼 추가
//       ];

//       const datasets = [];

//       uniqueLabels.forEach((label, index) => {
//         const backgroundColor = backgroundColors[index % backgroundColors.length];

//         const labelData = data.filter(post => post['keyword-post_writer'] === label);

//         const postDataset = {
//           label,
//           fill: false,
//           data: labelData.map(post => ({
//             x: post['keyword-post_date'],
//             y: 10,
//             tag: `Title: ${post['keyword-post_title']} \n ${post['src'] ? `src: ${post['src']}` : ''} \n ${post['keyword'] ? `keyword: ${post['keyword']}` : ''}`,
//           })),
//           pointRadius: 7,
//           backgroundColor,
//           borderColor: backgroundColor,
//           borderWidth: 2,
//         };

//         datasets.push(postDataset);
//       });

//       // React 상태로 데이터를 설정
//       setDatasets(datasets);
//     });
//   }, []);

//   return (
//     <div>
//       <Timeline datasets={datasets} />
//     </div>
//   );
// }
// export default Timeline;



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
      <Line options={options} data={data} height="500px" width="600px" />
    </div>
  );
}

function TimelineVisualization() {
  const [datasets, setDatasets] = useState([]); // 데이터셋

  useEffect(() => {
    axios.get('/timeline/post').then((response) => {
      const serverData = response.data;
      console.log(serverData);
      const data = serverData.post_dicts;

      // 중복 작성자 이름 필터링
      const uniqueLabels = Array.from(new Set(data.map(post => post['keyword-post_writer'])));

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

      uniqueLabels.forEach((label, index) => {
        const backgroundColor = backgroundColors[index % backgroundColors.length];

        const labelData = data.filter(post => post['keyword-post_writer'] === label);

        const postDataset = {
          label,
          fill: false,
          data: labelData.map(post => ({
            x: post['keyword-post_date'],
            y: 10,
            tag: `Title: ${post['keyword-post_title']} \n ${post['src'] ? `src: ${post['src']}` : ''} \n ${post['keyword'] ? `keyword: ${post['keyword']}` : ''}`,
          })),
          pointRadius: 7,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 2,
        };

        datasets.push(postDataset);
      });

      // React 상태로 데이터를 설정
      setDatasets(datasets);
    });
  }, []);

  return (
    <div>
      <Timeline datasets={datasets} />
    </div>
  );
}
export default TimelineVisualization;
