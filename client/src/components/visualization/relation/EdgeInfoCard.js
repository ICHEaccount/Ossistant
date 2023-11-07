import React, { useEffect, useRef, useState } from 'react'

const EdgeInfoCard = (selectedEdge) => {
    const canvasRef = useRef(null); // useRef를 사용하여 캔버스의 HTML 요소에 접근
    const [canvasRect, setCanvasRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

    useEffect(() => {
        if(canvasRef.current){
            const rect = canvasRef.current.getBoundingClientRect(); 
            setCanvasRect(rect);
        }
    },[canvasRef]);

    if (!selectedEdge){
        return null;
    }
    const adjustedTop = ((selectedEdge.y - canvasRect.top) / canvasRect.height) * 100 + '%'; 
    const adjustedLeft = ((selectedEdge.x - canvasRect.left) / canvasRect.width) * 100 + '%';
  return (
    <div style={{ position: 'absolute', top: adjustedTop, left: adjustedLeft }}>
    <div>Selected Edge Info</div>
    <div>Label: {selectedEdge.label}</div>
    <div>From: {selectedEdge.from}</div>
    <div>To: {selectedEdge.to}</div>
  </div>
  )
}

export default EdgeInfoCard