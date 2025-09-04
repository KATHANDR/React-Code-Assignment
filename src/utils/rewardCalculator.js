import { REWARD_POINTS } from '../constants';

/**
 * Calculate reward points for a single transaction
 * @param {number} amount - Transaction amount
 * @returns {number} - Reward points earned
 */
export const calculateRewardPoints = (amount) => {
  if (amount <= 0) return 0;
  
  let points = 0;
  
  if (amount > REWARD_POINTS.OVER_100_THRESHOLD) {
    const over100Amount = amount - REWARD_POINTS.OVER_100_THRESHOLD;
    points += over100Amount * REWARD_POINTS.OVER_100_MULTIPLIER;
  }
  
  if (amount > REWARD_POINTS.BETWEEN_50_100_THRESHOLD) {
    const between50And100Amount = Math.min(
      amount - REWARD_POINTS.BETWEEN_50_100_THRESHOLD,
      REWARD_POINTS.OVER_100_THRESHOLD - REWARD_POINTS.BETWEEN_50_100_THRESHOLD
    );
    points += between50And100Amount * REWARD_POINTS.BETWEEN_50_100_MULTIPLIER;
  }
  
  return Math.floor(points);
};

/**
 * Calculate reward points for multiple transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} - Array of transactions with reward points added
 */
export const calculateTransactionsWithRewards = (transactions) => {
  return transactions.map(transaction => ({
    ...transaction,
    rewardPoints: calculateRewardPoints(transaction.amount)
  }));
};

/**
 * Calculate total reward points for a customer in a specific month
 * @param {Array} transactions - Array of transactions for the customer
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {number} - Total reward points for the month
 */
export const calculateMonthlyRewards = (transactions, year, month) => {
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() === month;
  });
  
  return monthlyTransactions.reduce((total, transaction) => {
    return total + calculateRewardPoints(transaction.amount);
  }, 0);
};

/**
 * Calculate total reward points for a customer across all transactions
 * @param {Array} transactions - Array of transactions for the customer
 * @returns {number} - Total reward points
 */
export const calculateTotalRewards = (transactions) => {
  return transactions.reduce((total, transaction) => {
    return total + calculateRewardPoints(transaction.amount);
  }, 0);
};

/**
 * Get the last 3 months from current date
 * @returns {Array} - Array of {year, month} objects
 */
export const getLastThreeMonths = () => {
  const now = new Date();
  const months = [];
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
  }
  
  return months;
};
