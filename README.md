# Personal Finance Tracker

## Features

### Core Functionality
- ✅ **Transaction Management** - Add, edit, delete, and view transactions
- ✅ **Income & Expense Tracking** - Separate tracking with positive/negative amounts
- ✅ **Category Management** - Organize transactions by categories
- ✅ **Date Filtering** - Filter transactions by date ranges
- ✅ **Search Functionality** - Search transactions by title, description, or category

### Advanced Features
- ✅ **Analytics Dashboard** - Interactive charts and financial insights
- ✅ **Real-time Statistics** - Live calculation of income, expenses, and balance
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Data Export** - Export financial data as JSON
- ✅ **Advanced Filtering** - Filter by category, date, and sort options

### Technical Features
- ✅ **RESTful API** - Clean, well-documented API endpoints
- ✅ **Input Validation** - Both client-side and server-side validation
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- ✅ **Performance Optimized** - Fast loading and smooth interactions

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for analytics
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

## Project Structure

```
personal-finance-tracker/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React Context for state
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-finance-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
NODE_ENV=development" > .env

# Start MongoDB (if using local installation)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📊 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions (with optional filters)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Statistics
- `GET /api/transactions/stats/summary` - Get transaction statistics
