import { 
  calculateRewardPoints, 
  calculateTransactionsWithRewards, 
  calculateMonthlyRewards, 
  calculateTotalRewards 
} from '../rewardCalculator';

describe('Reward Calculator', () => {
  describe('calculateRewardPoints', () => {
    test('should calculate correct points for transaction over $100', () => {
      expect(calculateRewardPoints(120)).toBe(90);
    });

    test('should calculate correct points for transaction between $50 and $100', () => {
      expect(calculateRewardPoints(75)).toBe(25);
    });

    test('should calculate correct points for transaction exactly $100', () => {
      expect(calculateRewardPoints(100)).toBe(50);
    });

    test('should calculate correct points for large transaction', () => {
      expect(calculateRewardPoints(500)).toBe(850);
    });

    test('should calculate correct points for fractional amounts', () => {
      expect(calculateRewardPoints(120.50)).toBe(91);
    });

    test('should calculate correct points for transaction with many decimal places', () => {
      expect(calculateRewardPoints(150.999)).toBe(151);
    });

    test('should return 0 points for zero amount', () => {
      expect(calculateRewardPoints(0)).toBe(0);
    });

    test('should return 0 points for negative amount', () => {
      expect(calculateRewardPoints(-50)).toBe(0);
    });

    test('should return 0 points for amount less than $50', () => {
      expect(calculateRewardPoints(25)).toBe(0);
    });

    test('should return 0 points for exactly $50', () => {
      expect(calculateRewardPoints(50)).toBe(0);
    });

    test('should handle very small positive amounts', () => {
      expect(calculateRewardPoints(0.01)).toBe(0);
    });

    test('should handle very large negative amounts', () => {
      expect(calculateRewardPoints(-1000)).toBe(0);
    });
  });

  describe('calculateTransactionsWithRewards', () => {
    const mockTransactions = [
      { customerId: 'CUST001', transactionId: 'TXN001', amount: 120, date: '2025-01-15' },
      { customerId: 'CUST001', transactionId: 'TXN002', amount: 75, date: '2025-01-20' },
      { customerId: 'CUST001', transactionId: 'TXN003', amount: 25, date: '2025-01-25' }
    ];

    test('should add reward points to all transactions', () => {
      const result = calculateTransactionsWithRewards(mockTransactions);
      
      expect(result).toHaveLength(3);
      expect(result[0].rewardPoints).toBe(90); // $120 = 90 points
      expect(result[1].rewardPoints).toBe(25); // $75 = 25 points
      expect(result[2].rewardPoints).toBe(0);  // $25 = 0 points
    });

    test('should preserve original transaction data', () => {
      const result = calculateTransactionsWithRewards(mockTransactions);
      
      expect(result[0]).toEqual({
        customerId: 'CUST001',
        transactionId: 'TXN001',
        amount: 120,
        date: '2025-01-15',
        rewardPoints: 90
      });
    });

    test('should handle empty array', () => {
      const result = calculateTransactionsWithRewards([]);
      expect(result).toEqual([]);
    });
  });

  describe('calculateMonthlyRewards', () => {
    const mockTransactions = [
      { customerId: 'CUST001', transactionId: 'TXN001', amount: 120, date: '2025-01-15' },
      { customerId: 'CUST001', transactionId: 'TXN002', amount: 75, date: '2025-01-20' },
      { customerId: 'CUST001', transactionId: 'TXN003', amount: 200, date: '2025-02-10' },
      { customerId: 'CUST001', transactionId: 'TXN004', amount: 50, date: '2025-02-15' }
    ];

    test('should calculate correct rewards for January 2025', () => {
      const result = calculateMonthlyRewards(mockTransactions, 2025, 0); // January = 0
      expect(result).toBe(115); // 90 + 25 = 115 points
    });

    test('should calculate correct rewards for February 2025', () => {
      const result = calculateMonthlyRewards(mockTransactions, 2025, 1); // February = 1
      expect(result).toBe(250); // 300 + 0 = 250 points (200 = 2x100 + 1x50 = 200 + 50 = 250)
    });

    test('should return 0 for month with no transactions', () => {
      const result = calculateMonthlyRewards(mockTransactions, 2025, 2); // March = 2
      expect(result).toBe(0);
    });

    test('should handle empty transactions array', () => {
      const result = calculateMonthlyRewards([], 2025, 0);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalRewards', () => {
    const mockTransactions = [
      { customerId: 'CUST001', transactionId: 'TXN001', amount: 120, date: '2025-01-15' },
      { customerId: 'CUST001', transactionId: 'TXN002', amount: 75, date: '2025-01-20' },
      { customerId: 'CUST001', transactionId: 'TXN003', amount: 200, date: '2025-02-10' }
    ];

    test('should calculate correct total rewards', () => {
      const result = calculateTotalRewards(mockTransactions);
      expect(result).toBe(365); // 90 + 25 + 250 = 365 points
    });

    test('should return 0 for empty transactions array', () => {
      const result = calculateTotalRewards([]);
      expect(result).toBe(0);
    });

    test('should handle transactions with zero rewards', () => {
      const transactionsWithZero = [
        { customerId: 'CUST001', transactionId: 'TXN001', amount: 25, date: '2025-01-15' },
        { customerId: 'CUST001', transactionId: 'TXN002', amount: 30, date: '2025-01-20' }
      ];
      const result = calculateTotalRewards(transactionsWithZero);
      expect(result).toBe(0);
    });
  });
});
