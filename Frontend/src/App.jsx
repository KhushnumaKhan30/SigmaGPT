import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Auth from './Auth.jsx';
import Landing from './Landing.jsx';
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

const AUTH_API = "https://sigmagpt-backend-xvgs.onrender.com/api/auth";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Controls which public page is displayed
  const [authView, setAuthView] = useState(null);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Check existing login session
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${AUTH_API}/me`, {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSession();
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    theme, setTheme,
    user, setUser,
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${AUTH_API}/logout`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setAuthView(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (checkingAuth) {
    return <div className="authPage">Loading SigmaGPT...</div>;
  }

  // Public landing page
  if (!user && authView === null) {
    return (
      <Landing
        onLogin={() => setAuthView("login")}
        onSignup={() => setAuthView("signup")}
      />
    );
  }

  // Login / Signup page
  if (!user) {
    return (
      <Auth
        onLogin={setUser}
        initialIsSignup={authView === "signup"}
        onBack={() => setAuthView(null)}
      />
    );
  }

  // Logged-in chatbot
 return (
    <div className={`app ${theme}-theme`}>

        <div
            className={`sidebarBackdrop ${isSidebarOpen ? "show" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
        />

        <MyContext.Provider value={providerValues}>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <ChatWindow
                onLogout={handleLogout}
                onMenuClick={() => setIsSidebarOpen(true)}
            />
        </MyContext.Provider>
    </div>
);
}

export default App;   
