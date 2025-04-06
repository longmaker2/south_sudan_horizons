# South Sudan Horizons

**South Sudan Horizons** is a modern digital tourism platform designed to connect travelers with immersive, authentic experiences in South Sudan. From cultural insights to seamless tour bookings, real-time chat, and user-driven reviews, this platform showcases the beauty and diversity of South Sudan’s landscapes and heritage. With a focus on user experience and community engagement, South Sudan Horizons empowers travelers to explore the country's rich cultural heritage and natural wonders.

[![Frontend Deploy](https://img.shields.io/badge/Vercel-Deployed-brightgreen)](https://south-sudan-horizons.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-v22.13.1-blue)](https://nodejs.org/)

## 🎥 Video Demo

Explore a quick overview of South Sudan Horizons in action:

[![Watch the Video](./backend/tour_pics/Horizons%20Screenshot.png)](https://drive.google.com/file/d/1FLqeuY16mD0g7nLZjQULC0XZv6Nn4dZ5/view?usp=sharing)

**[Watch on Google Drive](https://drive.google.com/file/d/1FLqeuY16mD0g7nLZjQULC0XZv6Nn4dZ5/view?usp=sharing)**

## 📝 Description

South Sudan Horizons bridges the gap between travelers and South Sudan’s rich cultural and natural offerings. Whether you're seeking wildlife adventures, cultural immersions, or scenic expeditions, our platform provides an intuitive interface to discover, book, and share experiences—all while fostering a community through real-time interaction and reviews.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration.
- **Profile Management**: Customize and update user profiles with ease.
- **Tour Search & Discovery**: Find tours with powerful search and filtering tools.
- **Booking System**: Effortlessly book tours in a few clicks.
- **Ratings & Reviews**: Share and read feedback on tours.
- **Cultural, Adventure, Wildlife & Natural Insights**: Learn about South Sudan’s heritage and landscapes.
- **Multi-Language Support**: Available in English, Arabic and French (more languages planned).

## 🛠️ Tech Stack

### Frontend

- **[React 19](https://react.dev/)** with **[TypeScript](https://www.typescriptlang.org/)**: Modern, type-safe UI development.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed language that enhances JavaScript, improves code quality, and reduces bugs.
- **[Vite](https://vitejs.dev/)**: Lightning-fast build tool for development and production.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first styling for rapid, responsive design.

### Backend

- **[Node.js v22.13.1](https://nodejs.org/)** & **[Express.js](https://expressjs.com/)**: Robust server-side framework.
- **[MongoDB](https://www.mongodb.com/)** with **[Mongoose ORM](https://mongoosejs.com/)**: Flexible NoSQL database with schema validation.
- **[JWT Authentication](https://jwt.io/)**: Secure user authentication and session management.

### Deployment & Hosting

- **Frontend**: Hosted on **[Vercel](https://south-sudan-horizons.vercel.app/)** – [Live Demo](https://south-sudan-horizons.vercel.app/)
- **Backend**: Deployed on **[Render](https://south-sudan-horizons.onrender.com)**

## 📂 Project Structure

```plaintext
South-Sudan-Horizons/
├── backend/           # Express.js API (server-side logic)
│   ├── tour_pics/     # Static assets (e.g., images)
│   └── ...
├── frontend/          # React application (client-side)
│   ├── src/           # Source files (components, pages, etc.)
│   └── ...
├── .gitignore         # Ignored files (e.g., node_modules)
└── README.md          # Project documentation
```

## 🔧 Installation & Setup

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/longmaker2/south-sudan-horizons.git
cd south-sudan-horizons
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the `backend/` directory with the following:

#### Backend (e.g., `backend/.env`)

```plaintext
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_secret_key
PORT=5000
GUIDES_KEY=guide_key
ADMIN_KEY=admin_key
STRIPE_SECRET_KEY=stripe_secret_key_here
EMAIL_USER=email_address
EMAIL_PASS=email_password_or_app_pass_here
```

### 3️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 4️⃣ Run the Project

#### Run Concurrently (Recommended)

From the root directory, if you have `concurrently` installed globally:

```bash
npm install -g concurrently
cd backend && npm install && cd ../frontend && npm install && cd ..
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

#### OR Start Separately

##### Backend

```bash
cd backend
npm run dev
```

##### Frontend

```bash
cd frontend
npm run dev
```

- Backend runs on `http://localhost:5000`.
- Frontend runs on `http://localhost:5173` (default Vite port).

## 📌 API Endpoints

### Authentication

- **`POST /api/auth/register`** - Register a new user
  - Body: `{ "fullName": string, "email": string, "password": string, "role": string, "key": string }`
- **`POST /api/auth/login`** - Log in an existing user
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "token": string, "user": object }`

### Tours

- **`GET /api/tours`** - Retrieve all tours
- **`GET /api/tours/:id`** - Retrieve a tour by ID
- **`POST /api/tours`** - Create a new tour (admin only)
  - Body: `{ "title": string, "description": string, "price": number, ... }`
- **`PUT /api/tours/:id`** - Update a tour (admin only)
- **`DELETE /api/tours/:id`** - Delete a tour (admin only)

### Reviews

- **`GET /api/reviews`** - Retrieve all reviews
- **`GET /api/reviews/:id`** - Retrieve a review by ID
- **`POST /api/reviews`** - Submit a new review
  - Body: `{ "tourId": string, "author": string, "comment": string, "rating": number }`
- **`PUT /api/reviews/:id`** - Update a review
- **`DELETE /api/reviews/:id`** - Delete a review

## 📩 Contact

For inquiries, feedback, or collaboration:

- **Email**: [l.deng@alustudent.com](mailto:l.deng@alustudent.com)
- **GitHub Issues**: [Report a bug or suggest a feature](https://github.com/longmaker2/south-sudan-horizons/issues)

## 👤 Authors

- **[Long Deng](https://github.com/longmaker2)**
