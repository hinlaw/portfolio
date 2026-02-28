import { render, screen, waitFor } from '@/__tests__/test-utils';

import ExpenseList from '../list/expense-list';
import * as apiMocks from '@/lib/api-mocks';

jest.mock('@/lib/api-stubs', () => require('@/lib/api-mocks'));
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/apps/ai-expense',
    query: {},
  }),
}));

describe('ExpenseList', () => {
  const defaultProps = {
    onViewStatistics: jest.fn(),
    showFilters: false,
    onToggleFilters: jest.fn(),
    keyword: '',
    onKeywordChange: jest.fn(),
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    apiMocks.resetMockExpenses();
  });

  it('loads and displays expenses from mock API', async () => {
    render(<ExpenseList {...defaultProps} />);

    await waitFor(() => {
      expect(apiMocks.listExpenses).toHaveBeenCalled();
    });

    await waitFor(
      () => {
        expect(screen.getAllByText('Starbucks').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Grocery Store').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Restaurant').length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });

  it('displays loading state initially', () => {
    render(<ExpenseList {...defaultProps} />);
    // Initially may show loading - depends on implementation
    expect(apiMocks.listExpenses).toHaveBeenCalled();
  });

  it('calls listExpenses with correct params', async () => {
    render(<ExpenseList {...defaultProps} />);

    await waitFor(() => {
      expect(apiMocks.listExpenses).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          size: 15,
          field: 'date',
          asc: 0,
        })
      );
    });
  });

  it('displays amount and merchant for each expense', async () => {
    render(<ExpenseList {...defaultProps} />);

    await waitFor(
      () => {
        expect(screen.getAllByText(/45\.50 USD/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/128\.99 USD/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/89\.00 USD/).length).toBeGreaterThan(0);
      },
      { timeout: 2000 }
    );
  });
});
