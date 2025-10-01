import Image from 'next/image';
import { useState } from 'react';

const products = [
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
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  if (selectedProduct) {
    return (
      <div className="h-full overflow-y-auto p-8 pr-20">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="mb-4 text-gray-600 font-medium text-sm" 
            style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
          >
            ← BACK TO SHOP
          </button>
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mb-4">
              <Image
                src={`/product-photos/${selectedProduct.image}`}
                alt={selectedProduct.name}
                width={350}
                height={350}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-gray-600 font-medium text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
                {selectedProduct.name} - {selectedProduct.price}
              </h1>
              
              <div className="space-y-3 w-48">
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
              </div>
              
              <p className="text-sm text-gray-600 italic leading-relaxed text-center w-48" style={{ fontFamily: 'serif' }}>
                {selectedProduct.description}
              </p>
              
              <button className="bg-black text-white py-2 px-8 font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 pr-20">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="w-full max-w-sm">
                <Image
                  src={`/product-photos/${product.image}`}
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