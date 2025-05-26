import { useState } from 'react'
import './App.css'
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Question from './pages/questionText';
import QuestionPanel from './pages/questionsPanel';
import QuestionMO from './pages/questionMo';
import QuestionText from './pages/questionText';


function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App;