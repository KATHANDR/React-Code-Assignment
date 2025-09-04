import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import logger from '../logger';

const CustomerListContainer = styled.div`
  margin-bottom: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 20px 28px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.15) 100%);
  backdrop-filter: blur(15px);
  color: #1f2937;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236363f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 24px center;
  background-size: 22px;
  padding-right: 60px;
  position: relative;
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 
      0 0 0 4px rgba(99, 102, 241, 0.15),
      0 12px 35px rgba(99, 102, 241, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    transform: translateY(-3px);
  }
  
  &:hover:not(:disabled) {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 
      0 12px 35px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Option = styled.option`
  padding: 12px 16px;
  font-size: 1rem;
  color: #2d3748;
  background: white;
  
  &:checked {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

const CustomerList = ({ customers, selectedCustomer, onCustomerSelect, loading }) => {
  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    logger.info(`Customer selected: ${customerId}`);
    onCustomerSelect(customerId);
  };

  if (loading) {
    return (
      <CustomerListContainer>
        <Select disabled>
          <Option>🔄 Loading customers...</Option>
        </Select>
      </CustomerListContainer>
    );
  }

  return (
    <CustomerListContainer>
      <Select 
        value={selectedCustomer || ''} 
        onChange={handleCustomerChange}
        data-testid="customer-select"
      >
        <Option value="">👤 Select a customer</Option>
        {customers.map(customer => (
          <Option key={customer.customerId} value={customer.customerId}>
            {customer.customerName} ({customer.customerId})
          </Option>
        ))}
      </Select>
    </CustomerListContainer>
  );
};

CustomerList.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired
  })).isRequired,
  selectedCustomer: PropTypes.string,
  onCustomerSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

CustomerList.defaultProps = {
  selectedCustomer: null,
  loading: false
};

export default CustomerList;
