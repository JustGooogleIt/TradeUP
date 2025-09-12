import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TradeSelection from './pages/TradeSelection';
import ResumeUpload from './pages/ResumeUpload';
import QuestionFlow from './pages/QuestionFlow';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<TradeSelection />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/questions/:questionId" element={<QuestionFlow />} />
            <Route path="/results" element={<Results />} />
            <Route path="/demo" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;