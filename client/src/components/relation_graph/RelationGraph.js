import React,{useState,useEffect,useRef} from 'react';
import Axios from "axios";
import { Network } from 'vis-network';
import {DataSet} from 'vis-data';

const RelationGraph = () => {
    // Create a ref to provide DOM access
	const visJsRef = useRef(null);

    useEffect(() => {
		// Once the ref is created, we'll be able to use vis
        const nodes = new DataSet([
            { id: 1, label: "puritipo.co.kr", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } }, //웹사이트
            { id: 2, label: "beentack.naver.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0e0', size: 50, color: '#D3D3D3' } }, // 이메일
            { id: 3, label: "정영창", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf183', size: 50, color: '#6B8E23' } }, // 인물 
            { id: 4, label: "starlib.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 5, label: "blog.naver.com/beentack8", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 6, label: "cheonan-asan.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 7, label: "s-richman.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 8, label: "puritipo.net", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 9, label: "puritipo.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 10, label: "yeongchang13", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf630', size: 50, color: '#6B8E23' } }, // ID
            { id: 11, label: "천안 웨딩 박람회 주소", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0e0', size: 50, color: '#D3D3D3' } },
            { id: 12, label: "Yeongchang 개인 블로그 주소", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0e0', size: 50, color: '#D3D3D3' } },
            { id: 13, label: "+82 10 8465 2634", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf3cd', size: 50, color: '#00FF00' } }, // 핸드폰
            { id: 14, label: "MINSO@starlib.at", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0e0', size: 50, color: '#D3D3D3' } },
            { id: 15, label: "박민석", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf183', size: 50, color: '#6B8E23' } },
            { id: 16, label: "스타투자컨설팅(사칭)", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf1ad', size: 50, color: '#F0E68C' } },
            { id: 17, label: "스카이컨설팅그룹주식회사(피해자)", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf1ad', size: 50, color: '#F0E68C' } },
            { id: 18, label: "사업자 등록 번호", shape: 'icon', icon: { face: 'FontAwesome', code: '\u{23}', size: 50, color: '#AFEEEE' } },
            { id: 19, label: "스카이컨설팅그룹.com", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf0ac', size: 50, color: '#4169E1' } },
            { id: 20, label: "+82 10 4920 5208", shape: 'icon', icon: { face: 'FontAwesome', code: '\uf3cd', size: 50, color: '#00FF00' } },
        ]);
    
        const edges = new DataSet([
            { from: 1, to: 2, arrows: "to"},
            { from: 1, to: 3, arrows: "to" },
            { from: 2, to: 4, arrows: "to" },
            { from: 2, to: 5, arrows: "to" },
            { from: 2, to: 6, arrows: "to" },
            { from: 2, to: 7, arrows: "to" },
            { from: 2, to: 8, arrows: "to" },
            { from: 2, to: 9, arrows: "to" },
            { from: 5, to: 10, arrows: "to" },
            { from: 10, to: 11, arrows: "to" },
            { from: 11, to: 12, arrows: "to" },
            { from: 1, to: 13, arrows: "to" },
            { from: 13, to: 14, arrows: "to" },
            { from: 14, to: 15, arrows: "to" },
            { from: 14, to: 16, arrows: "to" },
            { from: 16, to: 17, arrows: "to" },
            { from: 17, to: 18, arrows: "to" },
            { from: 17, to: 19, arrows: "to" },
            { from: 20, to: 1, arrows: "to" },
        ]);
    
        const options = {layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed", 
                levelSeparation: 200 
            }
        }};
    
        const network = visJsRef.current && new Network(visJsRef.current, { nodes, edges }, options);
	}, [visJsRef]);

    


    return (
    <div>
        <div ref={visJsRef} style={{height: "500px"}} />
    </div>
    )
}

export default RelationGraph