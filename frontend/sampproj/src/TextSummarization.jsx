import React, { useState } from 'react';

const TextSummarization = ({ onBack }) => {

  const [textInput, setTextInput] = useState('');
  const [summary, setSummary] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState('both');

  // =========================
  // 🔹 SUMMARIZE TEXT
  // =========================
  const handleSummarize = async () => {

    if (!textInput.trim()) {

      alert('Please enter some text to summarize!');

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/summarize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: textInput,
            format:
              outputFormat === "both"
                ? "paragraph"
                : outputFormat
          }),
        }
      );

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {

        throw new Error(
          data.detail || "Summarization failed"
        );
      }

      // 🔥 Remove markdown ** symbols
      const cleanSummary =
        data.summary.replace(/\*\*/g, "");

      // 🔥 Create bullets properly
      const bulletPoints = cleanSummary
      .match(/[^.!?]+[.!?]+/g)
      ?.map(item => item.trim()) || [cleanSummary];

      setSummary({
        paragraph: cleanSummary,
        bullets: bulletPoints
      });

      // 🔥 Keywords from backend
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

    setTextInput('');
    setSummary(null);
    setKeywords([]);
  };

  // =========================
  // 🔹 DOWNLOAD SUMMARY
  // =========================
  const handleDownload = () => {

    if (!summary) return;

    let content =
      `AI TEXT ANALYSIS\n${'='.repeat(40)}\n\n`;

    if (outputFormat !== 'bullets') {

      content +=
        `SUMMARY:\n${summary.paragraph}\n\n`;
    }

    if (outputFormat !== 'paragraph') {

      const bullets = summary.bullets
        .map((b) => `• ${b}`)
        .join('\n');

      content += `KEY INSIGHTS:\n${bullets}\n\n`;
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
      'summary.txt'
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
            Text Summarization
          </h1>

          <p className="page-subtitle">
            Transform lengthy documents into concise summaries
          </p>

        </div>

        <div className="two-column">

          {/* LEFT SIDE */}
          <div>

            <div className="input-group">

              <label>
                Enter Text to Summarize
              </label>

              <textarea
                value={textInput}
                onChange={(e) =>
                  setTextInput(e.target.value)
                }
                style={{
                  minHeight: '300px',
                  resize: 'vertical'
                }}
                placeholder="Paste your text here..."
              />

            </div>

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
                disabled={loading}
              >

                {loading
                  ? 'Summarizing...'
                  : 'Summarize'}

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
                Summary Output
              </div>

              <div className="output-content">

                {summary ? (

                  <>

                    {(outputFormat === 'paragraph' ||
                      outputFormat === 'both') && (

                      <div className="ai-analysis-section">

                        <div className="ai-analysis-label">
                          Summary
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
                          Key Insights
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

                    {/* 🔥 Keywords */}
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
                    Your summary will appear here...
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

export default TextSummarization;