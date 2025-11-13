'use client';

import { ApolloProvider } from '@apollo/client/react';
import { shopifyClient } from '@/lib/shopify';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={shopifyClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
}