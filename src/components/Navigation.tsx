'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Section = 'home' | 'printing' | 'shop' | 'repairs' | 'contact' | 'about' | 'clients';

interface NavigationProps {
  setActiveSection: (section: Section) => void;
}

interface NavItem {
  section: Section;
  backgroundColor: string;
  label?: string;
}

const navItems: NavItem[] = [
  { section: 'printing', backgroundColor: '#00ABED', label: 'PRINTING' },
  { section: 'shop', backgroundColor: '#EA008A', label: 'SHOP' },
  { section: 'repairs', backgroundColor: '#FFF000', label: 'REPAIRS' },
  { section: 'contact', backgroundColor: '#2E3090', label: 'CONTACT' },
  { section: 'about', backgroundColor: '#EC1D25', label: 'ABOUT' },
  { section: 'clients', backgroundColor: '#00A451', label: 'CLIENTS' },
  { section: 'home', backgroundColor: '#000000', label: undefined },
];

export default function Navigation({ setActiveSection }: NavigationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<Section | null>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const getSectionFromPosition = useCallback((clientY: number): Section | null => {
    if (!navigationRef.current) return null;
    
    const rect = navigationRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const itemHeight = 48; // 12 * 4 = 48px (h-12)
    const itemIndex = Math.floor(relativeY / itemHeight);
    
    if (itemIndex >= 0 && itemIndex < navItems.length) {
      return navItems[itemIndex].section;
    }
    
    return null;
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      setIsDragging(true);
      const section = getSectionFromPosition(event.clientY);
      if (section) {
        setHoveredSection(section);
        setActiveSection(section);
      }
    }
  }, [getSectionFromPosition, setActiveSection]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (isDragging && (event.pointerType === 'touch' || event.pointerType === 'pen')) {
      const section = getSectionFromPosition(event.clientY);
      if (section && section !== hoveredSection) {
        setHoveredSection(section);
        setActiveSection(section);
      }
    }
  }, [isDragging, hoveredSection, getSectionFromPosition, setActiveSection]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setHoveredSection(null);
  }, []);

  const handleClick = useCallback((section: Section) => {
    if (!isDragging) {
      setActiveSection(section);
    }
  }, [isDragging, setActiveSection]);

  return (
    <motion.div 
      ref={navigationRef}
      className="fixed right-4 top-3/5 transform -translate-y-1/2 w-12 shadow-lg z-50 touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.section}
          onClick={() => handleClick(item.section)}
          className="w-12 h-12 flex items-end justify-center pb-1 transition-all duration-200 pointer-events-auto relative"
          style={{ 
            backgroundColor: item.backgroundColor
          }}
          whileHover={{ scale: isDragging ? 1 : 1.05 }}
          whileTap={{ scale: isDragging ? 1 : 0.95 }}
        >
          {item.label ? (
            <span 
              className="text-black text-[8px] select-none pointer-events-none" 
              style={{ fontFamily: 'Courier, monospace' }}
            >
              {item.label}
            </span>
          ) : (
            <Image
              src="/ArtHouseIcon.png"
              alt="ArtHouse Icon"
              width={32}
              height={32}
              className="object-contain pointer-events-none"
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}