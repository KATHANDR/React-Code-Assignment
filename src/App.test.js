import { render, screen } from '@testing-library/react';
import App from './App';

test('renders customer rewards program', () => {
  render(<App />);
  const titleElement = screen.getByText(/Customer Rewards Program/i);
  expect(titleElement).toBeInTheDocument();
});
