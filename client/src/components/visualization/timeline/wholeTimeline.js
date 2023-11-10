//import React from 'react'
//
//const WholeTimeline = () => {
//  return (
//    <div>WholeTimeline</div>
//  )
//}
//
//export default WholeTimeline

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
//import { useParams } from 'react-router-dom';
///import 'chartjs-adapter-date-fns';

const WholeTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
//    const params = useParams();
//    const case_id = params.case_id;

    useEffect(() => {
        axios.get(`/timeline/whole/${10}`).then((response) => {
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
                    if (item.rank) {
                        tags['Rank'] = item.rank;
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
                    if (item.content) {
                        tags['Content'] = item.content;
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
    }, [isDone]);

    // 그래프 옵션
    const options = {
        maintainAspectRatio: false,
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
        <div>
            <Line options={options} data={{ datasets }} style={{ height: "200px", width: "840px" }} />
        </div>
    );
}

export default WholeTimeline;