import '@testing-library/jest-dom';

jest.mock('next-intl');

jest.mock('@/components/ai-expense/workspace-provider', () => ({
  useWorkspace: () => ({
    workspaces: [{ id: 'ws-mock-1', name: 'Personal', base_currency: 'USD' }],
    activeWorkspaceId: 'ws-mock-1',
    activeWorkspace: { id: 'ws-mock-1', name: 'Personal', base_currency: 'USD' },
    baseCurrency: 'USD',
    isLoading: false,
    setActiveWorkspaceId: jest.fn(),
    refreshWorkspaces: jest.fn(),
  }),
}));

// Recharts/ResponsiveContainer needs ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Responsive components (md: breakpoint = 768px)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('min-width') ? true : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
