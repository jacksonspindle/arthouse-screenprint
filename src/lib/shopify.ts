import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  console.log('Shopify API Token:', token ? 'Present' : 'Missing');
  console.log('Shopify Store Domain:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  
  return {
    headers: {
      ...headers,
      'X-Shopify-Storefront-Access-Token': token,
      'Content-Type': 'application/json',
    }
  };
});

export const shopifyClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
  },
});

export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;