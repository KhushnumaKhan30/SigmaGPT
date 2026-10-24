import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import blacklogo from "./assets/blacklogo.png";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("https://sigmagpt-backend-xvgs.onrender.com/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

   
const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setNewChat(false);
    setReply(null);

    try {
        const response = await fetch(
            `https://sigmagpt-backend-xvgs.onrender.com/api/thread/${newThreadId}`
        );

        if (!response.ok) {
            throw new Error(`Failed to load thread: ${response.status}`);
        }

        const res = await response.json();

        console.log("Selected thread:", res);

        // Extract the messages array from the thread object
        const messages = Array.isArray(res.messages)
            ? res.messages
            : [];

        setPrevChats(messages);
        setPrompt("");
    } catch (err) {
        console.error("Error loading previous chat:", err);
        setPrevChats([]);
    }
};
 

    

const deleteThread = async (threadId) => {
    try {
        const response = await fetch(
            `https://sigmagpt-backend-xvgs.onrender.com/api/thread/${threadId}`,
            { method: "DELETE" }
        );

        const result = await response.json();
        console.log("Delete status:", response.status);
        console.log("Delete result:", result);

        if (!response.ok) {
            console.error("Backend could not delete the thread:", result);
            alert(result.error || result.message || "Failed to delete thread");
            return;
        }

        setAllThreads(prev =>
            prev.filter(thread => thread.threadId !== threadId)
        );

        if (threadId === currThreadId) {
            createNewChat();
        }
    } catch (error) {
        console.error("Delete request failed:", error);
        alert("Cannot connect to the backend. Check whether it is running.");
    }
};


    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src={blacklogo} alt="SigmaGPT logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By Khushnuma &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;