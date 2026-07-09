# AI-Powered Personal Finance Tracker

An industry-level MERN stack application that tracks daily personal transactions (income/expenses), maps custom monthly and category budgets with real-time progress indicators, and generates AI-powered recommendations using OpenAI's completions engine (with a robust deterministic rule-based fallback).

## Features

- **JWT Authentication & Security**: Complete secure authentication with bcrypt password hashing, HTTP headers security via Helmet, API request rate limiters, and CORS whitelisting.
- **Transaction CRUD**: Dynamic page supporting pagination, keyword search, payment method/category filtering, and sorting (latest, oldest, amount).
- **Budget Module**: Interactive monthly budget planner showing spent progress bars, category budget limits, and overspending indicators.
- **Dashboard Metrics**: Data-rich SaaS dashboard rendering charts (using Recharts) for monthly spending trends, category distributions, income vs. expense bars, and list of recent items.
- **AI Insights & Spending Predictions**: Incorporates OpenAI `gpt-4o-mini` API logic. If the API key is not configured, it gracefully falls back to a deterministic rule-based analytics service. Forecasts upcoming monthly spending with confidence levels.
- **PDF Report Exporter**: Generate high-fidelity monthly statement summaries and download them directly as server-generated PDF documents utilizing PDFKit.
- **Profile Management**: Profile page detailing statistics counter cards (total logs, savings, totals), profile detail forms, and password-updating mechanics.

---

## Folder Structure

```text
Finance-Tracker/
├── README.md
├── server/
│   ├── config/
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── dashboardController.js
│   │   ├── reportController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Budget.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── reportRoutes.js
│   │   └── transactionRoutes.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── financeAnalyzer.js
│   ├── app.js
│   ├── server.js
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   └── SummaryCard.jsx
    │   │   └── layout/
    │   │       ├── Layout.jsx
    │   │       ├── Navbar.jsx
    │   │       └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Budget.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Insights.jsx
    │   │   ├── Login.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Reports.jsx
    │   │   ├── Signup.jsx
    │   │   └── Transactions.jsx
    │   ├── redux/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── budgetSlice.js
    │   │   │   ├── insightSlice.js
    │   │   │   └── transactionSlice.js
    │   │   └── store.js
    │   ├── services/
    │   │   ├── aiService.js
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── budgetService.js
    │   │   ├── dashboardService.js
    │   │   ├── reportService.js
    │   │   └── transactionService.js
    │   ├── utils/
    │   │   └── format.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or later)
- **MongoDB** (Atlas cloud account or local database instance running on `mongodb://localhost:27017`)

### Step 1: Clone the Repository & Install Dependencies
```bash
# Install backend server dependencies
cd server
npm install

# Install frontend client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the `server/` directory and configure the variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-finance-tracker
JWT_SECRET=your_long_random_jwt_secret_string
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Optional: Add OpenAI API key to unlock LLM-based insights
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

---

## API Documentation

All routes (except Auth Signup/Login and Health check) require a `Bearer <token>` in the `Authorization` header.

### Authentication
- `POST /api/auth/signup` - Register a new user account.
- `POST /api/auth/login` - Authenticate a user and return a JWT.
- `GET /api/auth/me` - Fetch authenticated user details.
- `PUT /api/auth/profile` - Update name and email.
- `PUT /api/auth/password` - Change account password.
- `GET /api/auth/stats` - Fetch overall transaction totals and saving stats.

### Transactions
- `POST /api/transactions` - Add a new transaction.
- `GET /api/transactions?page=1&limit=10&search=rent&type=expense` - List transactions with filters, search, and page counts.
- `PUT /api/transactions/:id` - Update a transaction.
- `DELETE /api/transactions/:id` - Delete a transaction.

### Budgets
- `GET /api/budget` - Fetch monthly/category budgets configuration.
- `POST /api/budget` - Create or update the budget.
- `PUT /api/budget` - Update the budget.

### AI & Predictions
- `POST /api/ai/insights` - Get AI insights (runs heuristics on key-missing).
- `POST /api/ai/predict` - Forecast upcoming month spending.

### Dashboard & Reports
- `GET /api/dashboard/summary` - Load landing statistics and recent listings.
- `GET /api/reports/monthly?year=2026&month=7` - Load monthly analytical report.
- `GET /api/reports/monthly?year=2026&month=7&format=pdf` - Stream and download PDF report.

---

## Running the Application

### Start the Server (Backend)
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`.

### Start the Client (Frontend Dev Server)
```bash
cd client
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## Deployment

1. **Database**: Use MongoDB Atlas free tier for cloud databases. Update the backend production `MONGODB_URI` environment variable.
2. **Backend**: Host the Express app on platform services like Render, Heroku, or AWS Elastic Beanstalk. Ensure `NODE_ENV=production`.
3. **Frontend**: Compile static assets with `npm run build` inside the `client` folder and host them on Netlify, Vercel, or AWS S3.
