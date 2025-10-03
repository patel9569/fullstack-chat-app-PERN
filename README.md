# Fullstack Chat App (PERN Stack)

🚀 **Live Demo:** [Fullstack Chat App](https://fullstack-chat-app-pern.onrender.com/login)

A real-time chat application built using the **PERN stack** with **Socket.IO** for instant messaging.  
It supports secure authentication (including Google OAuth), image uploads, emojis, message edits, read receipts, and stores chat history in PostgreSQL.

---

## 🛠 Tech Stack

- **PostgreSQL** → Database for users & messages  
- **Express.js** → Backend API layer  
- **React.js** → Frontend UI  
- **Node.js** → Server runtime  
- **Socket.IO** → Real-time communication  

---

## ✨ Features

- 🔐 User registration & login (Email + Password)  
- 🔑 Google OAuth integration  
- 💬 Real-time 1-to-1 messaging  
- 📷 Image uploads with **Cloudinary**  
- 😀 Emoji support  
- ✏️ Editable messages with read receipts  
- 📜 Persistent chat history  
- 🌍 Timezone handling (Asia/Kolkata)  

---

## 📸 Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/a0847027-566c-4ab6-be6a-bd5d891a4657)  
![Screenshot 2](https://github.com/user-attachments/assets/e6cc20ea-fe4f-413c-ba6d-4b1cc5f4f6d0)  
![Screenshot 3](https://github.com/user-attachments/assets/e64bd1f3-cf36-4564-ac40-d38160edc7ed)  
![Screenshot 4](https://github.com/user-attachments/assets/da7139a9-ebf9-4190-b043-83fdac6ee906)  
![Screenshot 5](https://github.com/user-attachments/assets/8a9c1450-8792-4d8e-8592-b737b23d499e)  

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/patel9569/fullstack-chat-app-PERN.git
cd fullstack-chat-app-PERN
```

### 2. Create `.env` file
Place it in the backend root (or project root if unified):

```env
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
```

---

### 3. Setup PostgreSQL Database
You can use [Neon](https://neon.com/) (free Postgres hosting). Run:

```sql
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
```

---

### 4. Setup Google OAuth
1. Go to **Google Cloud Console**  
2. Create an **OAuth 2.0 Client ID**  
3. Copy **Client ID** & **Client Secret** into `.env`  
4. Add **Authorized redirect URIs**  

---

### 5. Install Dependencies & Build
```bash
npm install
npm run build
```

### 6. Run the App
```bash
npm start
```

---

## 🚀 Deployment

- **Frontend + Backend**: [Render](https://render.com/)  
- **Database**: [Neon PostgreSQL](https://neon.com/)  
- **Images**: [Cloudinary](https://cloudinary.com/)  

---

## 📌 Future Improvements

- Group chat functionality  
- Message search  
- Push notifications  

---

## 👨‍💻 Author

Developed by **[Patel9569](https://github.com/patel9569)**  
🔗 [Live Demo](https://fullstack-chat-app-pern.onrender.com/login)

---

## 🙏 Acknowledgements

- This project was inspired by [Burak Orkmez's Fullstack Chat App](https://github.com/burakorkmez/fullstack-chat-app) and his YouTube tutorial.
- Thank you for the guidance which helped in building and customizing this app.
