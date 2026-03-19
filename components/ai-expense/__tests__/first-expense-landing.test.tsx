import { render, screen, fireEvent } from '@/__tests__/test-utils';

import FirstExpenseLanding from '../first-expense-landing';

describe('FirstExpenseLanding', () => {
  const defaultProps = {
    onManualCreate: jest.fn(),
    onAiCreate: jest.fn(),
    onDrop: jest.fn(),
    onDragOver: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and description', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    expect(screen.getByText(/create your first expense/i)).toBeInTheDocument();
    expect(screen.getByText('firstExpenseHint')).toBeInTheDocument();
  });

  it('renders AI Create and Manual Create buttons', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    expect(screen.getByRole('button', { name: /ai create/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manual create/i })).toBeInTheDocument();
  });

  it('calls onAiCreate when AI Create button is clicked', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /ai create/i }));
    expect(defaultProps.onAiCreate).toHaveBeenCalledTimes(1);
  });

  it('calls onManualCreate when Manual Create button is clicked', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /manual create/i }));
    expect(defaultProps.onManualCreate).toHaveBeenCalledTimes(1);
  });

  it('calls onDragOver when drag over the drop zone', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    const dropZone = screen.getByText(/drag & drop receipts or click here to upload/i);
    fireEvent.dragOver(dropZone);
    expect(defaultProps.onDragOver).toHaveBeenCalled();
  });

  it('calls onDrop when files are dropped', () => {
    render(<FirstExpenseLanding {...defaultProps} />);
    const dropZone = screen.getByText(/drag & drop receipts or click here to upload/i).closest('div');
    if (dropZone) {
      fireEvent.drop(dropZone, {
        dataTransfer: { files: [] },
      });
      expect(defaultProps.onDrop).toHaveBeenCalled();
    }
  });
});
