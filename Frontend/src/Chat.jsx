
import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);

    // Ensure prevChats is always treated as an array
    const chats = Array.isArray(prevChats) ? prevChats : [];

    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        // When loading an old chat, show its saved messages directly
        if (reply == null || reply === "" || chats.length === 0) {
            setLatestReply(null);
            return;
        }

        const content = reply.split(" ");
        let idx = 0;

        setLatestReply("");

        const interval = setInterval(() => {
            idx++;

            setLatestReply(content.slice(0, idx).join(" "));

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [reply, prevChats]);

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}

            <div className="chats">
                {/* Display all messages except the last one */}
                {chats.slice(0, -1).map((chat, idx) => (
                    <div
                        className={
                            chat.role === "user" ? "userDiv" : "gptDiv"
                        }
                        key={chat._id || idx}
                    >
                        {chat.role === "user" ? (
                            <p className="userMsg">{chat.content}</p>
                        ) : (
                            <div className="gptMsg">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {chat.content || ""}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}

                {/* Display the last message or animate the latest reply */}
                {chats.length > 0 && (
                    <div
                        className={
                            chats[chats.length - 1].role === "user"
                                ? "userDiv"
                                : "gptDiv"
                        }
                        key={chats[chats.length - 1]._id || "last-message"}
                    >
                        {chats[chats.length - 1].role === "user" ? (
                            <p className="userMsg">
                                {chats[chats.length - 1].content}
                            </p>
                        ) : (
                            <div className="gptMsg">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {latestReply !== null
                                        ? latestReply
                                        : chats[chats.length - 1].content || ""}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Chat;
