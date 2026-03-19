'use client';

import { ReactNode } from 'react';

type ProductInfo = {
  name: string;
  icon: string;
  description?: string;
  accent?: string;
  actions?: ReactNode;
};

interface ProductLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  product?: ProductInfo;
}

export default function ProductLayout({
  children,
  title,
  description,
  product,
}: ProductLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      {product && (
        <div className="shrink-0 border-b">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.icon && (
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  {product.description && (
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                  )}
                </div>
              </div>
              {product.actions && <div>{product.actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {title && !product && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
