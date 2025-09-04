import { API } from '../constants';
import logger from '../logger';

/**
 * Simulate API delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} - Promise that resolves after delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch transactions data with simulated API call
 * @returns {Promise<Array>} - Promise that resolves to transactions array
 */
export const fetchTransactions = async () => {
  try {
    logger.info('Fetching transactions data');
    
    await delay(1000);
    
    const response = await fetch(`${API.BASE_URL}/${API.ENDPOINTS.TRANSACTIONS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    logger.info(`Successfully fetched ${data.length} transactions`);
    
    return data;
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions data');
  }
};

/**
 * Get unique customers from transactions
 * @param {Array} transactions - Array of transactions
 * @returns {Array} - Array of unique customers
 */
export const getUniqueCustomers = (transactions) => {
  const customerMap = new Map();
  
  transactions.forEach(transaction => {
    if (!customerMap.has(transaction.customerId)) {
      customerMap.set(transaction.customerId, {
        customerId: transaction.customerId,
        customerName: transaction.customerName
      });
    }
  });
  
  return Array.from(customerMap.values());
};

/**
 * Filter transactions by customer
 * @param {Array} transactions - Array of all transactions
 * @param {string} customerId - Customer ID to filter by
 * @returns {Array} - Filtered transactions for the customer
 */
export const getTransactionsByCustomer = (transactions, customerId) => {
  return transactions.filter(transaction => transaction.customerId === customerId);
};

/**
 * Filter transactions by month and year
 * @param {Array} transactions - Array of transactions
 * @param {number} year - Year to filter by
 * @param {number} month - Month to filter by (0-11)
 * @returns {Array} - Filtered transactions for the month/year
 */
export const getTransactionsByMonth = (transactions, year, month) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() === month;
  });
};

/**
 * Filter transactions by date range
 * @param {Array} transactions - Array of transactions
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered transactions for the date range
 */
export const getTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};
