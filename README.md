Parcel Delivery Management System

Tech Stack
Node.js
Express.js
TypeScript
Mongoose
dotenv
JWT
Database: MongoDB

How to get started

Clone the repository
git clone https://github.com/Nahid-Mahmud/library-management-b5a3.git
Navigate to the project directory
cd library-management-b5a3
Install dependencies
npm install
Create a .env file in the root directory and add the following variables
PORT=5000
MONGO_URI=your_mongodb_uri
Run the server
npm run dev
API Endpoints
Book Endpoints
GET /api/books
GET /api/books/:id
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id
Borrow Book Endpoints
POST /api/borrow
GET /api/borrow
Postman Documentation