# Customer Rewards Program

A React-based application that calculates and displays reward points for customer transactions based on a tiered rewards system.

## Features

- **Reward Points Calculation**: 
  - 2 points for every dollar spent over $100
  - 1 point for every dollar spent between $50 and $100
  - Example: $120 purchase = 2×$20 + 1×$50 = 90 points

- **Customer Management**: 
  - Dynamic customer list with 20+ customers
  - Customer selection dropdown

- **Transaction Filtering**:
  - Month and year dropdown filters
  - Default to last 3 months view
  - Filter by specific month/year combinations

- **Reward Summary**:
  - Monthly reward points breakdown
  - Total reward points calculation
  - Visual summary cards

- **Transaction Details**:
  - Detailed transaction table with pagination
  - Individual transaction reward points
  - Formatted currency and dates

- **Responsive Design**:
  - Modern UI with styled-components
  - Mobile-friendly layout
  - Loading states and error handling

## Project Structure

```
src/
├── components/           # React components
│   ├── CustomerList.js
│   ├── FilterControls.js
│   ├── RewardSummary.js
│   ├── TransactionTable.js
│   └── __tests__/       # Component tests
├── constants/           # Application constants
│   └── index.js
├── services/           # API services
│   └── apiService.js
├── utils/              # Utility functions
│   ├── rewardCalculator.js
│   └── __tests__/      # Utility tests
├── logger.js           # Logging configuration
└── App.js              # Main application component

public/
└── data/
    └── transactions.json  # Mock transaction data
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeassignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Component Details

### CustomerList
- Displays dropdown of all available customers
- Handles customer selection
- Shows loading state during data fetch

### FilterControls
- Year selector (2021-2025)
- Month selector (January-December)
- Reset to last 3 months functionality
- Responsive design with proper validation

### RewardSummary
- Calculates and displays monthly reward points
- Shows total reward points across all transactions
- Handles both specific month and last 3 months views
- Visual summary cards with clear formatting

### TransactionTable
- Displays transaction details in a paginated table
- Shows transaction ID, date, amount, and reward points
- Handles pagination for large datasets (10 items per page)
- Proper currency and date formatting

## API Service

The application simulates API calls with:
- 1-second delay to simulate network latency
- Error handling for failed requests
- Loading states during data fetch
- Mock data from `public/data/transactions.json`

## Reward Calculation Logic

The reward points are calculated as follows:

```javascript
// For amounts over $100: 2 points per dollar
if (amount > 100) {
  points += (amount - 100) * 2;
}

// For amounts between $50 and $100: 1 point per dollar
if (amount > 50) {
  points += Math.min(amount - 50, 50) * 1;
}
```

## Testing

The application includes comprehensive unit tests:

### Positive Test Cases:
1. **Transaction over $100**: $120 = 90 points (2×$20 + 1×$50)
2. **Transaction between $50-$100**: $75 = 25 points (1×$25)
3. **Large transaction**: $500 = 850 points (2×$400 + 1×$50)
4. **Fractional amounts**: $120.50 = 91 points
5. **Exact thresholds**: $100 = 50 points, $50 = 0 points
6. **Multiple transactions**: Correctly sums rewards across transactions

### Negative Test Cases:
1. **Zero amount**: Returns 0 points
2. **Negative amount**: Returns 0 points
3. **Amount less than $50**: Returns 0 points
4. **Very small amounts**: $0.01 = 0 points
5. **Large negative amounts**: -$1000 = 0 points
6. **Empty transaction arrays**: Handles gracefully

Run tests with:
```bash
npm test
```

## Logging

The application uses Pino for structured logging:
- Logs customer selections
- Tracks filter changes
- Records API calls and errors
- Monitors reward calculations

## Data Structure

### Transaction Object:
```javascript
{
  "customerId": "CUST001",
  "customerName": "John Smith",
  "transactionId": "TXN001",
  "amount": 120.50,
  "date": "2025-01-15"
}
```

### Mock Data:
- 20 unique customers
- 65+ transactions across 3 months
- Various transaction amounts (including edge cases)
- Realistic date distribution

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Pagination for large datasets
- Memoized calculations to prevent unnecessary re-renders
- Efficient filtering and sorting
- Lazy loading of transaction details

## Error Handling

- API error states with user-friendly messages
- Loading states for all async operations
- Graceful handling of empty data
- Input validation and sanitization

## Future Enhancements

- Export functionality for transaction reports
- Advanced filtering options (date ranges, amount ranges)
- Customer search functionality
- Real-time data updates
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Screenshots

### Main Application View
![Main Application](screenshots/main-view.png)
*Customer selection and reward summary display*

### Transaction Details
![Transaction Table](screenshots/transaction-table.png)
*Detailed transaction view with pagination*

### Filter Controls
![Filter Controls](screenshots/filter-controls.png)
*Month and year filtering options*

### Mobile Responsive View
![Mobile View](screenshots/mobile-view.png)
*Responsive design on mobile devices*

## Test Results

### Unit Tests
```
PASS src/utils/__tests__/rewardCalculator.test.js
PASS src/components/__tests__/CustomerList.test.js
PASS src/components/__tests__/FilterControls.test.js
PASS src/components/__tests__/TransactionTable.test.js

Test Suites: 4 passed, 4 total
Tests: 25 passed, 25 total
Snapshots: 0 total
Time: 2.456s
```

### Test Coverage
- Reward Calculator: 100% coverage
- Component Logic: 95% coverage
- API Service: 90% coverage
- Overall: 94% coverage

## Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   npm start
   ```

2. **Dependencies not installed**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Tests failing**:
   ```bash
   # Clear test cache
   npm test -- --clearCache
   ```

   4. **Working Screeenshots**:
<img width="447" height="677" alt="image" src="https://github.com/user-attachments/assets/de12cda3-ced4-4b74-b63e-d853be2e120d" />

### Test cases:
<img width="1155" height="522" alt="image" src="https://github.com/user-attachments/assets/398e8e19-583c-42eb-999e-a9e4ff23d4c0" />


## Support

For support or questions, please open an issue in the repository or contact the development team.
