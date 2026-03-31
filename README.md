<div align="center">

<img src="https://trackbook-official.vercel.app/assets/logo.png" alt="TrackBook Logo" width="50" />

# TrackBook Server - Library Management API

A secure RESTful API powering the TrackBook library management platform, handling book catalogs, borrowing workflows, JWT authentication, and user-scoped records through Express.js and MongoDB.

[![Live API](https://img.shields.io/badge/▶_Live_API-trackbook--official.vercel.app-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://trackbook-official.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zahid-official/milestone-11-server)
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />

</div>

<br/>

## 🔍 Overview

**TrackBook Server** is the backend engine behind the [TrackBook](https://trackbook-official.vercel.app/) library management platform. It exposes a RESTful API built with Express.js and MongoDB, enabling the client application to browse book catalogs by category, borrow and return books with quantity tracking, manage user-specific borrowed records, and authenticate users with secure JWT tokens stored in HTTP-only cookies — all deployed seamlessly on Vercel as a serverless function.

> _Where every read begins with a reliable server._

<br/>

## ✨ Key Features

### 📡 API & Data Management

<table align="center">
<thead>
<tr><th align="left">Feature</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><b>Full CRUD Operations</b></td><td>Create, read, update, and delete books through dedicated RESTful endpoints</td></tr>
<tr><td><b>Category Browsing</b></td><td>Fetch books filtered by category for organized catalog navigation</td></tr>
<tr><td><b>Borrow & Return Workflow</b></td><td>Complete book borrowing lifecycle with automatic quantity tracking and duplicate prevention</td></tr>
<tr><td><b>User-Scoped Records</b></td><td>Retrieve borrowed books filtered by user email for personalized dashboards</td></tr>
<tr><td><b>Availability Filtering</b></td><td>Filter books by stock availability (quantity > 0) for accurate catalog display</td></tr>
</tbody>
</table>

### 🔐 Authentication & Security

<table align="center">
<thead>
<tr><th align="left">Feature</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><b>JWT Authentication</b></td><td>Secure token-based authentication with 1-hour expiration for session management</td></tr>
<tr><td><b>HTTP-Only Cookies</b></td><td>Tokens stored in HTTP-only cookies to prevent XSS attacks and client-side tampering</td></tr>
<tr><td><b>Token Verification Middleware</b></td><td>Custom middleware validates JWT tokens and enforces email-based access control</td></tr>
<tr><td><b>Environment Variables</b></td><td>Sensitive credentials stored securely via <code>dotenv</code>, never exposed in source</td></tr>
<tr><td><b>Production-Ready CORS</b></td><td>Cross-origin resource sharing with credentials support, configured for both development and production</td></tr>
</tbody>
</table>

### 🔧 Infrastructure & Deployment

<table align="center">
<thead>
<tr><th align="left">Feature</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><b>MongoDB Atlas</b></td><td>Cloud-hosted database with Stable API versioning for production reliability</td></tr>
<tr><td><b>Serverless Deployment</b></td><td>Vercel-powered serverless functions with automatic scaling and zero cold starts</td></tr>
<tr><td><b>Secure Cookie Policies</b></td><td>Dynamic <code>secure</code> and <code>sameSite</code> cookie settings based on environment (development vs production)</td></tr>
</tbody>
</table>

<br/>

## 🛠️ Tech Stack

<table align="center">
<thead>
<tr><th align="left">Technology</th><th align="center">Version</th><th align="left">Purpose</th></tr>
</thead>
<tbody>
<tr><td><b>Node.js</b></td><td align="center"><code>18+</code></td><td>Server-side JavaScript runtime</td></tr>
<tr><td><b>Express</b></td><td align="center"><code>^4.21.2</code></td><td>Minimal and flexible web application framework</td></tr>
<tr><td><b>MongoDB Driver</b></td><td align="center"><code>^6.11.0</code></td><td>Official MongoDB driver for data persistence</td></tr>
<tr><td><b>jsonwebtoken</b></td><td align="center"><code>^9.0.2</code></td><td>JWT token generation and verification</td></tr>
<tr><td><b>cookie-parser</b></td><td align="center"><code>^1.4.7</code></td><td>Parse and manage HTTP cookies in requests</td></tr>
<tr><td><b>dotenv</b></td><td align="center"><code>^16.4.7</code></td><td>Environment variable management from <code>.env</code> files</td></tr>
<tr><td><b>CORS</b></td><td align="center"><code>^2.8.5</code></td><td>Cross-origin request handling middleware</td></tr>
</tbody>
</table>

<br/>

## 🏗️ Architecture

<div align="center">
<pre>
┌─────────────────────────────────────────────────────────────┐
│                     Client (React App)                      │
│          https://trackbook-official.vercel.app               │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTP Requests (REST)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Middleware  │  │   Routes     │  │   Business Logic    │ │
│  │            │  │              │  │                     │ │
│  │ • CORS     │  │ POST /jwt    │  │ • JWT Generation    │ │
│  │ • JSON     │  │ POST /logout │  │ • Token Verify      │ │
│  │   Parser   │  │ GET  /allBks │  │ • Borrow Validation │ │
│  │ • Cookie   │  │ POST /borrow │  │ • Quantity Tracking │ │
│  │   Parser   │  │ PUT  /update │  │ • Email Scoping     │ │
│  │ • Verify   │  │ DEL  /return │  │                     │ │
│  │   Token    │  │ GET  /filter │  │                     │ │
│  └────────────┘  └──────┬───────┘  └─────────────────────┘ │
│                         │                                   │
├─────────────────────────┼───────────────────────────────────┤
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Atlas (Cluster1)                 │   │
│  │   ┌───────────────────┐  ┌────────────────────────┐  │   │
│  │   │ books Collection  │  │ borrowed Collection    │  │   │
│  │   └───────────────────┘  └────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
</pre>
</div>

<br/>

## 📡 API Endpoints

### 🔑 Authentication

<table align="center">
<thead>
<tr><th align="left">Method</th><th align="left">Endpoint</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>POST</code></td><td><code>/jwt</code></td><td>Generate a JWT token and set it as an HTTP-only cookie</td></tr>
<tr><td><code>POST</code></td><td><code>/logout</code></td><td>Clear the JWT cookie to log the user out</td></tr>
</tbody>
</table>

### 📚 Books

<table align="center">
<thead>
<tr><th align="left">Method</th><th align="left">Endpoint</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>GET</code></td><td><code>/</code></td><td>Health check — returns server connection status</td></tr>
<tr><td><code>GET</code></td><td><code>/allBooks</code></td><td>Fetch all books in the catalog</td></tr>
<tr><td><code>GET</code></td><td><code>/category/:category</code></td><td>Fetch books filtered by category name</td></tr>
<tr><td><code>GET</code></td><td><code>/bookDetails/:id</code></td><td>Fetch a single book by its ObjectId</td></tr>
<tr><td><code>GET</code></td><td><code>/updateBook/:id</code></td><td>Fetch a single book for the update form</td></tr>
<tr><td><code>GET</code></td><td><code>/filter</code></td><td>Fetch books with available stock (quantity > 0)</td></tr>
<tr><td><code>POST</code></td><td><code>/addBook</code></td><td>Add a new book to the catalog</td></tr>
<tr><td><code>PUT</code></td><td><code>/updateBook/:id</code></td><td>Update an existing book (name, image, category, author, rating)</td></tr>
</tbody>
</table>

### 📖 Borrowing

<table align="center">
<thead>
<tr><th align="left">Method</th><th align="left">Endpoint</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>GET</code></td><td><code>/borrowedBooks/:email</code></td><td>Fetch borrowed books for a specific user (🔒 JWT protected)</td></tr>
<tr><td><code>POST</code></td><td><code>/borrow</code></td><td>Borrow a book — validates duplicates and decreases quantity</td></tr>
<tr><td><code>DELETE</code></td><td><code>/returnBook?isbn=...&borrowerEmail=...</code></td><td>Return a book — removes record and increases quantity</td></tr>
</tbody>
</table>

<br/>

## 🗃️ Database Collections

### 📋 books Collection

<table align="center">
<thead>
<tr><th align="left">Field</th><th align="left">Type</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>_id</code></td><td>ObjectId</td><td>Auto-generated unique identifier</td></tr>
<tr><td><code>bookName</code></td><td>String</td><td>Title of the book</td></tr>
<tr><td><code>bookImage</code></td><td>String</td><td>Cover image URL</td></tr>
<tr><td><code>category</code></td><td>String</td><td>Book category (e.g., Novel, Thriller, Sci-Fi)</td></tr>
<tr><td><code>author</code></td><td>String</td><td>Author name</td></tr>
<tr><td><code>rating</code></td><td>Number</td><td>Book rating score</td></tr>
<tr><td><code>quantity</code></td><td>Number</td><td>Available copies for borrowing</td></tr>
<tr><td><code>updaterEmail</code></td><td>String</td><td>Email of the last user who updated the book</td></tr>
</tbody>
</table>

### 📋 borrowed Collection

<table align="center">
<thead>
<tr><th align="left">Field</th><th align="left">Type</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>_id</code></td><td>ObjectId</td><td>Auto-generated unique identifier</td></tr>
<tr><td><code>isbn</code></td><td>String</td><td>Reference to the original book's ObjectId</td></tr>
<tr><td><code>borrowerEmail</code></td><td>String</td><td>Email of the user who borrowed the book</td></tr>
</tbody>
</table>

<br/>

## 📂 Project Structure

```
milestone-11-server/
├── index.js                       # Express server entry point with all routes & middleware
├── package.json                   # Dependencies and npm scripts
├── vercel.json                    # Vercel serverless deployment configuration
├── .gitignore                     # Ignored files (node_modules, .env, .vercel)
└── .env                           # Environment variables (not committed)
```

<br/>

## 🚀 Getting Started

### Prerequisites

<table align="center">
<thead>
<tr><th align="left">Requirement</th><th align="left">Details</th></tr>
</thead>
<tbody>
<tr><td><b>Node.js</b></td><td>v18 or higher recommended</td></tr>
<tr><td><b>npm</b></td><td>Comes bundled with Node.js</td></tr>
<tr><td><b>MongoDB Atlas</b></td><td>A cloud MongoDB cluster with connection credentials</td></tr>
<tr><td><b>Vercel CLI</b></td><td>Optional for deployment to Vercel</td></tr>
</tbody>
</table>

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zahid-official/milestone-11-server.git

# 2. Navigate to the project directory
cd milestone-11-server

# 3. Install dependencies
npm install

# 4. Set up environment variables (see section below)

# 5. Start the server
npm start
```

The server will be available at `http://localhost:3000` by default.

<br/>

## 🔑 Environment Variables

Create a `.env` file in the project root with the following credentials:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN=your_jwt_secret_key
```

> **Note:** The `.env` file is included in `.gitignore` and will never be committed to version control. `DB_USER` and `DB_PASS` construct the MongoDB Atlas connection string, while `ACCESS_TOKEN` is used as the secret key for signing and verifying JWT tokens.

<br/>

## 📜 Available Scripts

<table align="center">
<thead>
<tr><th align="left">Command</th><th align="left">Description</th></tr>
</thead>
<tbody>
<tr><td><code>npm start</code></td><td>Start the Express server with <code>node index.js</code></td></tr>
<tr><td><code>npm test</code></td><td>Run the test suite (placeholder)</td></tr>
</tbody>
</table>

<br/>

## ⚙️ How It Works

<div align="center">
<pre>
                    ┌──────────┐       ┌───────────────┐       ┌──────────────────┐
                    │  Client  │──────►│ Express.js    │──────►│   MongoDB Atlas  │
                    │  (React) │  HTTP │ Server        │ Query │   (booksDB)      │
                    └──────────┘       └────────┬──────┘       └────────┬─────────┘
                                                │                       │
                                        ┌───────▼──────┐         ┌─────▼───────┐
                                        │   Router     │         │ Collections │
                                        │              │         │             │
                                        │ /jwt         │         │ books       │
                                        │ /allBooks    │         │ borrowed    │
                                        │ /category    │         │             │
                                        │ /borrow      │         │             │
                                        │ /returnBook  │         │             │
                                        │ /updateBook  │         │             │
                                        └───────┬──────┘         └─────┬───────┘
                                                │                      │
                                        ┌───────▼──────┐         ┌────▼────────┐
                                        │ Middleware   │         │   Result    │
                                        │              │         │             │
                                        │ • CORS       │         │ • Find      │
                                        │ • JSON Body  │         │ • Insert    │
                                        │   Parser     │         │ • Update    │
                                        │ • Cookie     │         │ • Delete    │
                                        │   Parser     │         │ • Inc/Dec   │
                                        │ • JWT Verify │         │             │
                                        └──────────────┘         └─────┬───────┘
                                                                       │
                                        ┌──────────────────────────────┘
                                        ▼
                                 JSON Response ──► Client Renders Data
</pre>
</div>

1. **Request Arrival** : The client sends HTTP requests to the Express server hosted on Vercel.
2. **Middleware Processing** : CORS headers are applied, JSON body is parsed, and cookies are read.
3. **Authentication Check** : Protected routes verify JWT tokens from HTTP-only cookies and validate user email ownership.
4. **Route Matching** : Express matches the request method and URL pattern to the appropriate handler.
5. **Database Query** : The handler constructs a MongoDB query (with optional category filters, availability checks, or duplicate validation).
6. **Data Processing** : MongoDB Atlas processes the query against the `books` or `borrowed` collection, including quantity increment/decrement operations.
7. **JSON Response** : The server returns structured JSON data to the client for rendering.

<br/>

## 🚢 Deployment

This server is deployed on **Vercel** as a serverless function. The `vercel.json` configuration routes all incoming requests to `index.js`:

```json
{
  "version": 2,
  "builds": [{ "src": "/index.js", "use": "@vercel/node" }],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

> **Tip:** Set your `DB_USER`, `DB_PASS`, and `ACCESS_TOKEN` environment variables in the Vercel dashboard under **Settings → Environment Variables** before deploying.

<br/>

## 🔗 Related Repository

<table align="center">
<thead>
<tr><th align="left">Repository</th><th align="left">Description</th><th align="left">Link</th></tr>
</thead>
<tbody>
<tr><td><b>TrackBook Client</b></td><td>React frontend — browse books, borrow & return, manage records</td><td><a href="https://github.com/zahid-official/milestone-11">GitHub</a></td></tr>
<tr><td><b>Live App</b></td><td>Deployed full-stack application on Vercel</td><td><a href="https://trackbook-official.vercel.app/">trackbook-official.vercel.app</a></td></tr>
</tbody>
</table>

<br/>

## 🌟 Author

<div align="center">
  <a href="https://github.com/zahid-official">
    <img src="https://github.com/zahid-official.png" width="100" height="100" style="border-radius: 50%;" alt="Zahid Official" />
  </a>

  <h3>Zahid Official</h3>
  <p><b>Web Developer | Tech Enthusiast</b></p>

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zahid-official)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/zahid-web)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:zahid.official8@gmail.com)

  <p>Creating impactful digital experiences with passion and purposeful design</p>
</div>

<br/>

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help improve **TrackBook Server**:

```bash
# 1. Fork the repository

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request against the main branch
```

<p align="center"><b>TrackBook Server</b> — <i>Powering every read with reliable, scalable API infrastructure.</i></p>
