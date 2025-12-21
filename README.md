📖 Story Media App (Booki)

A modern story reading & writing platform where users can create short stories, read interactive content, answer questions, and earn XP through engagement.

Built with a clean full-stack architecture, focusing on learning, storytelling, and gamification.

🚀 Features
👤 Authentication

User Signup & Login

JWT-based authentication

Persistent login using /me API

Profile picture via image URL

✍️ Story Creation (Creators)

Create short stories

Draft & publish support

Add final question & answer

Update and delete own stories

Creator stats tracking

📚 Story Reading (Users)

Browse published stories

Read full stories in-app

Answer story-based questions

Earn XP for correct answers

🎮 Gamification

XP system

Level tracking

XP-to-next-level logic

Story read & created counters

User stats synced automatically

🧩 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Context API (Auth State)

Responsive UI (Desktop & Mobile)

Professional UI inspired by Medium, Notion & Wattpad

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

REST APIs

Clean controller-based structure

📂 Project Structure
├── frontend
│   ├── components
│   ├── pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── StoryPages
│   ├── context
│   │   ├── AuthContext.js
│   │   └── AuthProvider.jsx
│   └── api
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middlewares
│   └── config
│
└── README.md

🔐 Environment Variables
Frontend (.env)
VITE_BACKEND_URL=http://localhost:7000

Backend (.env)
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🧠 Core Design Decisions

User & UserStats separated
Keeps auth clean and stats scalable.

Draft vs Published stories
Encourages creators to refine content before sharing.

Answer-based XP rewards
Prevents mindless scrolling and encourages engagement.

Context-based Auth handling
Clean /me bootstrap without prop drilling.

✅ API Highlights

POST /auth/register

POST /auth/login

GET /auth/me

POST /stories/create

GET /stories/list

POST /stories/:id/answer

DELETE /stories/:id

🎯 Future Plans

Level-based rewards

Analytics for wrong answers

Comment & like system

Avatar upload (instead of URL)

OAuth (Google/GitHub)

Admin moderation panel

🛠️ How to Run Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

👨‍💻 Author

Abhinav Pandey

Built as a serious full-stack project focused on:

learning systems

clean architecture

and meaningful user engagement

⭐ Why this project matters

This is not just a CRUD app.
It combines content + learning + gamification, making it a strong portfolio-level project.
