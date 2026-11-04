
import "./Landing.css";

function Landing({ onLogin, onSignup }) {
  return (
    <main className="landing">

<nav className="landingNav">
    <a href="#home" className="brand">
        ✦ SigmaGPT
    </a>

    <div className="navLinks">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>

        <button className="navLogin" onClick={onLogin}>
            Log In
        </button>

        <button className="navSignup" onClick={onSignup}>
            Get Started
        </button>
    </div>
</nav>


      <section className="hero" id="home">
        <div className="heroContent">
          <span className="heroTag">
            YOUR PERSONAL AI ASSISTANT
          </span>

          <h1>
            Think smarter.
            <br />
            <span>Create faster.</span>
          </h1>

          <p>
            Meet SigmaGPT, your intelligent AI companion.
            Ask questions, explore ideas, learn new things
            and make your everyday tasks easier.
          </p>

          <div className="heroButtons">
            <button onClick={onSignup}>
              Get Started <span>→</span>
            </button>

            <button className="secondaryBtn" onClick={onLogin}>
              I already have an account
            </button>
          </div>
        </div>

        <div className="heroVisual">
          <div className="visualGlow"></div>
          <div className="chatPreview">
            <div className="previewHeader">
              <span>✦ SigmaGPT</span>
              <span>● Online</span>
            </div>

            <div className="previewMessages">
              <div className="previewUser">
                Explain artificial intelligence simply.
              </div>

              <div className="previewAI">
                <strong>✦ SigmaGPT</strong>
                <p>
                  Artificial Intelligence is the ability
                  of machines to perform tasks that
                  normally require human intelligence.
                </p>
              </div>
            </div>

            <div className="previewInput">
              Ask anything...
              <span>➤</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="sectionHeading">
          <span>WHY SIGMAGPT?</span>
          <h2>Your ideas deserve intelligent answers.</h2>
        </div>

        <div className="featureGrid">
          <article className="featureCard">
            <span>✦</span>
            <h3>Smart AI Conversations</h3>
            <p>Ask questions and explore ideas with your AI assistant.</p>
          </article>

          <article className="featureCard">
            <span>◷</span>
            <h3>Chat History</h3>
            <p>Return to your previous conversations whenever you need.</p>
          </article>

          <article className="featureCard">
            <span>♙</span>
            <h3>Personal Accounts</h3>
            <p>Sign in to access your own conversations and chat space.</p>
          </article>
        </div>
      </section>

   <section className="about" id="about">
    <div className="aboutContent">
        <span className="aboutTag">ABOUT SIGMAGPT</span>

        <h2>
            More than just an AI chatbot.
            <br />
            <span>Your partner in thinking.</span>
        </h2>

        <p>
            SigmaGPT is designed to make artificial intelligence
            simple and accessible. Whether you're learning,
            exploring ideas, or solving problems, SigmaGPT
            helps you move forward.
        </p>

        <button onClick={onSignup}>
            Experience SigmaGPT →
        </button>
    </div>

    <div className="aboutDecoration">
        <div className="aboutIcon">✦</div>
        <h3>Curiosity meets intelligence.</h3>
        <p>Ask. Explore. Learn. Create.</p>
    </div>
</section>

      <footer className="landingFooter">
        <p>© 2026 SigmaGPT · Made with ♥ by Khushnuma</p>
      </footer>

    </main>
  );
}

export default Landing;
