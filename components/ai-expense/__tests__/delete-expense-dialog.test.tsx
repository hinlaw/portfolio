import { render, screen, fireEvent } from '@/__tests__/test-utils';

import DeleteExpenseDialog from '../delete-expense-dialog';
import { ExpenseDTO } from '@/types/expense';

const mockExpense: ExpenseDTO = {
  id: 'exp-1',
  merchant: 'Starbucks',
  amount: 45.5,
  date: Math.floor(Date.now() / 1000),
  currency: 'USD',
};

describe('DeleteExpenseDialog', () => {
  const defaultProps = {
    expense: mockExpense,
    open: true,
    onOpenChange: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when expense is null', () => {
    const { container } = render(
      <DeleteExpenseDialog
        {...defaultProps}
        expense={null}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog title and content when open', () => {
    render(<DeleteExpenseDialog {...defaultProps} />);
    expect(screen.getByText(/delete expense/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete this expense/i)).toBeInTheDocument();
  });

  it('displays expense merchant and amount', () => {
    render(<DeleteExpenseDialog {...defaultProps} />);
    expect(screen.getByText('Starbucks')).toBeInTheDocument();
    expect(screen.getByText(/45\.50/)).toBeInTheDocument();
  });

  it('renders Cancel and Delete buttons', () => {
    render(<DeleteExpenseDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', () => {
    render(<DeleteExpenseDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange(false) when Cancel button is clicked', () => {
    render(<DeleteExpenseDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });
});
