import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const SuspectTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        axios.get('/timeline/suspect').then((response) => {
            const serverData = response.data;
            const data = serverData.suspect_dicts;

            if (data.length > 0) {
                // 데이터를 그룹화하고 각 그룹에 다른 y 값을 할당
                const groupedData = {};

                data.forEach((suspect, index) => {
                    const username = suspect['username'];
                    const regdate = suspect['regdate'];

                    if (!groupedData[username]) {
                        groupedData[username] = [];
                    }

                    const yValue = suspect['Hour'];

                    const tag = {};

                    // domain 키가 존재하는지 확인하고 추가
                    if ('domain' in suspect) {
                        tag['domain'] = suspect['domain'];
                    }

                    if ('UserType' in suspect) {
                        tag['UserType'] = suspect['UserType'];
                    }

                    // status 키가 존재하는지 확인하고 추가
                    if ('status' in suspect) {
                        tag['status'] = suspect['status'];
                    }

                    // content 키가 존재하는지 확인하고 추가
                    if ('content' in suspect) {
                        tag['content'] = suspect['content'];
                    }

                    // post_type 키가 존재하는지 확인하고 추가
                    if ('post_type' in suspect) {
                        tag['post_type'] = suspect['post_type'];
                    }

                    // title 키가 존재하는지 확인하고 추가
                    if ('title' in suspect) {
                        tag['title'] = suspect['title'];
                    }

                    // url 키가 존재하는지 확인하고 추가
                    if ('url' in suspect) {
                        tag['url'] = suspect['url'];
                    }

                    groupedData[username].push({
                        x: regdate,
                        y: yValue,
                        tag: tag,
                    });
                });

                // Convert groupedData to an array of datasets
                const newDatasets = Object.keys(groupedData).map((username, index) => {
                    const backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
                    return {
                        label: username,
                        fill: false,
                        hidden: false,
                        data: groupedData[username],
                        pointRadius: 7,
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor,
                        borderWidth: 2,
                    };
                });

                // React 상태로 데이터를 설정
                setDatasets(newDatasets);
            } else {
                // 데이터가 없는 경우, 빈 그래프를 보여주도록 datasets 업데이트
                setDatasets([]);
            }
        })
        .catch((error) => {
            // 서버에서 500 오류가 발생한 경우 처리
            console.error('서버 오류:', error);
            // 사용자에게 오류 메시지 표시 또는 다른 오류 처리 작업 수행
        });
    }, [isDone]);

    const options = {
        maintainAspectRatio: true,
        aspectRatio: 3,
        showLine: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                min: 0, // y축의 최소값을 0으로 설정합니다.
                max: 24, // y축의 최대값을 24로 설정합니다.
                display: true,
                ticks: {
                    stepSize: 1, // y축에 1시간 간격으로 눈금을 표시합니다.
                    display: true, // y축의 레이블을 표시합니다.
                    callback: function(value) {
                    return value === 0 ? "undefined" : value;
                    }
                },
                grid: {
                    display: true, // y축에 격자를 표시합니다.
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
                        // 'y' 값을 tag에서 제외
                        label += tagString;
                        return label;
                    },
                },
            },
        },
    };

    return (
        <Line options={options} data={{ datasets }} height={null} width={null}/>
    );
}

export default SuspectTimeline;






