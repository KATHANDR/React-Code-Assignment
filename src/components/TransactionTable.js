import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { calculateRewardPoints } from '../utils/rewardCalculator';
import { PAGINATION } from '../constants';
import logger from '../logger';

const TableContainer = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
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
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    animation: float 12s ease-in-out infinite;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, 
    #3b82f6 0%, 
    #6366f1 25%, 
    #8b5cf6 50%, 
    #a855f7 75%, 
    #c084fc 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.15) 0%, 
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 20%, 
      rgba(255, 255, 255, 0.5) 50%, 
      rgba(255, 255, 255, 0.3) 80%, 
      transparent 100%);
  }
`;

const TableHeaderCell = styled.th`
  padding: 24px 20px;
  text-align: center;
  font-weight: 700;
  color: white;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    width: 1px;
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  }
  
  &:first-child {
    border-top-left-radius: 20px;
  }
  
  &:last-child {
    border-top-right-radius: 20px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.4s ease-out;
  animation-fill-mode: both;
  
  &:nth-child(even) {
    background-color: rgba(102, 126, 234, 0.02);
  }
  
  &:hover {
    background-color: rgba(27, 166, 46, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }
  &:nth-child(4) { animation-delay: 0.2s; }
  &:nth-child(5) { animation-delay: 0.25s; }
  &:nth-child(6) { animation-delay: 0.3s; }
  &:nth-child(7) { animation-delay: 0.35s; }
  &:nth-child(8) { animation-delay: 0.4s; }
  &:nth-child(9) { animation-delay: 0.45s; }
  &:nth-child(10) { animation-delay: 0.5s; }
`;

const TableCell = styled.td`
  padding: 16px;
  color: #2d3748;
  font-size: 0.95rem;
  vertical-align: middle;
    text-align: center;
`;

const AmountCell = styled(TableCell)`
  text-align: center;
  font-weight: 700;
  color: #38a169;
  font-size: 1rem;
`;

const PointsCell = styled(TableCell)`
  text-align: center;
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
  
  &::after {
    content: ' pts';
    opacity: 0.7;
    font-size: 0.8rem;
    margin-left: 2px;
  }
`;

const DateCell = styled(TableCell)`
  color:rgb(106, 39, 72);
  font-weight: 500;
`;

const NoDataMessage = styled.div`
  padding: 60px 40px;
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const PaginationInfo = styled.div`
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 12px 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #4a5568;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(59, 130, 246, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const PageNumber = styled.span`
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  box-shadow: 
    0 8px 25px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const TransactionTable = ({ transactions, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return { data: [], totalPages: 0 };
    
    const startIndex = (currentPage - 1) * PAGINATION.ITEMS_PER_PAGE;
    const endIndex = startIndex + PAGINATION.ITEMS_PER_PAGE;
    const data = transactions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(transactions.length / PAGINATION.ITEMS_PER_PAGE);
    
    return { data, totalPages };
  }, [transactions, currentPage]);

  const handlePageChange = (page) => {
    logger.info(`Page changed to: ${page}`);
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <TableContainer>
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center', 
          color: '#718096',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          🔄 Loading transactions...
        </div>
      </TableContainer>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <TableContainer>
        <NoDataMessage>📊 No transactions found for the selected period</NoDataMessage>
      </TableContainer>
    );
  }

  const { data: paginatedTransactions, totalPages } = paginatedData;

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell>Transaction ID</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Reward Points</TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.map(transaction => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.transactionId}</TableCell>
              <DateCell>{formatDate(transaction.date)}</DateCell>
              <AmountCell>{formatCurrency(transaction.amount)}</AmountCell>
              <PointsCell>{calculateRewardPoints(transaction.amount)}</PointsCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationInfo>
            Showing {((currentPage - 1) * PAGINATION.ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * PAGINATION.ITEMS_PER_PAGE, transactions.length)} of{' '}
            {transactions.length} transactions
          </PaginationInfo>
          
          <PaginationControls>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            
            <PageNumber>{currentPage}</PageNumber>
            
            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      )}
    </TableContainer>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
  })),
  loading: PropTypes.bool
};

TransactionTable.defaultProps = {
  transactions: [],
  loading: false
};

export default TransactionTable;
