'use client';

import Image from 'next/image';
import { useCartContext } from '@/contexts/CartContext';

interface CartSectionProps {
  onContinueShopping: () => void;
}

export default function CartSection({ onContinueShopping }: CartSectionProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    proceedToCheckout,
    totalPrice,
    itemCount,
    isLoading
  } = useCartContext();

  if (cartItems.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-8 pr-20">
        <div className="max-w-md mx-auto">
          <h1
            className="text-gray-600 font-medium text-lg mb-8 text-center"
            style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
          >
            YOUR BAG
          </h1>

          <div className="flex flex-col items-center justify-center space-y-6 py-16">
            <p
              className="text-gray-500 text-sm italic text-center"
              style={{ fontFamily: 'serif' }}
            >
              Your bag is empty.
            </p>
            <button
              onClick={onContinueShopping}
              className="bg-black text-white py-2 px-8 font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 pr-20">
      <div className="max-w-md mx-auto">
        <h1
          className="text-gray-600 font-medium text-lg mb-8 text-center"
          style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
        >
          YOUR BAG ({itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'})
        </h1>

        {/* Cart Items */}
        <div className="space-y-6 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.variantId}
              className="flex space-x-4 pb-6 border-b border-gray-200"
            >
              {/* Product Image */}
              {item.image && (
                <div className="w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productTitle}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="text-gray-700 font-medium text-sm"
                    style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                  >
                    {item.productTitle.toUpperCase()}
                  </h3>
                  <p
                    className="text-gray-500 text-xs mt-1"
                    style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                  >
                    {item.variantTitle}
                  </p>
                  <p
                    className="text-gray-600 text-sm mt-1"
                    style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                  >
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                    >
                      -
                    </button>
                    <span
                      className="text-gray-600 text-sm w-8 text-center"
                      style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-gray-400 hover:text-gray-600 text-xs underline transition-colors"
                    style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border-t border-gray-300 pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span
              className="text-gray-600 font-medium text-sm"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              SUBTOTAL
            </span>
            <span
              className="text-gray-700 font-medium text-sm"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <p
            className="text-gray-400 text-xs italic text-center"
            style={{ fontFamily: 'serif' }}
          >
            Shipping and taxes calculated at checkout.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={proceedToCheckout}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              {isLoading ? 'PROCESSING...' : 'CHECKOUT'}
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full border border-gray-400 text-gray-600 py-3 font-medium text-sm tracking-wide hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
