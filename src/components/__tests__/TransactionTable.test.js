import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionTable from '../TransactionTable';

const mockTransactions = [
  {
    customerId: 'CUST001',
    transactionId: 'TXN001',
    amount: 120.50,
    date: '2025-01-15'
  },
  {
    customerId: 'CUST001',
    transactionId: 'TXN002',
    amount: 75.25,
    date: '2025-01-20'
  },
  {
    customerId: 'CUST001',
    transactionId: 'TXN003',
    amount: 200.00,
    date: '2025-02-10'
  }
];

describe('TransactionTable', () => {
  test('renders transaction table with headers', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  test('renders all transactions', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('TXN001')).toBeInTheDocument();
    expect(screen.getByText('TXN002')).toBeInTheDocument();
    expect(screen.getByText('TXN003')).toBeInTheDocument();
  });

  test('formats currency correctly', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('$120.50')).toBeInTheDocument();
    expect(screen.getByText('$75.25')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
  });

  test('calculates and displays reward points correctly', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText('91')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<TransactionTable transactions={[]} loading={true} />);

    expect(screen.getByText('🔄 Loading transactions...')).toBeInTheDocument();
  });

  test('shows no transactions message when empty', () => {
    render(<TransactionTable transactions={[]} />);

    expect(screen.getByText('📊 No transactions found for the selected period')).toBeInTheDocument();
  });

  test('handles null transactions', () => {
    render(<TransactionTable transactions={null} />);

    expect(screen.getByText('📊 No transactions found for the selected period')).toBeInTheDocument();
  });

  test('shows pagination when more than 10 transactions', () => {
    const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
      customerId: 'CUST001',
      transactionId: `TXN${i + 1}`,
      amount: 100,
      date: '2025-01-15'
    }));

    render(<TransactionTable transactions={manyTransactions} />);

    expect(screen.getByText('Showing 1 to 10 of 15 transactions')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('handles pagination navigation', () => {
    const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
      customerId: 'CUST001',
      transactionId: `TXN${i + 1}`,
      amount: 100,
      date: '2025-01-15'
    }));

    render(<TransactionTable transactions={manyTransactions} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(screen.getByText('Showing 11 to 15 of 15 transactions')).toBeInTheDocument();
  });

  test('disables previous button on first page', () => {
    const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
      customerId: 'CUST001',
      transactionId: `TXN${i + 1}`,
      amount: 100,
      date: '2025-01-15'
    }));

    render(<TransactionTable transactions={manyTransactions} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
      customerId: 'CUST001',
      transactionId: `TXN${i + 1}`,
      amount: 100,
      date: '2025-01-15'
    }));

    render(<TransactionTable transactions={manyTransactions} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });
});
