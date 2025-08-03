# 📊 Stock Portfolio Tracker (MERN)

A simple stock portfolio tracker built with the **MERN stack (MongoDB, Express, React, Node.js)** that allows users to:

- Register/login using JWT authentication
- Add, view, and delete stocks
- View current stock prices (via Finnhub API)
- Visualize 30-day stock performance charts
- Calculate real-time gain/loss on each stock

---

<img width="493" height="590" alt="Screenshot 2025-08-03 at 5 18 49 PM" src="https://github.com/user-attachments/assets/e7a27a3c-b8c7-4c10-8688-061d9eeb033b" />

---

## 🚀 Features

- Secure user authentication (JWT + bcrypt)
- Add/remove stocks with number of shares and purchase price
- Fetch live stock prices via **Finnhub API**
- Display real-time gain/loss for each stock
- Plot stock price history (last 5 days) via chart using **Twelve Data API**
- Responsive UI styled with **Tailwind CSS**

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **APIs:** Finnhub (live price), Twelve Data (charts)

---

## 🔧 Setup Instructions

### 📁 Prerequisites

- Node.js and npm installed
- MongoDB running locally (e.g. `mongodb://localhost:27017/stocktracker`)
- Finnhub and Tweleve Data API Key (free tiers available for both)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/stock-portfolio-tracker.git
cd stock-portfolio-tracker
```

### 2️⃣ Setup Backend (Terminal 1)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory with the following content:

```env
MONGO_URI=mongodb://localhost:27017/stocktracker
JWT_SECRET=your_jwt_secret_here
TWELVE_DATA_API_KEY=your_twelve_data_key
FINNHUB_API_KEY=your_finnhub_api_key_here
```

Then start the backend server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend (Terminal 2)

```bash
cd client
npm install
npm start
```

The React app should now be running at:  
👉 **http://localhost:3000**

---

## ✨ Usage

- Open **http://localhost:3000** in your browser  
- Register and log in  
- Add stocks with symbol, shares, and purchase price  
- View **live prices**, **gain/loss**, and **price chart** for each stock  
- Delete stocks from your list anytime


