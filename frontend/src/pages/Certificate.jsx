// Certificate.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Certitifcate.css';

const API = "http://127.0.0.1:8000";

const Certificate = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState({ name: '', type: '' });
  const navigate = useNavigate();
  const certificateViewRef = useRef(null);

  // Navigation
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Load user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      navigate('/');
      return;
    }

    const loadUserData = async () => {
      try {
        const res = await fetch(`${API}/user/${storedUser.username}`);
        if (!res.ok) throw new Error('Failed to load user data');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Backend not running");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // View certificate
  const viewCertificate = (name, type) => {
    setCurrentCertificate({ name, type });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle click outside modal
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Download PDF
  const downloadCertificate = () => {
    const element = certificateViewRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `${user.username}_${currentCertificate.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#fdfcfb'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    const downloadBtn = document.getElementById('downloadPdf');
    if (downloadBtn) {
      downloadBtn.innerHTML = '<i className="fas fa-spinner fa-spin"></i> Generating PDF...';
      downloadBtn.disabled = true;
    }

    // Dynamically load html2pdf if not available
    if (typeof html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js';
      script.onload = () => {
        html2pdf().set(opt).from(element).save().finally(() => {
          if (downloadBtn) {
            downloadBtn.innerHTML = '<i className="fas fa-download"></i> Download PDF';
            downloadBtn.disabled = false;
          }
        });
      };
      document.body.appendChild(script);
    } else {
      html2pdf().set(opt).from(element).save().finally(() => {
        if (downloadBtn) {
          downloadBtn.innerHTML = '<i className="fas fa-download"></i> Download PDF';
          downloadBtn.disabled = false;
        }
      });
    }
  };

  // Print certificate
  const printCertificate = () => {
    const printContent = certificateViewRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Certificate</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
          }
          @media print {
            @page { margin: 0; }
            body { padding: 0; }
          }
          ${document.querySelector('style')?.innerHTML || ''}
          .certificate-view {
            min-height: 600px;
            padding: 40px;
          }
        </style>
      </head>
      <body>
        ${printContent.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="certificate-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your certificates...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="certificate-page">
        <div className="empty-state">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Unable to load certificates</h3>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  const subjectCerts = user.subjectCertificates || [];
  const levelCerts = user.levelCertificates || [];
  const hasCertificates = subjectCerts.length > 0 || levelCerts.length > 0;

  return (
    <div className="certificate-page">
      <button onClick={goToDashboard} className="back-button">
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>

      <h2>Your Certificates</h2>

      <div id="certs">
        {!hasCertificates ? (
          <div className="empty-state">
            <i className="fas fa-award"></i>
            <h3>No Certificates Yet</h3>
            <p>Complete quizzes to earn certificates</p>
          </div>
        ) : (
          <>
            {subjectCerts.map((subject, index) => (
              <div className="certificate-card" key={`subject-${index}`}>
                <div className="certificate-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h3>{subject}</h3>
                <p>Subject Certificate</p>
                <button onClick={() => viewCertificate(subject, 'subject')}>
                  <i className="fas fa-eye"></i> View Certificate
                </button>
              </div>
            ))}
            
            {levelCerts.map((level, index) => (
              <div className="certificate-card level" key={`level-${index}`}>
                <div className="certificate-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>Level {level} Certificate</h3>
                <p>Achievement Certificate</p>
                <button onClick={() => viewCertificate(`Level ${level}`, 'level')}>
                  <i className="fas fa-eye"></i> View Certificate
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Certificate Modal */}
      {showModal && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            
            <div 
              ref={certificateViewRef}
              className={`certificate-view ${currentCertificate.type === 'level' ? 'level-cert' : ''}`}
            >
              <div className="certificate-header">
                <h1>CERTIFICATE OF ACHIEVEMENT</h1>
                <h2>{currentCertificate.type === 'level' ? 'LEVEL COMPLETION' : 'SUBJECT MASTERY'}</h2>
              </div>
              
              <div className="badge">
                <i className={`fas ${currentCertificate.type === 'level' ? 'fa-star' : 'fa-leaf'}`}></i>
              </div>
              
              <div className="certificate-body">
                <p>This certifies that</p>
                <p className="certificate-username">{user.username}</p>
                <p>has successfully {currentCertificate.type === 'level' ? 'completed' : 'mastered'}</p>
                <p className="certificate-details">{currentCertificate.name}</p>
                <p>and is hereby awarded this certificate</p>
                <p className="certificate-date">
                  Awarded on {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="certificate-footer">
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Academic Director</p>
                </div>
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Head of Education</p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button id="downloadPdf" className="btn-download" onClick={downloadCertificate}>
                <i className="fas fa-download"></i> Download PDF
              </button>
              <button className="btn-print" onClick={printCertificate}>
                <i className="fas fa-print"></i> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;