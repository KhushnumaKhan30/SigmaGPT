
import "./Settings.css";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";

function Settings({ onClose }) {
    const { theme, setTheme, user } = useContext(MyContext);

    const username =
        user?.name ||
        user?.username ||
        user?.email ||
        "User";

    return (
        <div className="settingsOverlay" onClick={onClose}>
            <div
                className="settingsModal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="settingsHeader">
                    <h2>Settings</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Appearance */}
                <h3>Appearance</h3>

                <div className="settingItem">
                    <label>Theme</label>

                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>

                {/* Personalization */}
                <h3>Personalization</h3>

                <div className="settingItem">
                    <label>Logged-in user</label>
                    <span>{username}</span>
                </div>

                {/* About */}
                <h3>About</h3>

                <div className="settingItem">
                    <label>Application</label>
                    <span>SigmaGPT</span>
                </div>

                <div className="settingItem">
                    <label>Version</label>
                    <span>1.0</span>
                </div>

                <div className="settingItem">
                    <label>Developer</label>
                    <span>Khushnuma</span>
                </div>
            </div>
        </div>
    );
}

export default Settings;

