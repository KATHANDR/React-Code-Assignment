import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import CustomerList from './components/CustomerList';
import FilterControls from './components/FilterControls';
import RewardSummary from './components/RewardSummary';
import TransactionTable from './components/TransactionTable';
import { fetchTransactions, getUniqueCustomers, getTransactionsByCustomer, getTransactionsByMonth } from './services/apiService';
import { getLastThreeMonths } from './utils/rewardCalculator';
import { YEARS } from './constants';
import logger from './logger';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(25px);
  border-radius: 28px;
  padding: 60px 50px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.6) 20%, 
      rgba(255, 255, 255, 0.8) 50%, 
      rgba(255, 255, 255, 0.6) 80%, 
      transparent 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const Title = styled.h1`
  color: #1f2937;
  margin-bottom: 25px;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, 
rgb(216, 202, 38) 0%, 
rgb(0, 83, 237) 25%, 
    #db2777 50%, 
    #ec4899 75%, 
    #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
  z-index: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 5px;
    background: linear-gradient(135deg, 
rgb(49, 175, 30) 0%, 
      #7c3aed 50%, 
      #db2777 100%);
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
      &::before {
    content: '🏆';
    font-size: 3.2rem;
  }
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #742a2a;
  padding: 20px;
  border: none;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.15);
  border-left: 4px solid #e53e3e;
  font-weight: 500;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #4a5568;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-out;
  
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid rgba(102, 126, 234, 0.3);
    border-radius: 50%;
    border-top-color: #667eea;
    animation: spin 1s ease-in-out infinite;
    margin-right: 12px;
    vertical-align: middle;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 40px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(99, 102, 241, 0.6) 20%, 
      rgba(236, 72, 153, 0.6) 50%, 
      rgba(99, 102, 241, 0.6) 80%, 
      transparent 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
    animation: float 10s ease-in-out infinite;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  &:nth-child(even) {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.15) 0%, 
      rgba(255, 255, 255, 0.08) 50%, 
      rgba(255, 255, 255, 0.12) 100%);
  }
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

function App() {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
    setSelectedMonth(''); // Empty means last 3 months
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        logger.info('App: Starting to load transaction data');
        
        const data = await fetchTransactions();
        setTransactions(data);
        
        const uniqueCustomers = getUniqueCustomers(data);
        setCustomers(uniqueCustomers);
        
        logger.info('App: Data loaded successfully', { 
          transactionCount: data.length, 
          customerCount: uniqueCustomers.length 
        });
      } catch (err) {
        logger.error('App: Error loading data', err);
        setError('Failed to load transaction data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!selectedCustomer) return [];
    
    let customerTransactions = getTransactionsByCustomer(transactions, selectedCustomer);
    
    if (selectedMonth !== '') {
      customerTransactions = getTransactionsByMonth(customerTransactions, selectedYear, selectedMonth);
    } else {
      const lastThreeMonths = getLastThreeMonths();
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      if (selectedYear === currentYear) {
        const startDate = new Date(currentYear, currentMonth - 2, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0);
        customerTransactions = customerTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      } else {
        customerTransactions = customerTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getFullYear() === selectedYear;
        });
      }
    }
    
    return customerTransactions;
  }, [transactions, selectedCustomer, selectedYear, selectedMonth]);

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    logger.info('App: Customer selected', { customerId });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    logger.info('App: Year changed', { year });
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    logger.info('App: Month changed', { month });
  };

  const handleResetFilters = () => {
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
    setSelectedMonth('');
    logger.info('App: Filters reset to default');
  };

  if (loading) {
    return (
      <AppContainer>
        <Header>
          <Title>Customer Rewards Program</Title>
          <Subtitle>Track and calculate reward points for customer transactions</Subtitle>
        </Header>
        <LoadingMessage>Loading application data...</LoadingMessage>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header>
        <Title>Customer Rewards Program</Title>
        <Subtitle>Track and calculate reward points for customer transactions</Subtitle>
      </Header>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <ContentSection>
        <SectionTitle>Select Customer</SectionTitle>
        <CustomerList
          customers={customers}
          selectedCustomer={selectedCustomer}
          onCustomerSelect={handleCustomerSelect}
          loading={loading}
        />
      </ContentSection>

      {selectedCustomer && (
        <>
          <ContentSection>
            <SectionTitle>Filter Transactions</SectionTitle>
            <FilterControls
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={handleYearChange}
              onMonthChange={handleMonthChange}
              onResetFilters={handleResetFilters}
              loading={loading}
            />
          </ContentSection>

          <ContentSection>
            <SectionTitle>Reward Points Summary</SectionTitle>
            <RewardSummary
              transactions={filteredTransactions}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              loading={loading}
            />
          </ContentSection>

          <ContentSection>
            <SectionTitle>Transaction Details</SectionTitle>
            <TransactionTable
              transactions={filteredTransactions}
              loading={loading}
            />
          </ContentSection>
        </>
      )}

      {!selectedCustomer && !loading && (
        <ContentSection>
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 40px', 
            color: '#718096',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            👤 Please select a customer to view their transaction details and reward points.
          </div>
        </ContentSection>
      )}
    </AppContainer>
  );
}

export default App;