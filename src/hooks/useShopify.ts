import { useQuery, useMutation } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import { GET_PRODUCTS, CREATE_CART, ADD_TO_CART } from '@/lib/shopify-queries';
import { ShopifyProduct, ShopifyProductsResponse, LocalProduct, CartItem, CartCreateResponse } from '@/types/shopify';

// Hook to fetch products from Shopify
export function useProducts() {
  const { data, loading, error } = useQuery<ShopifyProductsResponse>(GET_PRODUCTS, {
    variables: { first: 20 },
    errorPolicy: 'all'
  });

  // Transform Shopify products to match our existing UI structure
  const transformProductsToLocal = (shopifyProducts: ShopifyProduct[]): LocalProduct[] => {
    return shopifyProducts.map((product, index) => {
      const firstImage = product.images.edges[0]?.node.url || '';
      const price = `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}`;
      
      return {
        id: index + 1, // Keep sequential IDs for UI compatibility
        image: firstImage, // Use full Shopify CDN URL
        name: product.title.toUpperCase(),
        price: price,
        description: product.description || 'High-quality screenprinted apparel.'
      };
    });
  };

  const localProducts = data?.products.edges.map(edge => edge.node) || [];
  const transformedProducts = transformProductsToLocal(localProducts);

  return {
    products: transformedProducts,
    shopifyProducts: localProducts, // Keep original data for checkout
    loading,
    error
  };
}

// Hook to manage cart state
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  const [createCart] = useMutation<CartCreateResponse>(CREATE_CART);
  const [addToCartMutation] = useMutation(ADD_TO_CART);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopify-cart');
    const savedCartId = localStorage.getItem('shopify-cart-id');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopify-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.variantId === item.variantId);
    
    if (existingItem) {
      // Update quantity if item already exists
      setCartItems(cartItems.map(cartItem =>
        cartItem.variantId === item.variantId
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      ));
    } else {
      // Add new item
      setCartItems([...cartItems, item]);
    }
  };

  // Remove item from cart
  const removeFromCart = (variantId: string) => {
    setCartItems(cartItems.filter(item => item.variantId !== variantId));
  };

  // Create Shopify cart and redirect to checkout
  const proceedToCheckout = async (itemsToCheckout?: CartItem[]) => {
    try {
      const itemsForCheckout = itemsToCheckout || cartItems;
      console.log('Cart items before checkout:', itemsForCheckout);
      
      const lines = itemsForCheckout.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));

      console.log('Cart lines being sent to Shopify:', JSON.stringify(lines, null, 2));

      console.log('Creating cart with lines:', lines);

      const { data } = await createCart({
        variables: {
          input: { lines }
        }
      });

      console.log('Cart creation response:', JSON.stringify(data, null, 2));

      if (data?.cartCreate?.userErrors && data.cartCreate.userErrors.length > 0) {
        console.error('Cart creation errors:', data.cartCreate.userErrors);
        data.cartCreate.userErrors.forEach(error => {
          console.error(`Error: ${error.message} (field: ${error.field})`);
        });
        throw new Error(data.cartCreate.userErrors[0].message);
      }

      if (data?.cartCreate?.cart) {
        const cart = data.cartCreate.cart;
        console.log('Created cart:', cart);
        
        // Check if the cart actually has items
        console.log('Cart lines count:', cart.lines.edges.length);
        if (cart.lines.edges.length === 0) {
          console.error('Cart was created but is empty! This means the variant ID might be invalid.');
          alert('Error: The selected product variant could not be added to cart. Please try again.');
          return;
        }
        
        // Log the cart contents
        cart.lines.edges.forEach(({ node }, index) => {
          console.log(`Cart item ${index + 1}:`, {
            id: node.id,
            quantity: node.quantity,
            merchandiseId: node.merchandise.id,
            productTitle: node.merchandise.product?.title,
            variantTitle: node.merchandise.title,
            price: node.merchandise.price
          });
        });
        
        setCartId(cart.id);
        localStorage.setItem('shopify-cart-id', cart.id);
        
        // Debug the checkout URL
        console.log('checkoutUrl from Shopify:', cart.checkoutUrl);
        
        // Instead of redirecting immediately, let's open in a new tab to test
        console.log('Opening checkout in new tab for testing...');
        window.open(cart.checkoutUrl, '_blank');
        
        // Also log what we would normally redirect to
        console.log('Would redirect to:', cart.checkoutUrl);
      } else if (data?.cartCreate?.userErrors && data.cartCreate.userErrors.length > 0) {
        console.error('Cart creation errors:', data.cartCreate.userErrors);
        throw new Error(data.cartCreate.userErrors[0].message);
      } else {
        console.error('No cart created, full response:', data);
        throw new Error('Failed to create cart');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    proceedToCheckout,
    totalPrice,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
  };
}