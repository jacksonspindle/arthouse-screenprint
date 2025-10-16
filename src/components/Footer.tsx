'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const gradientBoxes = [
  { color: 'bg-black', themeLevel: 100 },
  { color: 'bg-gray-900', themeLevel: 89 },
  { color: 'bg-gray-800', themeLevel: 78 },
  { color: 'bg-gray-700', themeLevel: 67 },
  { color: 'bg-gray-600', themeLevel: 56 },
  { color: 'bg-gray-500', themeLevel: 44 },
  { color: 'bg-gray-400', themeLevel: 33 },
  { color: 'bg-gray-300', themeLevel: 22 },
  { color: 'bg-gray-200', themeLevel: 11 },
  { color: 'bg-white', themeLevel: 0 },
];

export default function Footer() {
  const { setThemeLevel, isDragging, setIsDragging } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const getThemeFromPosition = useCallback((clientX: number): number | null => {
    if (!gradientRef.current) return null;
    
    const rect = gradientRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const boxWidth = 16; // w-4 = 16px
    const boxIndex = Math.floor(relativeX / boxWidth);
    
    if (boxIndex >= 0 && boxIndex < gradientBoxes.length) {
      return gradientBoxes[boxIndex].themeLevel;
    }
    
    return null;
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      setIsDragging(true);
      const theme = getThemeFromPosition(event.clientX);
      if (theme !== null) {
        setHoveredIndex(Math.floor((100 - theme) / 11));
        setThemeLevel(theme);
      }
    }
  }, [getThemeFromPosition, setThemeLevel, setIsDragging]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (isDragging && (event.pointerType === 'touch' || event.pointerType === 'pen')) {
      const theme = getThemeFromPosition(event.clientX);
      if (theme !== null) {
        const newIndex = Math.floor((100 - theme) / 11);
        if (newIndex !== hoveredIndex) {
          setHoveredIndex(newIndex);
          setThemeLevel(theme);
        }
      }
    }
  }, [isDragging, hoveredIndex, getThemeFromPosition, setThemeLevel]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setHoveredIndex(null);
  }, [setIsDragging]);

  const handleClick = useCallback((theme: number) => {
    if (!isDragging) {
      setThemeLevel(theme);
    }
  }, [isDragging, setThemeLevel]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 z-50 pointer-events-none">
      {/* Bottom Crosshair */}
      <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <Image
          src="/Crosshair.svg"
          alt="Crosshair"
          width={48}
          height={48}
          className="w-12 h-12"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)` 
          }}
        />
      </div>
      
      {/* Bottom Corner Elements */}
      <div className="absolute bottom-5 left-4">
        <Image
          src="/Sprial.png"
          alt="Spiral"
          width={32}
          height={32}
          className="w-9 h-9"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.3 
          }}
        />
        {/* Line above bottom-left spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute -top-6 left-5 transform -translate-x-1/2 w-9 h-0.5"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4 
          }}
        />
        {/* Vertical line to the right of bottom-left spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-1/2 left-12 transform -translate-y-1/2 rotate-90 w-9 h-0.5"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4 
          }}
        />
      </div>
      
      <div className="absolute bottom-5 right-4">
        <Image
          src="/Sprial.png"
          alt="Spiral"
          width={32}
          height={32}
          className="w-9 h-9"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4 
          }}
        />
        {/* Line above bottom-right spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-9 h-0.5"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4 
          }}
        />
        {/* Vertical line to the left of bottom-right spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 rotate-90 w-9 h-0.5"
          style={{ 
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4 
          }}
        />
      </div>
      
      {/* Bottom Black to White Gradient Boxes - Interactive Theme Slider */}
      <motion.div 
        ref={gradientRef}
        className="absolute bottom-7.5 left-1/2 transform -translate-x-1/2 flex ml-3 pointer-events-auto touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {gradientBoxes.map((box, index) => (
          <motion.div
            key={index}
            className={`w-4 h-4 ${box.color} cursor-pointer`}
            onClick={() => handleClick(box.themeLevel)}
            animate={{
              scale: hoveredIndex === index ? 1.2 : 1,
              zIndex: hoveredIndex === index ? 10 : 1,
            }}
            transition={{
              duration: 0.15,
              ease: 'easeOut'
            }}
            style={{
              boxShadow: 'none'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}