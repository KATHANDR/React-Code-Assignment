import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerList from '../CustomerList';

const mockCustomers = [
  { customerId: 'CUST001', customerName: 'John Smith' },
  { customerId: 'CUST002', customerName: 'Sarah Johnson' },
  { customerId: 'CUST003', customerName: 'Mike Davis' }
];

describe('CustomerList', () => {
  const mockOnCustomerSelect = jest.fn();

  beforeEach(() => {
    mockOnCustomerSelect.mockClear();
  });

  test('renders customer list with all customers', () => {
    render(
      <CustomerList
        customers={mockCustomers}
        selectedCustomer=""
        onCustomerSelect={mockOnCustomerSelect}
      />
    );

    expect(screen.getByTestId('customer-select')).toBeInTheDocument();
    expect(screen.getByText('Select a customer')).toBeInTheDocument();
    expect(screen.getByText('John Smith (CUST001)')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson (CUST002)')).toBeInTheDocument();
    expect(screen.getByText('Mike Davis (CUST003)')).toBeInTheDocument();
  });

  test('calls onCustomerSelect when customer is selected', () => {
    render(
      <CustomerList
        customers={mockCustomers}
        selectedCustomer=""
        onCustomerSelect={mockOnCustomerSelect}
      />
    );

    const select = screen.getByTestId('customer-select');
    fireEvent.change(select, { target: { value: 'CUST002' } });

    expect(mockOnCustomerSelect).toHaveBeenCalledWith('CUST002');
  });

  test('shows selected customer', () => {
    render(
      <CustomerList
        customers={mockCustomers}
        selectedCustomer="CUST001"
        onCustomerSelect={mockOnCustomerSelect}
      />
    );

    const select = screen.getByTestId('customer-select');
    expect(select.value).toBe('CUST001');
  });

  test('shows loading state', () => {
    render(
      <CustomerList
        customers={[]}
        selectedCustomer=""
        onCustomerSelect={mockOnCustomerSelect}
        loading={true}
      />
    );

    expect(screen.getByText('Loading customers...')).toBeInTheDocument();
    expect(screen.getByTestId('customer-select')).toBeDisabled();
  });

  test('handles empty customers array', () => {
    render(
      <CustomerList
        customers={[]}
        selectedCustomer=""
        onCustomerSelect={mockOnCustomerSelect}
      />
    );

    expect(screen.getByText('Select a customer')).toBeInTheDocument();
    expect(screen.queryByText('John Smith (CUST001)')).not.toBeInTheDocument();
  });
});
