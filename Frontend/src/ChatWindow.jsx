
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import Settings from "./Settings.jsx";
import { API_ENDPOINTS, defaultHeaders } from "./apiConfig.js";

function ChatWindow({ onLogout, onMenuClick }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setNewChat(false);

    console.log("message ", prompt, " threadId ", currThreadId);

    const options = {
      method: "POST",
      credentials: "include",
      headers: defaultHeaders,
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        API_ENDPOINTS.CHAT,
        options
      );

      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setShowSettings(true);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <button className="menuButton" onClick={onMenuClick}>
          <i className="fa-solid fa-bars"></i>
        </button>

        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div
            className="dropDownItem"
            onClick={handleSettingsClick}
          >
            <i className="fa-solid fa-gear"></i> Settings
          </div>

          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>

          <div
            className="dropDownItem"
            onClick={handleLogoutClick}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Log out
          </div>
        </div>
      )}

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply();
            }}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default ChatWindow;

