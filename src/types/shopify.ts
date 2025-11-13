export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        availableForSale: boolean;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            title: string;
          };
        };
      };
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartItem {
  variantId: string;
  quantity: number;
  productTitle: string;
  variantTitle: string;
  price: string;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

// Type for our existing product structure (to maintain compatibility)
export interface LocalProduct {
  id: number;
  image: string;
  name: string;
  price: string;
  description: string;
}