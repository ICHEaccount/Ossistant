import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';
import {changeBehavior} from '../../../reducers/node'
import { useSelector, useDispatch } from 'react-redux'
import downloadIcon from './download_image.png';

const SuspectTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
    const params = useParams();
    const case_id = params.case_id;
    const dispatch = useDispatch()
    const behavior = useSelector(state => state.node.behavior)
    const chartRef = useRef(null); // 캔버스 참조 생성

    const getColorForEvent = (() => {
        const colorMap = {};
        let lastAssignedColor = 0;
        const colors = [
            'rgba(255, 197, 191, 0.4)',
            'rgba(153, 204, 255, 0.4)',
            'rgba(51, 255, 204, 0.4)',
            'rgba(255, 149, 0, 0.4)',
            'rgba(153, 51, 255, 0.4)',
            'rgba(51, 102, 102, 0.4)',
            'rgba(255, 255, 51, 0.4)',
            'rgba(255, 102, 153, 0.4)',
            'rgba(0, 255, 255, 0.4)',
            'rgba(51, 153, 51, 0.4)',
            'rgba(255, 181, 38, 0.4)',
            'rgba(204, 153, 255, 0.4)',
            'rgba(204, 204, 153, 0.4)',
            'rgba(204, 204, 0, 0.4)',
            // ... 여기에 더 많은 색상 추가 가능 ...
        ];

        return (event) => {
            if (!colorMap[event]) {
                colorMap[event] = colors[lastAssignedColor % colors.length];
                lastAssignedColor++;
            }
            return colorMap[event];
        };
    })();


    useEffect(() => {
        axios.get(`/timeline/suspect/${case_id}`).then((response) => {
            const serverData = response.data;
            const data = serverData.suspect_dicts;

            if (data.length > 0) {
                // username 별로 출현 횟수를 추적하는 객체
                const userAppearanceCount = {};

                const datasets = data.map((suspect) => {
                    // 해당 username의 출현 횟수를 업데이트하거나 초기화
                    const color = getColorForEvent(suspect.username);
                    if (userAppearanceCount[suspect.username]) {
                        userAppearanceCount[suspect.username] += 1;
                    } else {
                        userAppearanceCount[suspect.username] = 1;
                    }
                    // 태그 객체 생성
                    const tags = {};
                    if (suspect.title) {
                        tags['Title'] = suspect.title;
                    }
                    if (suspect.UserType) {
                        tags['UserType'] = suspect.UserType;
                    }
                    if (suspect.url) {
                        tags['Url'] = suspect.url;
                    }
                    if (suspect.name) {
                        tags['Name'] = suspect.name;
                    }
                    if (suspect.username) {
                        tags['Username'] = suspect.username;
                    }
                    if (suspect.rank) {
                        tags['Rank'] = suspect.rank;
                    }
                    if (suspect.post_num) {
                        tags['Post_num'] = suspect.post_num;
                    }
                    if (suspect.writer) {
                        tags['Writer'] = suspect.writer;
                    }
                    if (suspect.number) {
                        tags['Phone_number'] = suspect.number;
                    }
                    if (suspect.business_num) {
                        tags['Business_num'] = suspect.business_num;
                    }
                    if (suspect.email) {
                        tags['Email'] = suspect.email;
                    }
                    if (suspect.domain) {
                        tags['Domain'] = suspect.domain;
                    }


                    // 데이터셋 생성
                    return {
                        label: `${suspect.username} - ${userAppearanceCount[suspect.username]}`,
                        data: [{
                            x: suspect.regdate,
                            y: suspect.Hour,
                            tag: tags
                        }],
                        backgroundColor: color,
                        borderColor: color.replace('0.4', '1'), // 테두리는 더 진한 색
                        borderWidth: 2,
                        pointRadius: 7,
                        fill: false,
                    };
                });

                setDatasets(datasets);
            } else {
                setDatasets([]);
            }
        })
        .catch((error) => {
            console.error('서버 오류:', error);
        });
        dispatch(changeBehavior('view'))
    }, [isDone,behavior]);

    // 그래프 옵션
    const options = {
        maintainAspectRatio: true,
        aspectRatio: 3,
        showLine: false,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 24,
                display: true,
                ticks: {
                    stepSize: 1,
                    display: true,
                    callback: function(value) {
                        return value === 0 ? "undefined" : value;
                    }
                },
                grid: {
                    display: true,
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
                        var tag = context.dataset.data[context.dataIndex].tag || {};
                        var tagString = Object.keys(tag)
                            .map(key => `${key}: ${tag[key]}`)
                            .join(', ');
                        label += tagString;
                        return label;
                    },
                },
            },

            legend: {
            onClick: (e, legendItem, legend) => {
                const chart = legend.chart;

                // 클릭된 레이블의 'Event' 부분 추출
                const clickedEventPrefix = legendItem.text.split(' - ')[0];

                // 클릭된 데이터셋의 현재 상태 확인
                const clickedDatasetIndex = legendItem.datasetIndex;
                const clickedDatasetMeta = chart.getDatasetMeta(clickedDatasetIndex);
                const isClickedDatasetHidden = !clickedDatasetMeta.hidden;

                // 동일한 'Event'를 가진 모든 데이터셋의 시각화 상태 토글
                chart.data.datasets.forEach((dataset, index) => {
                    const meta = chart.getDatasetMeta(index);

                    if (dataset.label.startsWith(clickedEventPrefix)) {
                        // 클릭된 데이터셋과 동일한 'Event'를 가진 데이터셋을 토글
                        meta.hidden = isClickedDatasetHidden;
                    }
                });
                chart.update();
            }
        },
        },
    };

    const handleDownload = () => {
    const chart = chartRef.current;
    if (chart) {
        const canvas = chart.canvas;
        const imageUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = 'suspect-timeline.png';
        document.body.appendChild(downloadLink); // DOM에 추가
        downloadLink.click(); // 클릭 이벤트 트리거
        downloadLink.remove(); // 다운로드 후 요소 제거
    }
};

  return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleDownload}
                    style={{
                        backgroundImage: `url(${downloadIcon})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        width: '25px', // 버튼 크기
                        height: '25px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease' // 애니메이션 효과
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'} // 버튼을 누르는 순간
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'} // 버튼에서 손을 떼는 순간
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} // 버튼에서 마우스가 벗어나는 순간
                >
                    {/* 버튼 내 텍스트가 필요없으면 이 부분을 비워 둘 수 있음 */}
                </button>
            </div>
            <Line ref={chartRef} options={options} data={{ datasets }} height={null} width={null} />
        </>
    );
}

export default SuspectTimeline;






