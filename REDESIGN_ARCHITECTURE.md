# 🎨 Restaurant Management System - SaaS Redesign Architecture

## 📁 Complete Folder Structure

```
Project1/
├── app/                                    # Next.js App Router
│   ├── (auth)/                            # Auth group (public)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (admin)/                           # Admin protected routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── restaurants/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── menu/page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   └── layout.tsx                     # Admin layout with sidebar
│   │
│   ├── (manager)/                         # Manager protected routes
│   │   ├── manager/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── import/page.tsx        # PDF import
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── invoice/page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── inventory/
│   │   │       └── page.tsx
│   │   └── layout.tsx                     # Manager layout with sidebar
│   │
│   ├── api/                               # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── admin/
│   │   │   ├── restaurants/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   └── users/route.ts
│   │   ├── manager/
│   │   │   ├── menu/
│   │   │   │   ├── route.ts
│   │   │   │   ├── import/route.ts        # PDF parser
│   │   │   │   └── [id]/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── analytics/route.ts
│   │   └── invoice/
│   │       └── [orderId]/route.ts
│   │
│   ├── globals.css                        # Tailwind + custom styles
│   ├── layout.tsx                         # Root layout
│   └── page.tsx                           # Landing/redirect
│
├── components/                            # UI Components
│   ├── ui/                               # Base components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Badge.tsx
│   │   └── Dropdown.tsx
│   │
│   ├── layouts/                          # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   │
│   ├── dashboard/                        # Dashboard components
│   │   ├── StatCard.tsx
│   │   ├── RecentOrders.tsx
│   │   ├── QuickActions.tsx
│   │   └── ActivityFeed.tsx
│   │
│   ├── menu/                            # Menu components
│   │   ├── MenuGrid.tsx
│   │   ├── MenuCard.tsx
│   │   ├── MenuFilters.tsx
│   │   ├── MenuUploader.tsx
│   │   └── PDFPreview.tsx
│   │
│   ├── analytics/                       # Analytics components
│   │   ├── SalesChart.tsx
│   │   ├── PeakHoursChart.tsx
│   │   ├── PopularItemsChart.tsx
│   │   └── RevenueChart.tsx
│   │
│   ├── invoice/                         # Invoice components
│   │   ├── InvoiceTemplate.tsx
│   │   ├── InvoicePreview.tsx
│   │   └── InvoiceDownload.tsx
│   │
│   └── auth/                           # Auth components
│       ├── LoginForm.tsx
│       └── ProtectedRoute.tsx
│
├── lib/                                # Utilities & Config
│   ├── auth/
│   │   ├── jwt.ts                      # JWT helpers
│   │   ├── middleware.ts               # Auth middleware
│   │   └── permissions.ts              # Role permissions
│   │
│   ├── api/
│   │   ├── client.ts                   # API client
│   │   └── endpoints.ts                # API endpoints config
│   │
│   ├── pdf/
│   │   ├── parser.ts                   # PDF parsing logic
│   │   └── generator.ts                # PDF generation
│   │
│   ├── db/
│   │   ├── connection.ts               # Database connection
│   │   ├── queries.ts                  # SQL queries
│   │   └── models.ts                   # TypeScript types
│   │
│   ├── utils/
│   │   ├── format.ts                   # Formatters
│   │   ├── validation.ts               # Input validation
│   │   └── constants.ts                # Constants
│   │
│   └── hooks/                          # Custom React hooks
│       ├── useAuth.ts
│       ├── useToast.ts
│       ├── useAnalytics.ts
│       └── useMenu.ts
│
├── types/                              # TypeScript definitions
│   ├── auth.ts
│   ├── restaurant.ts
│   ├── menu.ts
│   ├── order.ts
│   └── analytics.ts
│
├── public/
│   ├── fonts/
│   └── images/
│
├── config/
│   └── site.ts                        # Site configuration
│
├── middleware.ts                      # Next.js middleware (auth check)
├── tailwind.config.ts                 # Tailwind config
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🎨 Design System

### Color Palette
```typescript
colors: {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  green: {
    DEFAULT: '#10B981',
    dark: '#059669',
    light: '#34D399',
  },
  red: {
    DEFAULT: '#EF4444',
    dark: '#DC2626',
    light: '#F87171',
  }
}
```

### Typography
- **Font**: Inter (sans-serif)
- **Sizes**: text-xs to text-5xl
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- Consistent 4px grid system
- Standard padding: p-4, p-6, p-8
- Standard margins: mb-4, mb-6, mb-8

---

## 🔐 Authentication Flow

```typescript
// JWT Structure
interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'manager';
  restaurantId?: number;  // Only for managers
  iat: number;
  exp: number;
}

// Login Flow
1. User submits credentials
2. Backend validates and generates JWT
3. JWT stored in httpOnly cookie
4. Middleware validates on each protected route
5. Role-based redirect to appropriate dashboard
```

---

## 📊 Database Schema Updates

```sql
-- Add new tables for SaaS architecture

CREATE TABLE restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  tax_rate DECIMAL(5,2) DEFAULT 0,
  logo_url VARCHAR(500),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Update users table for SaaS roles
ALTER TABLE users 
ADD COLUMN role ENUM('admin', 'manager', 'waiter', 'chef') NOT NULL,
ADD COLUMN restaurant_id INT NULL,
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN email VARCHAR(255) UNIQUE,
ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

-- Menu items now tied to restaurants
ALTER TABLE menu_items
ADD COLUMN restaurant_id INT NOT NULL,
ADD COLUMN image_url VARCHAR(500),
ADD COLUMN description TEXT,
ADD COLUMN dietary_tags JSON,
ADD COLUMN is_bestseller BOOLEAN DEFAULT 0,
ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

-- PDF import tracking
CREATE TABLE menu_imports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  filename VARCHAR(255),
  status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
  items_imported INT DEFAULT 0,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Analytics data
CREATE TABLE sales_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  date DATE NOT NULL,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  avg_order_value DECIMAL(10,2) DEFAULT 0,
  peak_hour INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  UNIQUE KEY unique_restaurant_date (restaurant_id, date)
);

-- Invoices
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  pdf_url VARCHAR(500),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  generated_by INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

---

## 🎯 Key Features Implementation

### 1. Role-Based Access Control
```typescript
// Middleware checks role and redirects accordingly
Admin -> /admin/dashboard
Manager -> /manager/dashboard
```

### 2. Invoice Generator
- Order data → Invoice template
- PDF generation using jsPDF or react-pdf
- Download or email
- Print-optimized A4 layout

### 3. PDF Menu Parser
- Upload PDF → Parse with pdf-parse
- Extract text → Parse items
- AI/regex extraction of prices, names
- Preview before save
- Batch import to database

### 4. Analytics Dashboard
- Recharts for visualization
- Real-time data updates
- Filters: date range, category
- Export to CSV

---

## 📦 Required Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "mysql2": "^3.0.0",
    "recharts": "^2.10.0",
    "jspdf": "^2.5.0",
    "pdf-parse": "^1.1.1",
    "react-dropzone": "^14.2.0",
    "zod": "^3.22.0",
    "react-hot-toast": "^2.4.0",
    "framer-motion": "^10.0.0",
    "date-fns": "^3.0.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcrypt": "^5.0.0"
  }
}
```

---

This architecture provides a scalable, production-ready SaaS platform with clear separation of concerns, modern UI/UX, and comprehensive features.
