# 💰 Finance Dashboard – Frontend Developer Intern Assignment

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-fast-purple)
![Zustand](https://img.shields.io/badge/State-Zustand-black)
![Recharts](https://img.shields.io/badge/Charts-Recharts-green)

---
## 🌐 Live Demo

[🔗 View Live Project](https://finance-dashboard-iota-kohl.vercel.app/)
## 📌 Overview

This project is a **Finance Dashboard UI** built for the **Zorvyn FinTech Frontend Intern Assignment**.

It allows users to:

* Track financial activity
* Analyze spending patterns
* Manage transactions
* View insights and reports

🎯 Focus: Clean UI, scalable structure, and real-world frontend practices.

---

## 🚀 Features

### 📊 Dashboard

* Total Balance, Income, Expenses cards
* Balance trend chart (time-based visualization)
* Spending breakdown (category visualization)
* Recent transactions

---

### 📋 Transactions

* View all transactions
* Search, filter, and sort
* CSV export
* Admin: Add / Edit / Delete

---

### 🔐 Role-Based UI

* **Viewer → Read-only**
* **Admin → Full control**
* Role toggle from header

---

### 📈 Insights

* Highest spending category
* Monthly comparison
* Savings rate
* Smart financial insights

---

### 📦 Additional Features

* 🌙 Dark Mode
* 💾 Local Storage Persistence
* 📱 Responsive Design
* ✨ Smooth Animations
* 📤 Export (CSV/JSON)

---

## 🛠️ Tech Stack

| Category   | Technology                |
| ---------- | ------------------------- |
| Frontend   | React + TypeScript        |
| Styling    | Tailwind CSS + Custom CSS |
| State      | Zustand                   |
| Charts     | Recharts                  |
| Routing    | React Router              |
| Build Tool | Vite                      |

---

## 📁 Project Structure

```
finance-dashboard/
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   │   ├── QuickActions.tsx
│   │   │   └── SummaryCard.tsx
│   │   │
│   │   ├── insights/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Sidebar.css
│   │   │   ├── Layout.tsx
│   │   │   └── Layout.css
│   │   │
│   │   └── transactions/
│   │
│   ├── data/
│   │   └── transactions.ts
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Insights.tsx
│   │   ├── Budgets.tsx
│   │   ├── Analytics.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   │
│   ├── store/
│   │   └── useStore.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   └── helpers.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

```bash
# Clone repo
git clone https://github.com/satyaavanish/Finance-dashboard.git

# Install dependencies
npm install

# Run project
npm run dev
```

👉 Open: http://localhost:5173

---

## 🧠 Approach

* Built reusable components
* Used Zustand for state management
* Separated logic (utils) from UI
* Focused on clean architecture
* Designed intuitive UX

---

## 📱 Responsiveness

* Works on mobile, tablet, desktop
* Sidebar adapts to screen size
* Flexible layouts using CSS

---

## 🧪 Edge Cases Handled

* Empty transactions → UI fallback
* Invalid filters → safe handling
* Role restrictions enforced
* Persistent data after reload

---


---

## 👨‍💻 Author

**Valli shanmukha sai**
📧 [vallishanmukh10@gmail.com](mailto:vallishanmukh10@gmail.com)
🔗 https://github.com/shanmukh1122

---



## ⭐ Final Note

This project demonstrates:

* Strong frontend skills
* Clean UI/UX thinking
* Real-world dashboard implementation

✨ Built with dedication for internship evaluation
