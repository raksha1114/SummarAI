import React, { useState, useRef, useEffect } from 'react';

const ChatWithPdf = ({ onBack }) => {

  const [uploadedFile, setUploadedFile] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  const [question, setQuestion] = useState('');

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);

  // =========================
  // 🔹 AUTO SCROLL
  // =========================
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [chatHistory]);

  // =========================
  // 🔹 CLEAN RESPONSE
  // =========================
  const formatResponse = (text) => {

    return text
      .replace(/\*\*/g, '')
      .replace(/##/g, '')
      .replace(/\*/g, '•')
      .replace(/\n/g, '\n\n')
      .trim();
  };

  // =========================
  // 🔹 UPLOAD PDF
  // =========================
  const handleFileUpload = (event) => {

    const file = event.target.files?.[0];

    if (file && file.type === 'application/pdf') {

      setUploadedFile(file);

      setChatHistory([]);

      setQuestion('');

    } else {

      alert('Please upload a valid PDF file');
    }
  };

  // =========================
  // 🔹 ASK QUESTION
  // =========================
  const handleAskQuestion = async () => {

    if (!question.trim()) {

      alert("Please enter a question");

      return;
    }

    if (!uploadedFile) {

      alert("Please upload a PDF first");

      return;
    }

    // 🔹 User message
    const userMessage = {

      role: "user",

      text: question

    };

    setChatHistory(prev => [...prev, userMessage]);

    setLoading(true);

    const currentQuestion = question;

    setQuestion('');

    try {

      // =========================
      // 🔹 STEP 1: Upload PDF
      // =========================
      const formData = new FormData();

      formData.append("file", uploadedFile);

      const uploadResponse = await fetch(
        "http://127.0.0.1:8000/api/upload-pdf",
        {
          method: "POST",
          body: formData
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {

        throw new Error(
          uploadData.detail || "PDF upload failed"
        );
      }

      // =========================
      // 🔹 STEP 2: Ask Question
      // =========================
      const askResponse = await fetch(
        `http://127.0.0.1:8000/api/ask?query=${encodeURIComponent(currentQuestion)}`,
        {
          method: "POST"
        }
      );

      const askData = await askResponse.json();

      if (!askResponse.ok) {

        throw new Error(
          askData.detail || "Failed to get answer"
        );
      }

      // =========================
      // 🔹 AI MESSAGE
      // =========================
      const aiMessage = {

        role: "ai",

        text: formatResponse(
          askData.answer || "No answer found"
        )

      };

      setChatHistory(prev => [...prev, aiMessage]);

    } catch (error) {

      console.error(error);

      const errorMessage = {

        role: "ai",

        text: "Error: " + error.message

      };

      setChatHistory(prev => [...prev, errorMessage]);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // 🔹 CLEAR PDF
  // =========================
  const handleClearPdf = () => {

    setUploadedFile(null);

    setChatHistory([]);

    setQuestion('');

    if (fileInputRef.current) {

      fileInputRef.current.value = '';
    }
  };

    // =========================
  // 🔹 DOWNLOAD CHAT
  // =========================
  const handleDownloadChat = () => {

    if (chatHistory.length === 0) {

      alert("No chat available to download");

      return;
    }

    let content = `CHAT WITH PDF\n`;
    content += `${'='.repeat(40)}\n\n`;

    if (uploadedFile) {

      content += `PDF File: ${uploadedFile.name}\n\n`;
    }

    chatHistory.forEach((msg) => {

      if (msg.role === "user") {

        content += `You:\n${msg.text}\n\n`;

      } else {

        content += `AI:\n${msg.text}\n\n`;
      }
    });

    const element = document.createElement("a");

    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(content)
    );

    element.setAttribute(
      "download",
      "chat-with-pdf.txt"
    );

    element.style.display = "none";

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  // =========================
  // 🔹 ENTER KEY
  // =========================
  const handleKeyPress = (e) => {

    if (
      e.key === 'Enter' &&
      !loading &&
      uploadedFile
    ) {

      handleAskQuestion();
    }
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

        {/* HEADER */}
        <div className="page-header">

          <h1 className="page-title">
            Chat with PDF
          </h1>

          <p className="page-subtitle">
            Upload a PDF and ask unlimited questions
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
                Upload PDF
              </div>

              <div className="upload-subtext">
                Select a document to chat with
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
                  color: '#00ffcc',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}
              >

                ✓ {uploadedFile.name}

              </div>
            )}

            <button
              className="btn btn-secondary"
              style={{
                width: '100%',
                marginTop: '12px'
              }}
              onClick={handleClearPdf}
            >
              Clear PDF
            </button>
                        {/* DOWNLOAD CHAT */}
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '12px'
              }}
              onClick={handleDownloadChat}
              disabled={chatHistory.length === 0}
            >
              Download Chat
            </button>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="output-box">

              <div className="output-title">
                Conversation
              </div>

              <div
                className="chat-container"
                style={{
                  minHeight: "400px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "10px"
                }}
              >

                {chatHistory.length === 0 ? (

                  <p
                    style={{
                      color:
                        'var(--text-secondary)',
                      opacity: 0.7
                    }}
                  >
                    Upload a PDF and start asking questions...
                  </p>

                ) : (

                  <>
                    {chatHistory.map((msg, idx) => (

                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent:
                            msg.role === "user"
                              ? "flex-end"
                              : "flex-start",
                          marginBottom: "14px"
                        }}
                      >

                        <div
                          style={{
                            background:
                              msg.role === "user"
                                ? "#4f46e5"
                                : "#1f2937",

                            color: "white",

                            padding: "14px",

                            borderRadius: "14px",

                            maxWidth: "80%",

                            lineHeight: "1.8",

                            whiteSpace: "pre-wrap",

                            wordBreak: "break-word"
                          }}
                        >

                          {msg.text}

                        </div>

                      </div>
                    ))}

                    {/* LOADING */}
                    {loading && (

                      <div
                        style={{
                          marginBottom: "12px"
                        }}
                      >

                        <div
                          style={{
                            background: "#1f2937",
                            color: "white",
                            padding: "12px",
                            borderRadius: "12px",
                            width: "120px"
                          }}
                        >

                          Thinking...

                        </div>

                      </div>
                    )}

                    <div ref={messagesEndRef} />

                  </>
                )}

              </div>

            </div>

            {/* INPUT */}
            {uploadedFile && (

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}
              >

                <input
                  type="text"
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything from the PDF..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid #333",
                    background: "#111827",
                    color: "white",
                    outline: "none"
                  }}
                />

                <button
                  className="btn btn-primary"
                  onClick={handleAskQuestion}
                  disabled={
                    loading ||
                    !question.trim()
                  }
                >

                  Ask

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChatWithPdf;