import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterControls from '../FilterControls';

describe('FilterControls', () => {
  const mockOnYearChange = jest.fn();
  const mockOnMonthChange = jest.fn();
  const mockOnResetFilters = jest.fn();

  beforeEach(() => {
    mockOnYearChange.mockClear();
    mockOnMonthChange.mockClear();
    mockOnResetFilters.mockClear();
  });

  test('renders year and month selectors', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    expect(screen.getByTestId('year-select')).toBeInTheDocument();
    expect(screen.getByTestId('month-select')).toBeInTheDocument();
    expect(screen.getByTestId('reset-filters')).toBeInTheDocument();
  });

  test('calls onYearChange when year is selected', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    const yearSelect = screen.getByTestId('year-select');
    fireEvent.change(yearSelect, { target: { value: '2024' } });

    expect(mockOnYearChange).toHaveBeenCalledWith(2024);
  });

  test('calls onMonthChange when month is selected', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    const monthSelect = screen.getByTestId('month-select');
    fireEvent.change(monthSelect, { target: { value: '0' } });

    expect(mockOnMonthChange).toHaveBeenCalledWith(0);
  });

  test('calls onResetFilters when reset button is clicked', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth="0"
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    const resetButton = screen.getByTestId('reset-filters');
    fireEvent.click(resetButton);

    expect(mockOnResetFilters).toHaveBeenCalled();
  });

  test('shows correct selected values', () => {
    render(
      <FilterControls
        selectedYear={2024}
        selectedMonth="5"
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    expect(screen.getByTestId('year-select').value).toBe('2024');
    expect(screen.getByTestId('month-select').value).toBe('5');
  });

  test('disables controls when loading', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
        loading={true}
      />
    );

    expect(screen.getByTestId('year-select')).toBeDisabled();
    expect(screen.getByTestId('month-select')).toBeDisabled();
    expect(screen.getByTestId('reset-filters')).toBeDisabled();
  });

  test('shows all year options', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  test('shows all month options', () => {
    render(
      <FilterControls
        selectedYear={2025}
        selectedMonth=""
        onYearChange={mockOnYearChange}
        onMonthChange={mockOnMonthChange}
        onResetFilters={mockOnResetFilters}
      />
    );

    expect(screen.getByText('All Months')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('March')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();
  });
});
