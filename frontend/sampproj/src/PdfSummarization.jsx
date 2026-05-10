import React, { useState, useRef } from 'react';

const PdfSummarization = ({ onBack }) => {

  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState('both');

  const fileInputRef = useRef(null);

  // =========================
  // 🔹 FILE UPLOAD
  // =========================
  const handleFileUpload = (event) => {

    const file = event.target.files?.[0];

    if (file && file.type === 'application/pdf') {

      setUploadedFile(file);

      setSummary(null);

      setKeywords([]);

    } else {

      alert('Please upload a valid PDF file');
    }
  };

  // =========================
  // 🔹 SUMMARIZE PDF
  // =========================
  const handleSummarize = async () => {

    if (!uploadedFile) {

      alert('Please upload a PDF first!');

      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", uploadedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/api/summarize-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("PDF API Response:", data);

      if (!response.ok) {

        throw new Error(
          data.detail || "PDF summarization failed"
        );
      }

      // 🔥 Remove markdown symbols
      const cleanSummary =
        data.summary.replace(/\*\*/g, "");

      // 🔥 Convert to bullets
      const bulletPoints =
        cleanSummary
          .match(/[^.!?]+[.!?]+/g)
          ?.map(item => item.trim()) || [cleanSummary];

      setSummary({

        paragraph: cleanSummary,

        bullets: bulletPoints
      });

      // 🔥 Keywords
      setKeywords(data.keywords || []);

    } catch (error) {

      console.error(error);

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // 🔹 CLEAR
  // =========================
  const handleClear = () => {

    setUploadedFile(null);

    setSummary(null);

    setKeywords([]);

    if (fileInputRef.current) {

      fileInputRef.current.value = '';
    }
  };

  // =========================
  // 🔹 DOWNLOAD
  // =========================
  const handleDownload = () => {

    if (!summary) return;

    let content =
      `PDF ANALYSIS REPORT\n${'='.repeat(40)}\n\n`;

    content += `FILE NAME: ${uploadedFile?.name}\n\n`;

    if (outputFormat !== 'bullets') {

      content +=
        `SUMMARY:\n${summary.paragraph}\n\n`;
    }

    if (outputFormat !== 'paragraph') {

      const bullets = summary.bullets
        .map((b) => `• ${b}`)
        .join('\n');

      content +=
        `KEY TAKEAWAYS:\n${bullets}\n\n`;
    }

    if (keywords.length > 0) {

      content +=
        `KEYWORDS:\n${keywords.join(', ')}`;
    }

    const element =
      document.createElement('a');

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(content)
    );

    element.setAttribute(
      'download',
      'pdf-summary.txt'
    );

    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (

    <div className="dashboard-container">

      <a
        className="back-button"
        onClick={onBack}
      >
        ← Back to Dashboard
      </a>

      <div className="page-content">

        <div className="page-header">

          <h1 className="page-title">
            PDF Summarization
          </h1>

          <p className="page-subtitle">
            Extract intelligent insights from PDF documents
          </p>

        </div>

        <div className="two-column">

          {/* LEFT SIDE */}
          <div>

            <div
              className="upload-area"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <div className="upload-icon">
                📤
              </div>

              <div className="upload-text">
                Click to upload PDF
              </div>

              <div className="upload-subtext">
                Upload your PDF document here
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

            </div>

            {uploadedFile && (

              <div
                style={{
                  marginTop: '16px',
                  color: 'var(--accent)',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              >
                ✓ {uploadedFile.name}
              </div>
            )}

            {/* FORMAT */}
            <div className="format-selector">

              <div className="format-selector-label">
                Output Format
              </div>

              <div className="format-toggle-group">

                <button
                  className={`format-toggle-btn${
                    outputFormat === 'paragraph'
                      ? ' active'
                      : ''
                  }`}
                  onClick={() =>
                    setOutputFormat('paragraph')
                  }
                >
                  ¶ Paragraph
                </button>

                <button
                  className={`format-toggle-btn${
                    outputFormat === 'bullets'
                      ? ' active'
                      : ''
                  }`}
                  onClick={() =>
                    setOutputFormat('bullets')
                  }
                >
                  ◈ Bullets
                </button>

                <button
                  className={`format-toggle-btn${
                    outputFormat === 'both'
                      ? ' active'
                      : ''
                  }`}
                  onClick={() =>
                    setOutputFormat('both')
                  }
                >
                  ⊞ Both
                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="button-group">

              <button
                className="btn btn-primary"
                onClick={handleSummarize}
                disabled={!uploadedFile || loading}
              >

                {loading
                  ? 'Summarizing...'
                  : 'Summarize PDF'}

              </button>

              <button
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="output-box">

              <div className="output-title">
                Summarization Results
              </div>

              <div className="output-content">

                {summary ? (

                  <>

                    {(outputFormat === 'paragraph' ||
                      outputFormat === 'both') && (

                      <div className="ai-analysis-section">

                        <div className="ai-analysis-label">
                          Document Summary
                        </div>

                        <p className="ai-analysis-paragraph">
                          {summary.paragraph}
                        </p>

                      </div>
                    )}

                    {(outputFormat === 'bullets' ||
                      outputFormat === 'both') && (

                      <div className="ai-analysis-section">

                        <div className="ai-analysis-label">
                          Key Takeaways
                        </div>

                        <ul className="ai-bullet-list">

                          {summary.bullets.map(
                            (point, i) => (

                              <li key={i}>
                                {point.endsWith('.')
                                  ? point
                                  : point + '.'}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )}

                    {/* 🔥 KEYWORDS */}
                    <div
                      style={{
                        marginTop: "20px"
                      }}
                    >

                      <div className="ai-analysis-label">
                        Keywords
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          marginTop: "10px"
                        }}
                      >

                        {keywords.map((word, index) => (

                          <span
                            key={index}
                            style={{
                              background: "#1e293b",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "14px"
                            }}
                          >
                            {word}
                          </span>
                        ))}

                      </div>

                    </div>

                  </>

                ) : (

                  <p
                    style={{
                      color:
                        'var(--text-secondary)',
                      opacity: 0.7
                    }}
                  >
                    Upload a PDF to get started...
                  </p>

                )}

              </div>

            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '12px'
              }}
              onClick={handleDownload}
              disabled={!summary}
            >
              Download
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PdfSummarization;