import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Toolbar from './components/toolbar';
import Main from './pages/main.js';
import Case from './pages/case';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Toolbar/>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/casepage/:case_id" element={<Case/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
