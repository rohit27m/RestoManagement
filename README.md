# Restaurant Order Management System

A full-featured restaurant order management application with separate interfaces for waiters and chefs.

## Features

✅ **User Authentication**
- Waiter login
- Chef login
- Admin access

✅ **Table Management**
- 10 tables by default
- Real-time table status (available/occupied)
- Visual table grid

✅ **Order Management**
- Create orders for each table
- Add multiple items with half/full portions
- Track order status (pending → preparing → ready → served → completed)
- Real-time order updates

✅ **Menu System**
- Add/delete menu items
- Categorize items (Starters, Main Course, Desserts, etc.)
- Half and full portion pricing
- Menu availability control

✅ **Bill Generation**
- Professional bill format with restaurant details
- Itemized billing
- Tax calculation
- Printable bills

✅ **Chef Dashboard**
- View pending orders
- Track orders being prepared
- Mark orders as ready
- Kanban-style order board

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and go to: `http://localhost:3000`

## Default Login Credentials

| Role   | Username | Password   |
|--------|----------|------------|
| Admin  | admin    | admin123   |
| Waiter | waiter1  | waiter123  |
| Chef   | chef1    | chef123    |

## Usage

### For Waiters:
1. Login with waiter credentials
2. View table status on the dashboard
3. Click on an available table to create a new order
4. Select menu items (half/full portions)
5. Submit the order - it goes to the kitchen
6. Generate and print bills
7. Complete orders to free up tables

### For Chefs:
1. Login with chef credentials
2. View all incoming orders in the "Pending" column
3. Click "Start Preparing" to move orders to "Preparing"
4. Click "Mark Ready" when the order is complete
5. Orders automatically move between columns

### For Admins:
- Access restaurant settings
- Manage menu items
- Update restaurant information
- Set tax rates

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Authentication**: Express-session + bcrypt

## Project Structure

```
restaurant-order-management/
├── server.js              # Main server file
├── package.json           # Dependencies
├── restaurant.db          # SQLite database (auto-created)
└── public/
    ├── login.html         # Login page
    ├── waiter.html        # Waiter dashboard
    ├── waiter.js          # Waiter functionality
    ├── chef.html          # Chef dashboard
    ├── chef.js            # Chef functionality
    └── styles.css         # All styles
```

## Database Schema

- **users**: User authentication (waiter, chef, admin)
- **restaurant_info**: Restaurant details, tax rates
- **menu_items**: Menu with categories and pricing
- **tables**: Table numbers and status
- **orders**: Order header with status tracking
- **order_items**: Individual items in each order

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Check current session

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `PATCH /api/orders/:id/status` - Update order status

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Tables
- `GET /api/tables` - Get all tables with status

### Bills
- `GET /api/orders/:id/bill` - Generate bill

## Customization

### Add More Tables
In `server.js`, modify the table initialization:
```javascript
for (let i = 1; i <= 20; i++) {  // Change 20 to desired number
  db.prepare('INSERT INTO tables (table_number) VALUES (?)').run(i);
}
```

### Change Port
In `server.js`, modify:
```javascript
const PORT = 3000;  // Change to your desired port
```

### Modify Tax Rate
Login as admin → Settings tab → Update tax rate

## Features for Future Enhancement

- Order history and analytics
- Daily/monthly sales reports
- Customer management
- Reservation system
- Kitchen display system (KDS)
- Mobile app version
- Multi-restaurant support
- Integration with payment systems

## License

MIT License - Feel free to use for your restaurant!

## Support

For issues or questions, please create an issue in the repository.
