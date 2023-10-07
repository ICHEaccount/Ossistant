import './App.css';
import React,{useState,useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Toolbar from './components/toolbar';
import Main from './pages/main.js';
import Case from './pages/case';
import RelationGraph from './components/relationGraph';
import Timeline from './components/timeline';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Toolbar/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/case/:case_id" element={<Case/>}/>
          <Route path="/relgraph" element={<RelationGraph/>}/>
          <Route path="/timeline" element={<Timeline/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
