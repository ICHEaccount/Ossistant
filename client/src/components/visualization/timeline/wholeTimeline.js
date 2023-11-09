import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const WholeTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        axios.get('/timeline/whole').then((response) => {
            const serverData = response.data;
            const data = serverData.whole_dicts;

            if (data.length > 0) {
                // 데이터를 그룹화하고 각 그룹에 다른 y 값을 할당
                const groupedData = {};

                data.forEach((item) => {
                    const event = item.Event;
                    const regdate = item.regdate;
                    const hour = item.Hour; // Hour 값을 y로 사용합니다.

                    if (!groupedData[event]) {
                        groupedData[event] = [];
                    }

                    const tag = {};

                    // domain 키가 존재하는지 확인하고 추가
                    if ('domain' in item) {
                        tag['domain'] = item['domain'];
                    }

                    if ('UserType' in item) {
                        tag['UserType'] = item['UserType'];
                    }

                    // status 키가 존재하는지 확인하고 추가
                    if ('status' in item) {
                        tag['status'] = item['status'];
                    }

                    // content 키가 존재하는지 확인하고 추가
                    if ('content' in item) {
                        tag['content'] = item['content'];
                    }

                    // post_type 키가 존재하는지 확인하고 추가
                    if ('post_type' in item) {
                        tag['post_type'] = item['post_type'];
                    }

                    // title 키가 존재하는지 확인하고 추가
                    if ('title' in item) {
                        tag['title'] = item['title'];
                    }

                    // url 키가 존재하는지 확인하고 추가
                    if ('url' in item) {
                        tag['url'] = item['url'];
                    }

                    // sender 키가 존재하는지 확인하고 추가
                    if ('sender' in item) {
                        tag['sender'] = item['sender'];
                    }

                    // name 키가 존재하는지 확인하고 추가
                    if ('name' in item) {
                        tag['name'] = item['name'];
                    }

                    // content 키가 존재하는지 확인하고 추가
                    if ('content' in item) {
                        tag['content'] = item['content'];
                    }

                    // writer 키가 존재하는지 확인하고 추가
                    if ('writer' in item) {
                        tag['writer'] = item['writer'];
                    }

                    // name 키가 존재하는지 확인하고 추가
                    if ('username' in item) {
                        tag['username'] = item['username'];
                    }

                    // name 키가 존재하는지 확인하고 추가
                    if ('rank' in item) {
                        tag['rank'] = item['rank'];
                    }

                    // name 키가 존재하는지 확인하고 추가
                    if ('post_num' in item) {
                        tag['post_num'] = item['post_num'];
                    }

                    groupedData[event].push({
                        x: regdate,
                        y: hour, // 여기에서 Hour 값을 y로 사용합니다.
                        tag: tag,
                    });
                });

                // Convert groupedData to an array of datasets
                const newDatasets = Object.keys(groupedData).map((event) => {
                    const backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
                    return {
                        label: event,
                        fill: false,
                        hidden: true,
                        data: groupedData[event],
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
            // 서버에서 오류가 발생한 경우 처리
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
                        return label + tagString;
                    },
                },
            },
        },
    };

    return (
            <Line options={options} data={{ datasets }} height={null} width={null} />
    );
}

export default WholeTimeline;