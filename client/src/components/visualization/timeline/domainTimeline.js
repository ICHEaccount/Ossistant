//import React, { useEffect, useState } from 'react'
//import {
//    Chart as ChartJS,
//    CategoryScale,
//    LinearScale,
//    PointElement,
//    LineElement,
//    Title,
//    Tooltip,
//    Legend,
//} from 'chart.js';
//import { Line } from 'react-chartjs-2';
//import axios from 'axios';
//
//ChartJS.register(
//    CategoryScale,
//    LinearScale,
//    PointElement,
//    LineElement,
//    Title,
//    Tooltip,
//    Legend
//);

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';
///import 'chartjs-adapter-date-fns';

const DomainTimeline = (props) => {
    const isDone = props.isDone;
    const [datasets, setDatasets] = useState([]);
    const params = useParams();
    const case_id = params.case_id;

    useEffect(() => {
        axios.get(`/timeline/post/${case_id}`).then((response) => {
            const serverData = response.data;
            const data = serverData.post_dicts;

            if (data.length > 0) {
                // username 별로 출현 횟수를 추적하는 객체
                const userAppearanceCount = {};

                const datasets = data.map((post) => {
                    // 해당 username의 출현 횟수를 업데이트하거나 초기화
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

export default DomainTimeline;