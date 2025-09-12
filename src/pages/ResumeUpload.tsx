import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { extractSkillsFromResume } from '../utils/aiProcessor';

const ResumeUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [extractedSkillsCount, setExtractedSkillsCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { 
    resumeFile, 
    setResumeFile, 
    setResumeSkills, 
    isAnalyzing, 
    setIsAnalyzing 
  } = useAppContext();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    setResumeFile(file);
    setUploadStatus('analyzing');
    setIsAnalyzing(true);

    try {
      const skills = await extractSkillsFromResume(file);
      setResumeSkills(skills);
      setExtractedSkillsCount(skills.length);
      setUploadStatus('complete');
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again.');
      setUploadStatus('idle');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    navigate('/questions/1');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container">
      <div className="card p-4 fade-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '1rem'
          }}>
            Let's learn about your background
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Upload your resume so we can identify your transferable skills and experience.
          </p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {uploadStatus === 'idle' && (
            <div
              className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
              style={{
                border: dragActive ? '3px dashed #667eea' : '2px dashed #ccc',
                borderRadius: '20px',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: dragActive ? '#f0f4ff' : '#fafafa',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
              <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
                Drag and drop your resume here
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                or click to browse your files
              </p>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>
                Supports PDF, DOC, and DOCX files
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {uploadStatus === 'analyzing' && (
            <div className="analyzing-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div className="loading-spinner mb-4"></div>
              <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
                Analyzing your resume...
              </h3>
              <p style={{ color: '#666' }}>
                Our AI is extracting your skills and experience
              </p>
            </div>
          )}

          {uploadStatus === 'complete' && resumeFile && (
            <div className="complete-section slide-in" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem' }}>
                Resume analyzed successfully!
              </h3>
              <div style={{ 
                background: '#f0f4ff', 
                border: '1px solid #e0e6ff',
                borderRadius: '10px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  <strong>{resumeFile.name}</strong>
                </p>
                <p style={{ color: '#667eea', fontSize: '1rem' }}>
                  {extractedSkillsCount} relevant skills identified
                </p>
              </div>
              
              <button 
                className="btn-primary"
                onClick={handleContinue}
                style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
              >
                Continue to Questions →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;