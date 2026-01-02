import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useProducts } from '@/hooks/useShopify';
import { useCartContext } from '@/contexts/CartContext';
import { LocalProduct, ShopifyProduct } from '@/types/shopify';

// Fallback products in case Shopify is unavailable
const fallbackProducts: LocalProduct[] = [
  { 
    id: 1, 
    image: 'IMG_4158.PNG', 
    name: 'CRAIG SHIRT', 
    price: '$15',
    description: 'Front and back print so you know it\'s a good value. We ran diagnostics and this shirt is guaranteed to worsen depression by 400%.'
  },
  { 
    id: 2, 
    image: 'IMG_4159.PNG', 
    name: 'DESIGN TEE', 
    price: '$20',
    description: 'A classic design that speaks to your creative soul. Made with premium materials for lasting comfort.'
  },
  { 
    id: 3, 
    image: 'IMG_4160.PNG', 
    name: 'VINTAGE PRINT', 
    price: '$25',
    description: 'Vintage-inspired design with modern comfort. Perfect for those who appreciate timeless style.'
  },
  { 
    id: 4, 
    image: 'IMG_4161.PNG', 
    name: 'CLASSIC DESIGN', 
    price: '$18',
    description: 'Clean, minimalist design that goes with everything. A wardrobe essential for any occasion.'
  },
  { 
    id: 5, 
    image: 'IMG_4162.PNG', 
    name: 'STATEMENT PIECE', 
    price: '$22',
    description: 'Bold design that makes a statement. For those who aren\'t afraid to stand out from the crowd.'
  },
  { 
    id: 6, 
    image: 'IMG_4163.PNG.png', 
    name: 'LIMITED EDITION', 
    price: '$30',
    description: 'Exclusive limited edition design. Once they\'re gone, they\'re gone forever.'
  },
  { 
    id: 7, 
    image: 'IMG_4164.PNG', 
    name: 'MODERN CUT', 
    price: '$28',
    description: 'Contemporary fit with modern styling. Designed for the fashion-forward individual.'
  },
];

