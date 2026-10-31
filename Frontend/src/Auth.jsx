
import { useState } from "react";
import "./Auth.css";

const API = "https://sigmagpt-backend-xvgs.onrender.com/api/auth";

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Frontend password validation
    if (isSignup && !passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      onLogin(data.user);

    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function toggleAuth() {
    setIsSignup(!isSignup);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>

        <h1>SigmaGPT</h1>

        <p>
          {isSignup
            ? "Create your account"
            : "Welcome back"}
        </p>

        {isSignup && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="name"
            maxLength={80}
            required
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          autoComplete="email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete={
            isSignup ? "new-password" : "current-password"
          }
          minLength={isSignup ? 8 : undefined}
          maxLength={72}
          required
        />

        {isSignup && (
          <small className="passwordHint">
            Password must contain:
            <br />
            • At least 8 characters
            <br />
            • One uppercase letter (A-Z)
            <br />
            • One lowercase letter (a-z)
            <br />
            • One number (0-9)
            <br />
            • One special character (@, #, $, !)
          </small>
        )}

        {error && (
          <p className="authError" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
              ? "Create Account"
              : "Log In"}
        </button>

        <p className="authSwitch">
          {isSignup
            ? "Already have an account?"
            : "New to SigmaGPT?"}

          {" "}

          <button
            type="button"
            className="authLink"
            onClick={toggleAuth}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>

      </form>
    </main>
  );
}

export default Auth;
