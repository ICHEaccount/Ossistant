import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';
import {changeBehavior} from '../../../reducers/node'
import { useSelector, useDispatch } from 'react-redux'
import downloadIcon from './download_image.png';

const WholeTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
    const params = useParams();
    const case_id = params.case_id;
    const dispatch = useDispatch()
    const behavior = useSelector(state => state.node.behavior)
    const chartRef = useRef(null); // 캔버스 참조 생성

    useEffect(() => {
        axios.get(`/timeline/whole/${case_id}`).then((response) => {
            const serverData = response.data;
            const data = serverData.whole_dicts;

            if (data.length > 0) {
                // username 별로 출현 횟수를 추적하는 객체
                const userAppearanceCount = {};

                const datasets = data.map((item) => {
                    // 해당 username의 출현 횟수를 업데이트하거나 초기화
                    if (userAppearanceCount[item.Event]) {
                        userAppearanceCount[item.Event] += 1;
                    } else {
                        userAppearanceCount[item.Event] = 1;
                    }
                    // 태그 객체 생성
                    const tags = {};
                    if (item.title) {
                        tags['Title'] = item.title;
                    }
                    if (item.UserType) {
                        tags['UserType'] = item.UserType;
                    }
                    if (item.url) {
                        tags['Url'] = item.url;
                    }
                    if (item.name) {
                        tags['Name'] = item.name;
                    }
                    if (item.username) {
                        tags['Username'] = item.username;
                    }
                    if (item.post_num) {
                        tags['Post_num'] = item.post_num;
                    }
                    if (item.writer) {
                        tags['Writer'] = item.writer;
                    }
                    if (item.number) {
                        tags['Phone_number'] = item.number;
                    }
                    if (item.business_num) {
                        tags['Business_num'] = item.business_num;
                    }
                    if (item.email) {
                        tags['Email'] = item.email;
                    }
                    if (item.sender) {
                        tags['Sender'] = item.sender;
                    }
                    if (item.domain) {
                        tags['Domain'] = item.domain;
                    }



                    // 데이터셋 생성
                    return {
                        label: `${item.Event} - ${userAppearanceCount[item.Event]}`,
                        data: [{
                            x: item.regdate,
                            y: item.Hour,
                            tag: tags
                        }],
                        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
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
        },
    };

    const handleDownload = () => {
    const chart = chartRef.current;
    if (chart) {
        const canvas = chart.canvas;
        const imageUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = 'whole-timeline.png';
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

export default WholeTimeline;