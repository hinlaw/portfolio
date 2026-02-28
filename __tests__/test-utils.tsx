import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// next-intl is mocked in __mocks__/next-intl.ts
// Components using useTranslations will get key-as-value from the mock
const AllTheProviders = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