export default function ShopSection() {
  const { products, shopifyProducts, loading, error } = useProducts();
  const { addToCart } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const productDetailRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when product is selected
  useEffect(() => {
    if (selectedProduct && productDetailRef.current) {
      productDetailRef.current.scrollTop = 0;
    }
  }, [selectedProduct]);

  // Use fallback products if Shopify is unavailable or loading
  const displayProducts = error || products.length === 0 ? fallbackProducts : products;

  // Show loading state briefly if we're fetching from Shopify
  if (loading && products.length === 0) {
    return (
      <div
        className="h-full overflow-y-auto p-8 pr-20"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)'
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400 font-medium" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
              Loading products...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle product selection
  const handleProductSelect = (product: LocalProduct) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
    setSelectedOptions({});
    setCurrentImageIndex(0);
    setAddedToCart(false);
  };

  // Get the corresponding Shopify product for variants
  const getShopifyProduct = (localProduct: LocalProduct): ShopifyProduct | null => {
    if (!shopifyProducts.length) return null;
    // Find by matching name/title (accounting for uppercase transformation)
    return shopifyProducts.find(p => 
      p.title.toUpperCase() === localProduct.name
    ) || null;
  };

  // Handle option selection (color, size, etc.)
  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Find matching variant based on selected options
    const shopifyProduct = selectedProduct ? getShopifyProduct(selectedProduct) : null;
    if (shopifyProduct) {
      console.log('Available variants for product:', shopifyProduct.title);
      shopifyProduct.variants.edges.forEach(({ node }, index) => {
        console.log(`Variant ${index + 1}:`, {
          id: node.id,
          title: node.title,
          price: node.price,
          availableForSale: node.availableForSale,
          selectedOptions: node.selectedOptions
        });
      });
      
      console.log('Current selected options:', newOptions);
      console.log('Looking for variant matching these options...');
      
      const matchingVariant = shopifyProduct.variants.edges.find(({ node }) => {
        const matches = node.selectedOptions.every(option => 
          newOptions[option.name] === option.value
        );
        console.log(`Checking variant ${node.id}: ${matches ? 'MATCHES' : 'no match'}`);
        return matches;
      });
      
      if (matchingVariant) {
        console.log('Selected variant:', matchingVariant.node.id);
        setSelectedVariant(matchingVariant.node.id);
      } else {
        console.log('No matching variant found for options:', newOptions);
        setSelectedVariant(null);
      }
    }
  };

  // Handle add to cart - adds item to cart without redirecting to checkout
  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) {
      alert('Please select all required options before adding to cart.');
      return;
    }

    const shopifyProduct = getShopifyProduct(selectedProduct);
    if (!shopifyProduct) {
      // Fallback for hardcoded products - just show alert
      alert('This product is not available for purchase at the moment.');
      return;
    }

    const variant = shopifyProduct.variants.edges.find(({ node }) =>
      node.id === selectedVariant
    );

    if (!variant) {
      alert('Selected variant is not available.');
      return;
    }

    const cartItem = {
      variantId: selectedVariant,
      quantity: 1,
      productTitle: shopifyProduct.title,
      variantTitle: variant.node.title,
      price: variant.node.price.amount,
      image: shopifyProduct.images.edges[0]?.node.url
    };

    addToCart(cartItem);
    setAddedToCart(true);

    // Reset the "added" feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (selectedProduct) {
    return (
      <div
        ref={productDetailRef}
        className="h-full overflow-y-auto p-8 pr-20 pt-12 pb-12"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)'
        }}
      >
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="mb-4 text-gray-600 font-medium text-sm" 
            style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
          >
            ← BACK TO SHOP
          </button>
          
          <div className="flex flex-col items-center">
            {(() => {
              const shopifyProduct = getShopifyProduct(selectedProduct);
              const images = shopifyProduct?.images.edges || [];
              
              // Use Shopify images if available, otherwise fallback to local image
              const allImages = images.length > 0 
                ? images.map(({ node }) => node.url)
                : [selectedProduct.image.startsWith('http') ? selectedProduct.image : `/product-photos/${selectedProduct.image}`];
              
              const currentImage = allImages[currentImageIndex];
              
              return (
                <div className="w-full max-w-sm mb-4">
                  {/* Main Image */}
                  <div className="mb-3">
                    <Image
                      src={currentImage}
                      alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                      width={350}
                      height={350}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <div className="flex flex-col space-y-2">
                      {/* Thumbnail Gallery */}
                      <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
                        {allImages.map((imageUrl, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                              currentImageIndex === index 
                                ? 'border-gray-600' 
                                : 'border-gray-300 hover:border-gray-500'
                            }`}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      
                      {/* Navigation Arrows */}
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          disabled={currentImageIndex === 0}
                          className="px-3 py-1 text-xs border border-gray-400 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                        >
                          ← PREV
                        </button>
                        <span className="px-2 py-1 text-xs text-gray-500" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
                          {currentImageIndex + 1} / {allImages.length}
                        </span>
                        <button
                          onClick={() => setCurrentImageIndex(Math.min(allImages.length - 1, currentImageIndex + 1))}
                          disabled={currentImageIndex === allImages.length - 1}
                          className="px-3 py-1 text-xs border border-gray-400 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
                        >
                          NEXT →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-gray-600 font-medium text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
                {selectedProduct.name} - {selectedProduct.price}
              </h1>
              
              <div className="space-y-3 w-48">
                {(() => {
                  const shopifyProduct = getShopifyProduct(selectedProduct);
                  if (!shopifyProduct) {
                    // Fallback for hardcoded products
                    return (
                      <>
                        <div className="relative">
                          <select className="w-full h-8 border border-gray-400 bg-white px-2 appearance-none text-gray-500 italic text-sm text-center">
                            <option>SELECT COLOR</option>
                            <option>White</option>
                            <option>Black</option>
                            <option>Gray</option>
                          </select>
                          <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="relative">
                          <select className="w-full h-8 border border-gray-400 bg-white px-2 appearance-none text-gray-500 italic text-sm text-center">
                            <option>SELECT SIZE</option>
                            <option>XS</option>
                            <option>S</option>
                            <option>M</option>
                            <option>L</option>
                            <option>XL</option>
                          </select>
                          <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </>
                    );
                  }

                  // Get all unique option names (Color, Size, etc.)
                  const optionNames = new Set<string>();
                  shopifyProduct.variants.edges.forEach(({ node }) => {
                    node.selectedOptions.forEach(option => {
                      optionNames.add(option.name);
                    });
                  });

                  // Get available values for each option
                  const getOptionsForName = (optionName: string) => {
                    const values = new Set<string>();
                    shopifyProduct.variants.edges.forEach(({ node }) => {
                      const option = node.selectedOptions.find(opt => opt.name === optionName);
                      if (option && node.availableForSale) {
                        values.add(option.value);
                      }
                    });
                    return Array.from(values);
                  };

                  return Array.from(optionNames).map(optionName => (
                    <div key={optionName} className="relative">
                      <select 
                        className="w-full h-8 border border-gray-400 bg-white px-2 appearance-none text-gray-500 italic text-sm text-center"
                        value={selectedOptions[optionName] || ''}
                        onChange={(e) => handleOptionChange(optionName, e.target.value)}
                      >
                        <option value="">SELECT {optionName.toUpperCase()}</option>
                        {getOptionsForName(optionName).map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ));
                })()}
              </div>
              
              <p className="text-sm text-gray-600 italic leading-relaxed text-center w-48" style={{ fontFamily: 'serif' }}>
                {selectedProduct.description}
              </p>
              
              <button
                onClick={handleAddToCart}
                className={`py-2 px-8 font-medium text-sm tracking-wide transition-colors ${
                  addedToCart ? 'bg-green-600 text-white' : ''
                }`}
                style={{
                  fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif',
                  backgroundColor: addedToCart ? undefined : 'var(--foreground)',
                  color: addedToCart ? undefined : 'var(--background)'
                }}
              >
                {addedToCart ? 'ADDED TO BAG!' : 'ADD TO BAG'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto p-8 pr-20 pt-12 pb-12"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {displayProducts.map((product, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleProductSelect(product)}
            >
              <div className="w-full max-w-sm">
                <Image
                  src={product.image.startsWith('http') ? product.image : `/product-photos/${product.image}`}
                  alt={product.name}
                  width={350}
                  height={350}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-gray-600 font-medium text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
                  {product.name} - {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}