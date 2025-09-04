export const MONTHS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

export const YEARS = [
  { value: 2021, label: '2021' },
  { value: 2022, label: '2022' },
  { value: 2023, label: '2023' },
  { value: 2024, label: '2024' },
  { value: 2025, label: '2025' }
];

export const REWARD_POINTS = {
  OVER_100_MULTIPLIER: 2,
  BETWEEN_50_100_MULTIPLIER: 1,
  OVER_100_THRESHOLD: 100,
  BETWEEN_50_100_THRESHOLD: 50
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  DEFAULT_PAGE: 1
};

export const API = {
  BASE_URL: '/data',
  ENDPOINTS: {
    TRANSACTIONS: 'transactions.json'
  }
};

export const MESSAGES = {
  NO_TRANSACTIONS: 'No transactions found for the selected period',
  LOADING: 'Loading...',
  ERROR: 'Error loading data',
  SELECT_CUSTOMER: 'Please select a customer to view transactions'
};
