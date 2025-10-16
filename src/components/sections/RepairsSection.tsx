import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function RepairsSection() {
  const [images, setImages] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseOverRef = useRef<boolean>(false);

  // Shuffle array function
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize randomized images when component mounts
  useEffect(() => {
    const imageList = [
      '/repair-photos/1a.png',
      '/repair-photos/2a.png', 
      '/repair-photos/3A.png',
      '/repair-photos/4A.png',
      '/repair-photos/5A.png'
    ];
    const shuffledImages = shuffleArray(imageList);
    // Triple the array for seamless infinite scroll
    setImages([...shuffledImages, ...shuffledImages, ...shuffledImages]);
  }, []);

  // Smooth auto-scroll animation
  useEffect(() => {
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!isUserScrolling && images.length > 0) {
        if (currentTime - lastTime >= 16) { // ~60fps
          setScrollPosition(prev => {
            const newPosition = prev + 1; // Consistent speed
            const imageWidth = 320; // Match actual image width
            const totalWidth = (images.length / 3) * imageWidth; // Original set width
            
            // Reset to beginning of second set when we reach the third set
            if (newPosition >= totalWidth * 2) {
              return totalWidth;
            }
            return newPosition;
          });
          lastTime = currentTime;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isUserScrolling, images.length]);

  // Handle touch/trackpad scrolling
  const handleScroll = (e: React.WheelEvent) => {
    // Always prevent default and stop propagation to completely block page scrolling
    e.preventDefault();
    e.stopPropagation();
    
    setIsUserScrolling(true);
    
    // Use both deltaX and deltaY for horizontal scrolling
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setScrollPosition(prev => {
      const newPosition = prev + delta * 1.5; // Adjust sensitivity
      const imageWidth = 320; // Match actual image width
      const totalWidth = (images.length / 3) * imageWidth;
      
      if (newPosition < 0) {
        return totalWidth * 2 + newPosition;
      } else if (newPosition >= totalWidth * 3) {
        return newPosition - totalWidth;
      }
      return newPosition;
    });

    // Clear previous timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Resume auto-scroll after 300ms of scroll inactivity
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 300);
  };

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    mouseOverRef.current = true;
  };

  const handleMouseLeave = () => {
    mouseOverRef.current = false;
    // Immediately resume auto-scroll when mouse leaves
    setIsUserScrolling(false);
    // Clear any pending timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Image Carousel - Fixed height, no scroll */}
      <div 
        ref={containerRef}
        className="relative h-48 overflow-hidden cursor-grab active:cursor-grabbing flex-shrink-0"
        onWheel={handleScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {images.length > 0 && (
          <div 
            className="flex h-full"
            style={{ 
              transform: `translateX(-${scrollPosition}px)`,
              transition: isUserScrolling ? 'none' : 'transform 0.1s linear'
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`Repair work ${index + 1}`}
                  width={320}
                  height={200}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Form Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-8 pr-20 py-8">
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-center transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>Submit for a Repair Quote</h2>
        
        {isFormSubmitted ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-bold text-gray-400 mb-0 italic" style={{ fontFamily: 'serif' }}>Thanks!</h3>
            <p className="text-lg font-bold text-gray-400 italic" style={{ fontFamily: 'serif' }}>You&apos;ll hear from us soon.</p>
          </div>
        ) : (
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>EMAIL/PHONE NUMBER:</label>
            <input 
              type="email" 
              className="w-full h-8 border border-gray-400 bg-white px-2 text-black"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>
              SELECT TYPE OF GARMENT <span className="text-[10px] text-gray-500">(SELECT ALL THAT APPLY)</span>
            </label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
                <option>T-Shirts</option>
                <option>Hoodies/Sweatshirts</option>
                <option>Tank Tops</option>
                <option>Long Sleeves</option>
                <option>Polo Shirts</option>
                <option>Jackets</option>
                <option>Hats/Caps</option>
                <option>Bags</option>
                <option>Other</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <button 
              type="button"
              className="px-4 py-1 border-1 border-dashed border-gray-400 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              UPLOAD PHOTOS
            </button>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>SELECT QUANTITY:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
                <option>1-10</option>
                <option>11-25</option>
                <option>26-50</option>
                <option>51-100</option>
                <option>100+</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>SELECT TYPE OF REPAIR:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
                <option>Screen Repair</option>
                <option>Garment Restoration</option>
                <option>Equipment Maintenance</option>
                <option>Print Touch-up</option>
                <option>Fabric Repair</option>
                <option>Other</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>WILL YOU BE PROVIDING A REFERENCE GARMENT?</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center my-4">
            <button 
              type="button"
              className="px-4 py-1 border-1 border-dashed border-gray-400 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              UPLOAD PHOTOS
            </button>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>TURNAROUND TIME:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
                <option>Standard (1-2 weeks)</option>
                <option>Rush (3-5 days)</option>
                <option>Emergency (24-48 hours)</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>DESCRIBE WHAT YOU&apos;RE LOOKING FOR:</label>
            <textarea 
              className="w-full h-24 border border-gray-400 bg-white px-2 py-1 resize-none text-black"
            />
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              type="submit"
              className="px-4 py-1 border-1 border-dashed border-gray-400 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              SUBMIT
            </button>
          </div>
        </form>
        )}
        </div>
      </div>
    </div>
  );
}