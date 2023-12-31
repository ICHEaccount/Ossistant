import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';
import {changeBehavior} from '../../../reducers/node'
import { useSelector, useDispatch } from 'react-redux'
import downloadIcon from './download_image.png';

const DomainTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
    const params = useParams();
    const case_id = params.case_id;
    const dispatch = useDispatch()
    const behavior = useSelector(state => state.node.behavior)
    const chartRef = props.chartRef; // 캔버스 참조 생성

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
        axios.get(`/timeline/post/${case_id}`).then((response) => {
            const serverData = response.data;
            const data = serverData.post_dicts;

            if (data.length > 0) {
                // username 별로 출현 횟수를 추적하는 객체
                const userAppearanceCount = {};

                const datasets = data.map((post) => {
                    // 해당 username의 출현 횟수를 업데이트하거나 초기화
                    const color = getColorForEvent(post.domain);
                    if (userAppearanceCount[post.domain]) {
                        userAppearanceCount[post.domain] += 1;
                    } else {
                        userAppearanceCount[post.domain] = 1;
                    }
                    // 태그 객체 생성
                    const tags = {};
                    if (post.title) {
                        tags['Title'] = post.title;
                    }
                    if (post.UserType) {
                        tags['UserType'] = post.UserType;
                    }
                    if (post.url) {
                        tags['Url'] = post.url;
                    }
                    if (post.name) {
                        tags['Name'] = post.name;
                    }
                    if (post.username) {
                        tags['Username'] = post.username;
                    }
                    if (post.rank) {
                        tags['Rank'] = post.rank;
                    }
                    if (post.post_num) {
                        tags['Post_num'] = post.post_num;
                    }
                    if (post.writer) {
                        tags['Writer'] = post.writer;
                    }
                    if (post.number) {
                        tags['Phone_number'] = post.number;
                    }
                    if (post.business_num) {
                        tags['Business_num'] = post.business_num;
                    }
                    if (post.email) {
                        tags['Email'] = post.email;
                    }
                    if (post.domain_registered_date) {
                        tags['Domain_Registered_Date'] = post.regdate;
                    }


                    // 데이터셋 생성
                    return {
                        label: `${post.domain} - ${userAppearanceCount[post.domain]}`,
                        data: [{
                            x: post.regdate,
                            y: post.Hour,
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
        responsive: false,
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
        labels: {
            generateLabels: function(chart) {
                // 현재 존재하는 모든 도메인을 추출
                const domains = chart.data.datasets.map(dataset => {
                    return dataset.label.split(' - ')[0];
                }).filter((value, index, self) => self.indexOf(value) === index); // 중복 제거

                // 각 도메인에 대한 레전드 라벨 생성
                return domains.map(domain => {
                    const dataset = chart.data.datasets.find(ds => ds.label.startsWith(domain));
                    return {
                        text: domain,
                        fillStyle: dataset.backgroundColor,
                        // 다른 필요한 스타일 옵션...
                        hidden: chart.getDatasetMeta(chart.data.datasets.indexOf(dataset)).hidden
                    };
                });
            }
        },
        onClick: (e, legendItem, legend) => {
            const chart = legend.chart;
            const clickedDomain = legendItem.text;

            // 클릭된 도메인에 해당하는 모든 데이터셋의 시각화 상태 토글
            chart.data.datasets.forEach((dataset, index) => {
                const meta = chart.getDatasetMeta(index);
                if (dataset.label.startsWith(clickedDomain)) {
                    meta.hidden = !meta.hidden;
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
        downloadLink.download = 'domain-timeline.png';
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
            <Line ref={chartRef} options={options} data={{ datasets }} height={244} width={732} />
        </>
    );
}

export default DomainTimeline;