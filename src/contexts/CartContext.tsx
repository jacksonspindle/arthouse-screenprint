'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_CART } from '@/lib/shopify-queries';
import { CartItem, CartCreateResponse } from '@/types/shopify';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  proceedToCheckout: () => Promise<void>;
  totalPrice: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [createCart] = useMutation<CartCreateResponse>(CREATE_CART);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopify-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('shopify-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Add item to cart
  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.variantId === item.variantId);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(cartItem =>
          cartItem.variantId === item.variantId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Create Shopify cart and redirect to checkout
  const proceedToCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      const lines = cartItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }));

      console.log('Creating cart with lines:', lines);

      const { data } = await createCart({
        variables: {
          input: { lines }
        }
      });

      console.log('Cart creation response:', JSON.stringify(data, null, 2));

      if (data?.cartCreate?.userErrors && data.cartCreate.userErrors.length > 0) {
        console.error('Cart creation errors:', data.cartCreate.userErrors);
        throw new Error(data.cartCreate.userErrors[0].message);
      }

      if (data?.cartCreate?.cart) {
        const cart = data.cartCreate.cart;

        if (cart.lines.edges.length === 0) {
          console.error('Cart was created but is empty!');
          alert('Error: Could not add items to cart. Please try again.');
          return;
        }

        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href = cart.checkoutUrl;
        } else {
          window.open(cart.checkoutUrl, '_blank');
        }

        // Clear cart after successful checkout redirect
        clearCart();
      } else {
        throw new Error('Failed to create cart');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error proceeding to checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, createCart, clearCart]);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        proceedToCheckout,
        totalPrice,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
