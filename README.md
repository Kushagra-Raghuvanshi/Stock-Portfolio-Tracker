# 📊 Stock Portfolio Tracker (MERN)

A simple stock portfolio tracker built with the **MERN stack (MongoDB, Express, React, Node.js)** that allows users to:

- Register/login using JWT authentication
- Add, view, and delete stocks
- View current stock prices (via Finnhub API)
- Visualize 30-day stock performance charts
- Calculate real-time gain/loss on each stock

---

## 🚀 Features

- Secure user authentication (JWT + bcrypt)
- Add/remove stocks with number of shares and purchase price
- Fetch live stock prices via **Finnhub API**
- Display real-time gain/loss for each stock
- Plot stock price history (last 30 days) via chart
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
