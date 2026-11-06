# SigmaGPT

SigmaGPT is a full-stack conversational AI web application inspired by ChatGPT. It features user authentication, chat history persistence with MongoDB, responsive layout with dark/light themes, syntax-highlighted markdown rendering, and integration with OpenAI's API.

---

## Features

- **Authentication**: Email/password registration and login with bcrypt hashing and JWT session management.
- **Persistent Threads**: Automatically saves conversation history per user account using MongoDB.
- **Rich Message Rendering**: Formatted responses with `react-markdown` and code syntax highlighting via `highlight.js`.
- **Responsive UI**: Desktop and mobile-ready interface with collapsible sidebar, theme switching, and quick thread deletion.
- **Production-Ready Security**: Built-in rate limiting, security headers (`helmet`), strict input limits, and CSRF mitigation.

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Markdown & Rehype Highlight
- CSS Modules / Custom CSS

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- Security: `helmet`, `express-rate-limit`, `cookie-parser`, `cors`
- OpenAI API (`gpt-4o-mini`)

---

## Project Structure

```text
SigmaGPT/
├── Backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & session validation
│   ├── models/
│   │   ├── Thread.js             # Conversation and message schema
│   │   └── User.js               # User account schema
│   ├── routes/
│   │   ├── auth.js               # Signup, login, session check, logout
│   │   └── chat.js               # Thread management and chat completions
│   ├── utiles/
│   │   └── openai.js             # OpenAI API client integration
│   ├── package.json
│   └── server.js                 # Express server configuration
└── Frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── apiConfig.js          # Centralized API base URL & headers
    │   ├── App.jsx               # Root application component & session state
    │   ├── Auth.jsx              # Login and signup views
    │   ├── Chat.jsx              # Message list and markdown renderer
    │   ├── ChatWindow.jsx        # Active chat interface and prompt input
    │   ├── Landing.jsx           # Public landing page
    │   ├── Settings.jsx          # Theme and user settings modal
    │   └── Sidebar.jsx           # Chat thread history navigation
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- MongoDB instance (local or MongoDB Atlas connection URI)
- OpenAI API Key

---

### Backend Setup

1. Open a terminal and navigate to `Backend`:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:8080`.

---

### Frontend Setup

1. Open another terminal and navigate to `Frontend`:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in `Frontend` to point to a custom backend:
   ```env
   VITE_API_URL=http://localhost:8080
   ```
   *If left unset, it defaults to the deployed backend URL.*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Security & Reliability Updates

The codebase includes several security and stability safeguards:
- **Rate Limiting**: Protects `/api/auth/login` (10 requests/15m) to prevent credential stuffing, and `/api/chat` (20 requests/1m) to avoid runaway OpenAI token costs.
- **Security Headers**: Uses `helmet` to set protection headers (`X-Frame-Options`, `X-Content-Type-Options`, HSTS) and hides the `X-Powered-By` header.
- **Input Validation**: Limits prompt lengths to 2,000 characters and validates thread IDs to avoid database clutter.
- **CSRF Defense**: Enforces custom request headers (`X-Requested-With`) on state-changing API endpoints.
- **Centralized Error Handling**: Prevents database exceptions and internal stack traces from leaking to clients in production.

---

## Author & Acknowledgements

Created by [Khushnuma Khan](https://github.com/KhushnumaKhan30).

