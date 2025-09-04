import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { calculateMonthlyRewards, calculateTotalRewards } from '../utils/rewardCalculator';
import logger from '../logger';

const SummaryContainer = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 28px;
  padding: 50px;
  margin-bottom: 50px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
      radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
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
`;

const SummaryTitle = styled.h3`
  margin: 0 0 25px 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '🏆';
    font-size: 1.2rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  padding: 35px 30px;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.6s ease-out;
  animation-fill-mode: both;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(135deg, 
      #3b82f6 0%, 
      #6366f1 25%, 
      #8b5cf6 50%, 
      #a855f7 75%, 
      #c084fc 100%);
    border-radius: 24px 24px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  &:nth-child(odd) {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.15) 0%, 
      rgba(255, 255, 255, 0.08) 50%, 
      rgba(255, 255, 255, 0.12) 100%);
  }
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
`;

const CardTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: ' pts';
    font-size: 0.9rem;
    opacity: 0.8;
    color: #718096;
    -webkit-text-fill-color: #718096;
    font-weight: 600;
    margin-left: 4px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    border-radius: 1px;
    opacity: 0.6;
  }
`;

const MonthName = styled.span`
  text-transform: capitalize;
`;

const RewardSummary = ({ transactions, selectedYear, selectedMonth, loading }) => {
  if (loading) {
    return (
      <SummaryContainer>
        <SummaryTitle>Reward Points Summary</SummaryTitle>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#718096',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          🔄 Loading reward summary...
        </div>
      </SummaryContainer>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <SummaryContainer>
        <SummaryTitle>Reward Points Summary</SummaryTitle>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#718096',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          📊 No transactions available
        </div>
      </SummaryContainer>
    );
  }

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  const getLastThreeMonths = () => {
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

  const calculateSummary = () => {
    if (selectedMonth !== '') {
      const monthlyRewards = calculateMonthlyRewards(transactions, selectedYear, selectedMonth);
      const totalRewards = calculateTotalRewards(transactions);
      
      return [
        {
          title: `${getMonthName(selectedMonth)} ${selectedYear}`,
          value: monthlyRewards
        },
        {
          title: 'Total (All Time)',
          value: totalRewards
        }
      ];
    } else {
      const lastThreeMonths = getLastThreeMonths();
      const summary = lastThreeMonths.map(({ year, month }) => ({
        title: `${getMonthName(month)} ${year}`,
        value: calculateMonthlyRewards(transactions, year, month)
      }));
      
      const totalRewards = calculateTotalRewards(transactions);
      summary.push({
        title: 'Total (All Time)',
        value: totalRewards
      });
      
      return summary;
    }
  };

  const summaryData = calculateSummary();

  logger.info('Reward summary calculated', { 
    selectedYear, 
    selectedMonth, 
    summaryData 
  });

  return (
    <SummaryContainer>
      <SummaryTitle>Reward Points Summary</SummaryTitle>
      <SummaryGrid>
        {summaryData.map((item, index) => (
          <SummaryCard key={index}>
            <CardTitle>{item.title}</CardTitle>
            <CardValue>{item.value}</CardValue>
          </SummaryCard>
        ))}
      </SummaryGrid>
    </SummaryContainer>
  );
};

RewardSummary.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
  })),
  selectedYear: PropTypes.number.isRequired,
  selectedMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loading: PropTypes.bool
};

RewardSummary.defaultProps = {
  transactions: [],
  loading: false
};

export default RewardSummary;
