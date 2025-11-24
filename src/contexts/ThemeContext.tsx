'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ThemeContextType {
  themeLevel: number; // 0-100, where 0 is light and 100 is dark
  setThemeLevel: (level: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Color interpolation utility
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Parse hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeLevel, setThemeLevelState] = useState(0); // Start with light theme
  const [isDragging, setIsDragging] = useState(false);

  const setThemeLevel = useCallback((level: number) => {
    const clampedLevel = Math.max(0, Math.min(100, level));
    setThemeLevelState(clampedLevel);
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    const factor = themeLevel / 100;
    
    // Define light and dark colors
    const lightBg = '#ffffff';
    const darkBg = '#000000';
    const lightText = '#000000';
    const darkText = '#ffffff'; // Pure white for better contrast
    const lightFormLabel = '#7f7f7f'; // Start form labels at this gray instead of black
    const darkFormLabel = '#ffffff'; // Pure white for better contrast
    const lightFormBg = '#ffffff'; // Form input backgrounds start white
    const darkFormBg = '#000000'; // Form input backgrounds end black
    const lightGray = '#f3f4f6'; // gray-100
    const darkGray = '#1f2937'; // gray-800
    
    // Interpolate colors with enhanced contrast for text
    const backgroundColor = interpolateColor(lightBg, darkBg, factor);
    // Make text transition much more dramatic - use a very steep curve for bright white
    const textFactor = Math.pow(factor, 0.3); // Much steeper curve - white appears very early
    const textColor = interpolateColor(lightText, darkText, textFactor);
    const formLabelColor = interpolateColor(lightFormLabel, darkFormLabel, textFactor);
    const formBackgroundColor = interpolateColor(lightFormBg, darkFormBg, factor);
    const grayColor = interpolateColor(lightGray, darkGray, factor);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--background', backgroundColor);
    document.documentElement.style.setProperty('--foreground', textColor);
    document.documentElement.style.setProperty('--form-label-color', formLabelColor);
    document.documentElement.style.setProperty('--form-background-color', formBackgroundColor);
    document.documentElement.style.setProperty('--gray-background', grayColor);
    
    // Calculate icon filter for spirals and lines
    // In light mode: low brightness (0.3), no invert (0)
    // In dark mode: high brightness (1.0), full invert (1)
    const brightness = factor > 0.5 ? 1.0 : 0.3 + (0.7 * factor * 2); 
    const invert = factor; // 0 (no invert) to 1 (full invert)
    
    document.documentElement.style.setProperty('--icon-brightness', brightness.toString());
    document.documentElement.style.setProperty('--icon-invert', invert.toString());
    
    // Update body background immediately
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
    
  }, [themeLevel]);

  const value: ThemeContextType = {
    themeLevel,
    setThemeLevel,
    isDragging,
    setIsDragging,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}