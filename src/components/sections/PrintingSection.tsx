import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function PrintingSection() {
  const [images, setImages] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
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
    const imageList = Array.from({ length: 19 }, (_, i) => `/printing-page-images/${i + 1}.png`);
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
              <div key={index} className="w-80 h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`Printing work ${index + 1}`}
                  width={320}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Form Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-8 pr-20 py-8">
        <h2 className="text-2xl font-bold text-gray-600 mb-6 uppercase tracking-wide text-center" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>Submit for a Quote</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>EMAIL:</label>
            <input 
              type="email" 
              className="w-full h-8 border border-gray-400 bg-white px-2 text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>DO YOU HAVE ARTWORK ALREADY?</label>
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
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>SELECT TYPE OF GARMENT YOU WANT PRINTED:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>SELECT GARMENT COLOR:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>SELECT QUANTITY:</label>
            <div className="relative">
              <select className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black">
                <option></option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
              SIZE BREAKDOWN: <span className="text-xs text-gray-500">(STANDARD SIZE BREAKDOWN HERE)</span>
            </label>
            <textarea 
              className="w-full h-16 border border-gray-400 bg-white px-2 py-1 resize-none text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>
              HOW MANY COLORS IS YOUR DESIGN? <span className="text-xs text-gray-500">MAXIMUM 4</span>
            </label>
            <input 
              type="text" 
              className="w-full h-8 border border-gray-400 bg-white px-2 text-black"
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}