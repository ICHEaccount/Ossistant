import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';
///import 'chartjs-adapter-date-fns';

const SuspectTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
    const params = useParams();
    const case_id = params.case_id;

    useEffect(() => {
        axios.get(`/timeline/suspect/${case_id}`).then((response) => {
            const serverData = response.data;
            const data = serverData.suspect_dicts;

            if (data.length > 0) {
                // username 별로 출현 횟수를 추적하는 객체
                const userAppearanceCount = {};

                const datasets = data.map((suspect) => {
                    // 해당 username의 출현 횟수를 업데이트하거나 초기화
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


                    // 데이터셋 생성
                    return {
                        label: `${suspect.username} - ${userAppearanceCount[suspect.username]}`,
                        data: [{
                            x: suspect.regdate,
                            y: suspect.Hour,
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
    }, [isDone]);

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

    return (
        <Line options={options} data={{ datasets }} height={null} width={null}/>
    );
}

export default SuspectTimeline;






