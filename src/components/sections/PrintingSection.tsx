import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import FileUpload from '@/components/FileUpload';
import { PrintingFormData, FormErrors } from '@/types/forms';

export default function PrintingSection() {
  const [images, setImages] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PrintingFormData>({
    email: '',
    hasArtwork: '',
    garmentType: '',
    garmentColor: '',
    quantity: '',
    sizeBreakdown: '',
    designColors: '',
    printLocation: '',
    turnaroundTime: '',
    additionalInfo: '',
    files: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file changes
  const handleFilesChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email/Phone is required';
    } else if (formData.email.includes('@') && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.hasArtwork) newErrors.hasArtwork = 'Please select if you have artwork';
    if (!formData.garmentType) newErrors.garmentType = 'Please select garment type';
    if (!formData.quantity) newErrors.quantity = 'Please select quantity';
    if (!formData.designColors.trim()) newErrors.designColors = 'Please specify number of colors';
    if (!formData.printLocation.trim()) newErrors.printLocation = 'Please specify print location';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'files') {
          formDataToSend.append(key, value as string);
        }
      });

      // Add files
      formData.files.forEach((file, index) => {
        formDataToSend.append(`file_${index}`, file);
      });

      const response = await fetch('/api/quote/printing', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setIsFormSubmitted(true);
        // Reset form
        setFormData({
          email: '',
          hasArtwork: '',
          garmentType: '',
          garmentColor: '',
          quantity: '',
          sizeBreakdown: '',
          designColors: '',
          printLocation: '',
          turnaroundTime: '',
          additionalInfo: '',
          files: []
        });
      } else {
        setErrors({ general: result.message || 'Failed to submit form. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-center transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>Submit for a Print Quote</h2>
        
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
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
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-8 border bg-white px-2 text-black ${errors.email ? 'border-red-400' : 'border-gray-400'}`}
              placeholder="your@email.com or (555) 123-4567"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>DO YOU HAVE ARTWORK ALREADY?</label>
            <div className="relative">
              <select 
                name="hasArtwork"
                value={formData.hasArtwork}
                onChange={handleInputChange}
                className={`w-full h-8 border bg-white pl-2 pr-8 appearance-none text-black ${errors.hasArtwork ? 'border-red-400' : 'border-gray-400'}`}
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.hasArtwork && <p className="text-red-500 text-xs mt-1">{errors.hasArtwork}</p>}
          </div>
          
          <div className="my-4">
            <FileUpload
              onFilesChange={handleFilesChange}
              files={formData.files}
              buttonText="UPLOAD ARTWORK"
              maxFiles={5}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>SELECT TYPE OF GARMENT YOU WANT PRINTED:</label>
            <div className="relative">
              <select 
                name="garmentType"
                value={formData.garmentType}
                onChange={handleInputChange}
                className={`w-full h-8 border bg-white pl-2 pr-8 appearance-none text-black ${errors.garmentType ? 'border-red-400' : 'border-gray-400'}`}
              >
                <option value="">Select garment type...</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="hoodies">Hoodies/Sweatshirts</option>
                <option value="tank-tops">Tank Tops</option>
                <option value="long-sleeves">Long Sleeves</option>
                <option value="polo-shirts">Polo Shirts</option>
                <option value="jackets">Jackets</option>
                <option value="hats">Hats/Caps</option>
                <option value="bags">Bags</option>
                <option value="other">Other</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.garmentType && <p className="text-red-500 text-xs mt-1">{errors.garmentType}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>SELECT GARMENT COLOR:</label>
            <div className="relative">
              <select 
                name="garmentColor"
                value={formData.garmentColor}
                onChange={handleInputChange}
                className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black"
              >
                <option value="">Select color...</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="gray">Gray</option>
                <option value="navy">Navy</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="other">Other</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>SELECT QUANTITY:</label>
            <div className="relative">
              <select 
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`w-full h-8 border bg-white pl-2 pr-8 appearance-none text-black ${errors.quantity ? 'border-red-400' : 'border-gray-400'}`}
              >
                <option value="">Select quantity...</option>
                <option value="1-10">1-10</option>
                <option value="11-25">11-25</option>
                <option value="26-50">26-50</option>
                <option value="51-100">51-100</option>
                <option value="101-250">101-250</option>
                <option value="250+">250+</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>
              SIZE BREAKDOWN: <span className="text-xs text-gray-500">(STANDARD SIZE BREAKDOWN HERE)</span>
            </label>
            <textarea 
              name="sizeBreakdown"
              value={formData.sizeBreakdown}
              onChange={handleInputChange}
              className="w-full h-16 border border-gray-400 bg-white px-2 py-1 resize-none text-black"
              placeholder="XS: 2, S: 5, M: 10, L: 8, XL: 5..."
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>
              HOW MANY COLORS IS YOUR DESIGN? 
            </label>
            <input 
              type="text"
              name="designColors"
              value={formData.designColors}
              onChange={handleInputChange}
              className={`w-full h-8 border bg-white px-2 text-black ${errors.designColors ? 'border-red-400' : 'border-gray-400'}`}
              placeholder="e.g., 2 colors, 4 colors, full color"
            />
            {errors.designColors && <p className="text-red-500 text-xs mt-1">{errors.designColors}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>WHERE DO YOU WANT THE DESIGN PRINTED?</label>
            <input 
              type="text"
              name="printLocation"
              value={formData.printLocation}
              onChange={handleInputChange}
              className={`w-full h-8 border bg-white px-2 text-black ${errors.printLocation ? 'border-red-400' : 'border-gray-400'}`}
              placeholder="e.g., Front chest, Back, Front and back"
            />
            {errors.printLocation && <p className="text-red-500 text-xs mt-1">{errors.printLocation}</p>}
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>TURNAROUND TIME:</label>
            <div className="relative">
              <select 
                name="turnaroundTime"
                value={formData.turnaroundTime}
                onChange={handleInputChange}
                className="w-full h-8 border border-gray-400 bg-white pl-2 pr-8 appearance-none text-black"
              >
                <option value="">Select timeframe...</option>
                <option value="standard">Standard (1-2 weeks)</option>
                <option value="rush">Rush (3-5 days)</option>
                <option value="emergency">Emergency (24-48 hours)</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>ANY ADDITIONAL INFO:</label>
            <textarea 
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full h-16 border border-gray-400 bg-white px-2 py-1 resize-none text-black"
              placeholder="Any special requirements, deadlines, or other details..."
            />
          </div>
          
          <div className="flex justify-center mt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1 border-1 border-dashed border-gray-400 bg-white transition-colors ${
                isSubmitting 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:border-gray-500 hover:text-gray-700'
              }`}
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </form>
        )}
        </div>
      </div>
    </div>
  );
}