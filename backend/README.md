# Personal Finance Tracker - Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing personal finance transactions.

## Features

- ✅ CRUD operations for transactions
- ✅ Input validation and error handling
- ✅ Transaction filtering by category and date
- ✅ Statistics and summary endpoints
- ✅ CORS enabled for frontend integration
- ✅ Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
   NODE_ENV=development
   ```

4. Start MongoDB:
   - If using local MongoDB, make sure MongoDB service is running
   - If using MongoDB Atlas, update the MONGODB_URI in your .env file

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the API is running

### Transactions
- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions/:id` - Get single transaction
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions/:id` - Update transaction
- **DELETE** `/api/transactions/:id` - Delete transaction

### Statistics
- **GET** `/api/transactions/stats/summary` - Get transaction statistics

## API Usage Examples

### Get All Transactions
```bash
curl http://localhost:5000/api/transactions
```

### Get Transactions with Filters
```bash
# Filter by category
curl "http://localhost:5000/api/transactions?category=food"

# Filter by date range
curl "http://localhost:5000/api/transactions?startDate=2024-01-01&endDate=2024-01-31"

# Sort by amount (ascending)
curl "http://localhost:5000/api/transactions?sortBy=amount&sortOrder=asc"
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Salary",
    "amount": 5000,
    "category": "income",
    "description": "Monthly salary"
  }'
```

### Update Transaction
```bash
curl -X PUT http://localhost:5000/api/transactions/TRANSACTION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Salary",
    "amount": 5500
  }'
```

### Delete Transaction
```bash
curl -X DELETE http://localhost:5000/api/transactions/TRANSACTION_ID
```

## Transaction Schema

```javascript
{
  title: String (required, max 100 chars),
  amount: Number (required, cannot be zero),
  date: Date (defaults to current date),
  category: String (required, enum: income, expense, food, transportation, entertainment, shopping, bills, healthcare, education, other),
  description: String (optional, max 500 chars),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Response Format

All API responses follow this format:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors (if any)
}
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database connection errors
- Invalid ID formats
- Missing resources
- Server errors

## Development

### Project Structure
```
backend/
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routes/             # Express routes
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # This file
```

### Adding New Features

1. Create new model in `models/`
2. Add controller functions in `controllers/`
3. Create routes in `routes/`
4. Add validation in `middleware/validation.js`
5. Update server.js to include new routes

## Testing with Postman

Import the following collection into Postman for easy API testing:

1. Create a new collection called "Personal Finance Tracker"
2. Add requests for each endpoint
3. Use the examples above for request bodies
4. Test the API endpoints

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Update CORS origins to include your frontend domain
4. Use a process manager like PM2
5. Set up proper logging and monitoring

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file
   - Verify network connectivity

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

3. **CORS Errors**
   - Check the CORS configuration in server.js
   - Ensure your frontend URL is included in the allowed origins

## License

This project is licensed under the ISC License.
