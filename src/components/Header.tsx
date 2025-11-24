'use client';

import Image from 'next/image';
import { useCartContext } from '@/contexts/CartContext';

type Section = 'home' | 'printing' | 'shop' | 'repairs' | 'contact' | 'about' | 'clients' | 'cart';

interface HeaderProps {
  setActiveSection: (section: Section) => void;
}

export default function Header({ setActiveSection }: HeaderProps) {
  const { itemCount } = useCartContext();

  return (
    <div className="fixed top-0 left-0 right-0 h-28 z-50 pointer-events-none">
      {/* Top Corner Elements */}
      <div className="absolute top-4 left-4">
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
        {/* Line under top-left spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-12 left-1/2 transform -translate-x-1/2 w-9 h-0.5"
          style={{
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.4
          }}
        />
        {/* Vertical line to the right of top-left spiral */}
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

      {/* Top Right - Spiral with Cart Badge */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setActiveSection('cart')}
          className="relative pointer-events-auto hover:opacity-80 transition-opacity"
        >
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
          {/* Cart Counter Badge */}
          {itemCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif',
                fontSize: '10px',
                fontStyle: 'italic'
              }}
            >
              {itemCount > 9 ? '9+' : itemCount}
            </div>
          )}
        </button>
        {/* Line under top-right spiral */}
        <Image
          src="/Line.png"
          alt="Line"
          width={24}
          height={2}
          className="absolute top-12 left-1/2 transform -translate-x-1/2 w-9 h-0.5"
          style={{
            filter: `brightness(0) saturate(100%) invert(var(--icon-invert)) contrast(100%) brightness(1)`,
            opacity: 0.3
          }}
        />
        {/* Vertical line to the left of top-right spiral */}
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

      {/* Top Crosshair - Clickable */}
      <button
        onClick={() => setActiveSection('home')}
        className="absolute top-11 left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-auto hover:opacity-80 transition-opacity"
      >
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
      </button>
    </div>
  );
}