import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MONTHS, YEARS } from '../constants';
import logger from '../logger';

const FilterContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: flex-end;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(25px);
  padding: 40px;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
  
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
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
    animation: float 12s ease-in-out infinite;
    pointer-events: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  flex: 1;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  color: #2d3748;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f7fafc;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  height: fit-content;
  align-self: flex-end;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FilterControls = ({ 
  selectedYear, 
  selectedMonth, 
  onYearChange, 
  onMonthChange, 
  onResetFilters,
  loading 
}) => {
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value);
    logger.info(`Year filter changed to: ${year}`);
    onYearChange(year);
  };

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value);
    logger.info(`Month filter changed to: ${month}`);
    onMonthChange(month);
  };

  const handleReset = () => {
    logger.info('Filters reset to default');
    onResetFilters();
  };

  return (
    <FilterContainer>
      <FilterGroup>
        <Label htmlFor="year-select">Year:</Label>
        <Select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          disabled={loading}
          data-testid="year-select"
        >
          {YEARS.map(year => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label htmlFor="month-select">Month:</Label>
        <Select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          disabled={loading}
          data-testid="month-select"
        >
          <option value="">All Months</option>
          {MONTHS.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <Button 
        onClick={handleReset}
        disabled={loading}
        data-testid="reset-filters"
      >
        🔄 Reset to Last 3 Months
      </Button>
    </FilterContainer>
  );
};

FilterControls.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  selectedMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onYearChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

FilterControls.defaultProps = {
  loading: false
};

export default FilterControls;
