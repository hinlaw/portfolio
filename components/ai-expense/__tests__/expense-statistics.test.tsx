import { render, screen, waitFor } from '@/__tests__/test-utils';

import ExpenseStatistics from '../statistics/expense-statistics';
import * as apiMocks from '@/api/client/__mocks__/expenses';

jest.mock('@/api/client/expenses', () => require('@/api/client/__mocks__/expenses'));
jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), pathname: '/apps/ai-expense/statistics' }),
}));

describe('ExpenseStatistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.matchMedia for responsive checks
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('loads statistics from mock API', async () => {
    render(<ExpenseStatistics />);

    await waitFor(() => {
      expect(apiMocks.getExpenseStatistics).toHaveBeenCalled();
    });
  });

  it('displays statistics content when loaded', async () => {
    render(<ExpenseStatistics />);

    await waitFor(() => {
      expect(apiMocks.getExpenseStatistics).toHaveBeenCalled();
    });

    // Should show filter UI (date range, etc.) - use getAllByText as desktop + mobile both render
    expect(screen.getAllByText('date range').length).toBeGreaterThan(0);
  });

  it('calls getExpenseStatistics with date range params', async () => {
    render(<ExpenseStatistics />);

    await waitFor(() => {
      expect(apiMocks.getExpenseStatistics).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        expect.stringMatching(/day|month|quarter/)
      );
    });
  });
});
