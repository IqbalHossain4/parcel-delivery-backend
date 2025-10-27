<h1>📦 Parcel Delivery API</h1>
<p>A secure, modular, and role-based Parcel Delivery System Backend built using Express.js, Mongoose, and TypeScript — inspired by platforms like Pathao Courier or Sundarban.
It supports sender, receiver, and admin roles with full authentication, parcel management, and tracking.</p>
</hr>

<h2>🚀 Features</h2>
<p>✅ JWT-based Authentication & Authorization</p>
<p>✅ Three Roles: admin, sender, receiver</p>
<p>✅ Secure Password Hashing (bcrypt)</p>
<p>✅ Role-based Protected Routes</p>
<p>✅ Parcel Creation, Tracking, and Cancellation</p>
<p>✅ Parcel Status History (embedded logs)</p>
<p>✅ Admin Control (block, update, assign delivery)</p>
<p>✅ Google Distance API-based Fee Calculation (optional)</p>
<p>✅ Zod-based Request Validation</p>
</hr>

<h2>🧱 Tech Stack</h2>

| Category | Technology |
|-----------|-------------|
| Framework | **Express.js (TypeScript)** |
| Database | **MongoDB (Mongoose)** |
| Validation | **Zod** |
| Authentication | **JWT (Access & Refresh Tokens)** |
| Authorization | **Role-based (Admin, User, Delivery Person)** |
| Utilities | **Bcrypt**, **Multer**, **QueryBuilder** |
| Environment | `.env` configuration support |

</hr>

<h2>⚙️ Setup Instructions</h2>

<h3>1️⃣ Clone the Repository</h3>
git clone https://github.com/IqbalHossain4/parcel-delivery-backend.git
cd parcel-delivery-backend


<h3>2️⃣ Install Dependencies</h3>
npm install

<h3>3️⃣ Configure environment (.env)</h3>


# 🔧 SERVER CONFIGURATION

PORT=5000
NODE_ENV=development


# 🗄️ DATABASE

DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/parcel-delivery-backend


# 🔐 BCRYPT CONFIG

BCRYPT_SALT_ROUND=10


# 🔑 JWT CONFIG

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=7d


# 🌐 FRONTEND URL

FRONTEND_URL=http://localhost:5173


# 🔓 GOOGLE AUTH

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# 📧 SMTP CONFIG (for email)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# 🗺️ GOOGLE MAPS API

GOOGLE_MAPS_API_KEY=your_google_maps_api_key

<h3>4️⃣ Run the Server</h3>
npm run dev

</hr>

<h1>🧭 API Endpoints</h1>
---

### 🔐 **AUTH ROUTES**

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **POST** | `/api/v1/auth/login` | Login using credentials | Public |
| **POST** | `/api/v1/auth/refresh-token` | Get new access token | Public |
| **POST** | `/api/v1/auth/logout` | Logout and clear token | Authenticated |
| **POST** | `/api/v1/auth/change-password` | Change current password | All Roles |
| **POST** | `/api/v1/auth/forgot-password` | Send reset password link | Public |
| **GET** | `/api/v1/auth/google` | Start Google OAuth login | Public |
| **GET** | `/api/v1/auth/google/callback` | Handle Google OAuth callback | Public |

---

### 👤 **USER ROUTES**

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **POST** | `/api/v1/users/register` | Register new user (Sender/Receiver/Admin) | Public |
| **GET** | `/api/v1/users/allUser` | Get all users | Admin |
| **GET** | `/api/v1/users/me` | Get logged-in user's profile | All Roles |
| **GET** | `/api/v1/users/:id` | Get specific user by ID | Admin |
| **PATCH** | `/api/v1/users/:id` | Update user information | Admin |

---

### 📦 **PARCEL ROUTES**

#### 🧑‍💼 Sender Routes
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **POST** | `/api/v1/parcels` | Create a new parcel | Sender |
| **GET** | `/api/v1/parcels/me` | Get all parcels created by sender | Sender |
| **PATCH** | `/api/v1/parcels/cancel/:id` | Cancel parcel (if not dispatched) | Sender |

---

#### 📥 Receiver Routes
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **GET** | `/api/v1/parcels/incoming` | View incoming parcels | Receiver |
| **PATCH** | `/api/v1/parcels/confirm-delivery/:id` | Confirm parcel delivery | Receiver |

---

#### 🧑‍💼 Admin Routes
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **GET** | `/api/v1/parcels/all-parcels` | Get all parcels (with filters, search, pagination) | Admin |
| **GET** | `/api/v1/parcels/:id` | Get specific parcel details | Admin |
| **PATCH** | `/api/v1/parcels/status/:id` | Update parcel status (requested → dispatched → delivered) | Admin |
| **PATCH** | `/api/v1/parcels/block/:id` | Block/unblock a parcel | Admin |
| **PATCH** | `/api/v1/parcels/assign/:id` | Assign a delivery person to a parcel | Admin |

---

#### 🔍 Tracking Route
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| **GET** | `/api/v1/parcels/track/:trackingId` | Track parcel using tracking ID | Sender / Receiver |


Portman Doc: https://documenter.getpostman.com/view/46353691/2sB3Wk14eN
