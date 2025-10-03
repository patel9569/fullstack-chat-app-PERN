Fullstack Chat App (PERN Stack)

🚀 Live Demo: Fullstack Chat App

This is a real-time chat application built using the PERN stack with Socket.IO for instant messaging. It provides secure authentication, Google login integration, and message history persistence with PostgreSQL.

🛠️ Tech Stack

PostgreSQL → Database for storing users & messages

Express.js → Backend framework for APIs

React.js → Frontend for the user interface

Node.js → Server runtime environment

Socket.IO → Real-time bidirectional communication

✨ Features

🔐 User authentication (Register/Login with email & password)

🔑 Google OAuth integration

💬 Real-time one-to-one chat using Socket.IO

📷 Image upload support with Cloudinary

😀 Emoji support

📜 Chat history stored in PostgreSQL

✏️ Edit messages & track read receipts

🌍 Timezone handling (Asia/Kolkata)

📸 Screenshots
<img width="1920" height="907" alt="image" src="https://github.com/user-attachments/assets/a0847027-566c-4ab6-be6a-bd5d891a4657" /> <img width="1920" height="903" alt="image" src="https://github.com/user-attachments/assets/e6cc20ea-fe4f-413c-ba6d-4b1cc5f4f6d0" /> <img width="1920" height="902" alt="image" src="https://github.com/user-attachments/assets/e64bd1f3-cf36-4564-ac40-d38160edc7ed" /> <img width="1920" height="902" alt="image" src="https://github.com/user-attachments/assets/da7139a9-ebf9-4190-b043-83fdac6ee906" /> <img width="1920" height="902" alt="image" src="https://github.com/user-attachments/assets/8a9c1450-8792-4d8e-8592-b737b23d499e" />
⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/fullstack-chat-app-PERN.git
cd fullstack-chat-app-PERN

2. Configure environment variables

Create a .env file in the backend root:

PORT=5001
SUPER_SECRET=chatapp@2003
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

PGUSER=...
PGDATABASE=...
PGHOST=...
PGPASSWORD=...
PGPORT=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

3. Setup PostgreSQL Database

Create a free account at Neon

Choose Postgres Database

Run the following queries:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profile_pic TEXT,
  created_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'),
  updated_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')
);

CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reciver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  texts TEXT,
  image TEXT,
  emoji TEXT NULL,
  edited_text BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'),
  updated_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')
);

4. Setup Google Authentication

Go to Google Cloud Console

Create an OAuth 2.0 Client ID

Add the credentials to your .env file

Screenshots of setup:
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/b343c369-f857-434e-8ed9-3121df5d8911" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/b1920fdb-b6c4-480b-be6c-99c4b89c5b59" />

5. Install dependencies & build the project
npm install
npm run build

6. Start the application
npm start

🚀 Deployment

Frontend & Backend: Can be deployed on Render

Database: Neon PostgreSQL

Image Storage: Cloudinary

📌 Future Improvements

Group chat support

Message search functionality

Push notifications

👨‍💻 Author

Developed by [Your Name]
🔗 Project Demo
