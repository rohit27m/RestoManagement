# Restaurant Management System with Next.js

A modern restaurant management system built with **Next.js** (frontend) and **Express.js** (backend API).

## Features

- 🍽️ **Multi-role System**: Waiter, Chef, and Admin roles
- 📋 **Table Management**: Track table status and occupancy
- 📝 **Order Management**: Create, track, and complete orders
- 👨‍🍳 **Kitchen Dashboard**: Chef interface for order preparation
- 💰 **Bill Generation**: Automatic bill calculation with tax
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling

### Backend
- **Express.js** - API server
- **MySQL** - Database
- **Express-session** - Authentication
- **bcrypt** - Password hashing

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher)
2. **MySQL Server** (v8 or higher)
3. **npm** (comes with Node.js)

### Installing MySQL

**Option 1: MySQL (Standalone)**
- Download from https://dev.mysql.com/downloads/installer/
- Install and start the MySQL service

**Option 2: XAMPP (Recommended for Windows)**
- Download from https://www.apachefriends.org/
- Install and start MySQL from XAMPP control panel

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rohit27m/RestoManagement.git
cd RestoManagement
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Setup Database

1. Start your MySQL server
2. Create the database:

```sql
CREATE DATABASE restaurant_management;
```

3. Import the database schema:

```bash
mysql -u root -p restaurant_management < database.sql
```

Or use phpMyAdmin to import `database.sql`

### 5. Configure Database Connection

Edit `server.js` if your MySQL credentials are different:

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Change if different
  password: '',      // Add your password if set
  database: 'restaurant_management',
  // ...
});
```

## Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev:all
```

This will start:
- Backend API on http://localhost:3000
- Next.js frontend on http://localhost:3001

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## Accessing the Application

Open your browser and go to: **http://localhost:3001**

### Demo Credentials

#### Waiter Access
- Username: `waiter1`
- Password: `waiter123`

#### Chef Access
- Username: `chef1`
- Password: `chef123`

#### Admin Access
- Username: `admin`
- Password: `admin123`

## User Roles & Features

### Waiter Dashboard
- View all tables and their status
- Create new orders for tables
- View active orders
- Generate and print bills
- Complete orders and free tables
- Manage menu items
- Update restaurant settings

### Chef Dashboard
- View pending orders in real-time
- Track order preparation status
- Move orders through stages:
  - Pending → Preparing → Ready → Served
- Auto-refresh every 10 seconds

### Admin Dashboard
- Same access as Waiter
- Can manage restaurant settings
- Full menu management

## Project Structure

```
RestoManagement/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx       # Login page
│   │   ├── waiter/        # Waiter dashboard
│   │   │   └── page.tsx
│   │   └── chef/          # Chef dashboard
│   │       └── page.tsx
│   ├── public/
│   └── package.json
├── public/                 # Static files (legacy)
├── server.js              # Express API server
├── database.sql           # Database schema
├── package.json           # Backend dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Check session

### Tables
- `GET /api/tables` - Get all tables

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/bill` - Get order bill

### Restaurant
- `GET /api/restaurant` - Get restaurant info
- `PUT /api/restaurant` - Update restaurant info

## Development

### Backend Development
```bash
npm run dev
```
Uses `nodemon` for auto-restart on file changes.

### Frontend Development
```bash
cd client
npm run dev
```
Next.js dev server with hot reload.

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Make sure MySQL is running. Start it via services or XAMPP.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Stop the process using port 3000 or change the port in `server.js`.

### CORS Errors
Make sure both servers are running:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

## Production Deployment

### Environment Variables
Create `.env` files:

**Backend (.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=restaurant_management
SESSION_SECRET=your-secret-key
PORT=3000
```

**Frontend (client/.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Build for Production

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Express.js**
