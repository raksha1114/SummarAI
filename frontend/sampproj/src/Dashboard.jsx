import React from 'react';

const Dashboard = ({ user, onNavigate, onLogout }) => {
  const features = [
    {
      id: 'textSummarization',
      icon: '📝',
      title: 'Text Summarization',
      description: 'Paste your text and get intelligent summaries with key points extracted',
      color: 'text'
    },
    {
      id: 'pdfSummarization',
      icon: '📄',
      title: 'PDF Summarization',
      description: 'Upload PDFs and extract intelligent summaries and key insights',
      color: 'pdf'
    },
    {
      id: 'chatWithPdf',
      icon: '💬',
      title: 'Chat with PDF',
      description: 'Upload a PDF and ask questions to get instant answers from the document',
      color: 'chat'
    }
  ];

  const fullName = user?.full_name || "User";

  const firstName = fullName.split(' ')[0];

const initials = firstName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div style={{ fontWeight: '600' }}>{user?.full_name || 'User'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              AI Processing
            </div>
          </div>
          <button className="btn btn-secondary logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="feature-grid">
        {features.map(feature => (
          <div
            key={feature.id}
            className="feature-card"
            onClick={() => onNavigate(feature.id)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h2 className="feature-title">{feature.title}</h2>
            <p className="feature-desc">{feature.description}</p>
            <button className="btn btn-primary">Get Started →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;