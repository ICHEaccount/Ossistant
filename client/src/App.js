import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Toolbar from './components/toolbar';
import Main from './pages/main.js';
import Case from './pages/case';
import Footer from './components/footer.js';
import Test from './pages/test.js';
import Privacy from './pages/privacy.js';


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Toolbar/>
        
        <Routes>
          {/* <Route path="/" element={<Main/>}/> */}
          <Route path="/" element={<Test/>}/>
          <Route path="/main" element={<Main/>}/>
          <Route path="/casepage/:case_id" element={<Case/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
