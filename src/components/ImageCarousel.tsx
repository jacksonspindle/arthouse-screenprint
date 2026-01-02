'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  altPrefix: string;
}

export default function ImageCarousel({ images: initialImages, altPrefix }: ImageCarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isAnimatingRef = useRef(true);
  const touchStartXRef = useRef(0);
  const touchStartPosRef = useRef(0);
  const lastTouchXRef = useRef(0);
  const velocityRef = useRef(0);
  const imageWidthRef = useRef(320);

  // Shuffle array function
  const shuffleArray = useCallback((array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Initialize images
  useEffect(() => {
    const shuffled = shuffleArray(initialImages);
    // Triple for seamless infinite scroll
    setImages([...shuffled, ...shuffled, ...shuffled]);
  }, [initialImages, shuffleArray]);

  // Get the width of one complete set of images
  const getSetWidth = useCallback(() => {
    return (images.length / 3) * imageWidthRef.current;
  }, [images.length]);

  // Update track position without causing re-render
  const updateTrackPosition = useCallback((position: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-position}px)`;
    }
  }, []);

  // Normalize position to stay within bounds
  const normalizePosition = useCallback((pos: number) => {
    const setWidth = getSetWidth();
    if (setWidth === 0) return pos;

    // Keep position in the middle set for seamless looping
    if (pos >= setWidth * 2) {
      return pos - setWidth;
    } else if (pos < setWidth) {
      return pos + setWidth;
    }
    return pos;
  }, [getSetWidth]);

  // Animation loop
  useEffect(() => {
    if (images.length === 0) return;

    const animate = () => {
      if (isAnimatingRef.current) {
        positionRef.current += 0.5; // Smooth, slow scroll
        positionRef.current = normalizePosition(positionRef.current);
        updateTrackPosition(positionRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start at middle set
    positionRef.current = getSetWidth();
    updateTrackPosition(positionRef.current);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images.length, normalizePosition, updateTrackPosition, getSetWidth]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isAnimatingRef.current = false;
    touchStartXRef.current = e.touches[0].clientX;
    lastTouchXRef.current = e.touches[0].clientX;
    touchStartPosRef.current = positionRef.current;
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    const currentX = e.touches[0].clientX;
    const deltaFromStart = touchStartXRef.current - currentX;
    const deltaFromLast = lastTouchXRef.current - currentX;

    // Track velocity for momentum
    velocityRef.current = deltaFromLast;
    lastTouchXRef.current = currentX;

    // Update position based on drag
    let newPosition = touchStartPosRef.current + deltaFromStart;
    newPosition = normalizePosition(newPosition);
    positionRef.current = newPosition;
    updateTrackPosition(newPosition);
  }, [normalizePosition, updateTrackPosition]);

  const handleTouchEnd = useCallback(() => {
    // Apply momentum
    const momentum = velocityRef.current * 5;
    let targetPosition = positionRef.current + momentum;

    // Animate to target with easing
    const startPosition = positionRef.current;
    const startTime = performance.now();
    const duration = 300;

    const animateMomentum = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      let newPosition = startPosition + (targetPosition - startPosition) * easeProgress;
      newPosition = normalizePosition(newPosition);
      positionRef.current = newPosition;
      updateTrackPosition(newPosition);

      if (progress < 1) {
        requestAnimationFrame(animateMomentum);
      } else {
        // Resume auto-scroll after momentum animation
        setTimeout(() => {
          isAnimatingRef.current = true;
        }, 500);
      }
    };

    requestAnimationFrame(animateMomentum);
  }, [normalizePosition, updateTrackPosition]);

  // Mouse wheel handler for desktop
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    isAnimatingRef.current = false;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    let newPosition = positionRef.current + delta;
    newPosition = normalizePosition(newPosition);
    positionRef.current = newPosition;
    updateTrackPosition(newPosition);

    // Resume auto-scroll after inactivity
    setTimeout(() => {
      isAnimatingRef.current = true;
    }, 1000);
  }, [normalizePosition, updateTrackPosition]);

  if (images.length === 0) {
    return <div className="h-48 flex-shrink-0" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative h-48 overflow-hidden cursor-grab active:cursor-grabbing flex-shrink-0 touch-pan-y"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ transform: 'translateX(0px)' }}
      >
        {images.map((src, index) => (
          <div key={index} className="h-full flex-shrink-0 w-80">
            <Image
              src={src}
              alt={`${altPrefix} ${(index % (images.length / 3)) + 1}`}
              width={320}
              height={192}
              className="h-full w-full object-cover object-bottom pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
