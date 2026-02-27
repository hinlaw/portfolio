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
    <div className="bg-background">
      {/* Header */}
      {product && (
        <div className="border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {product.icon && (
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-xl font-semibold">{product.name}</h1>
                  {product.description && (
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  )}
                </div>
              </div>
              {product.actions && <div>{product.actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="">
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
