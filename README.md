# South Sudan Horizons

South Sudan Horizons is a digital tourism platform that connects travelers with immersive experiences in South Sudan. The platform provides cultural insights, easy booking, real-time chat, user reviews, and more.

## 🚀 Features

- User authentication (JWT-based login & registration)
- Profile management
- Search and discovery of tours
- Easy booking system
- Real-time chat functionality
- Ratings and reviews
- Cultural and natural insights
- Multi-language support (English & French)

## 🛠️ Tech Stack

### **Frontend**

- **React 19** with **TypeScript**
- **Vite** for fast builds
- **Redux** for state management
- **Tailwind CSS 4** for styling

### **Backend**

- **Node.js (v22.13.1)** & **Express.js**
- **MongoDB** with **Mongoose ORM**
- **JWT Authentication**

### **Deployment & Hosting**

- Vercel is used for frontend deployment - **[Link to the deployed frontend](https://south-sudan-horizons.vercel.app/)**
- Render for backend deployment

## 📂 Project Structure

```plaintext
South-Sudan-Horizons/
│── backend/          # Express.js API
│── frontend/         # React application
│── .gitignore        # Ignored files
│── README.md
```

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
 git clone https://github.com/your-username/south-sudan-horizons.git
 cd south-sudan-horizons
```

### **2️⃣ Setup Environment Variables**

Create a `.env` and configure your database & API keys.

### **3️⃣ Install Dependencies**

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### **4️⃣ Run the Project**

#### run npm start concurrently for both the backend and frontend from the root directory

OR

##### Start Backend:

```sh
cd backend
npm run dev
```

##### Start Frontend

```sh
cd frontend
npm run dev
```

## 📌 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Tours**

- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour by ID
- `POST /api/tours` - Add a new tour
- `PUT /api/tours/:id` - Update a tour
- `DELETE /api/tours/:id` - Delete a tour

### **Reviews**

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Add a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

📩 **Contact:** For inquiries, email us at `l.deng@alustudent.com`

## Authors

- [Long Deng](https://github.com/longmaker2)
