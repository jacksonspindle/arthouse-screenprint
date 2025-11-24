'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import PrintingSection from '@/components/sections/PrintingSection';
import ShopSection from '@/components/sections/ShopSection';
import RepairsSection from '@/components/sections/RepairsSection';
import ContactSection from '@/components/sections/ContactSection';
import AboutSection from '@/components/sections/AboutSection';
import ClientsSection from '@/components/sections/ClientsSection';
import { Providers } from '@/components/Providers';

type Section = 'home' | 'printing' | 'shop' | 'repairs' | 'contact' | 'about' | 'clients';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  
  // Prevent page-level scrolling on all sections
  useEffect(() => {
    // Always prevent document/body scrolling - only allow component-level scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [activeSection]);
  
  return (
    <Providers>
      <div 
        className="w-full h-screen overflow-hidden transition-colors duration-200" 
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        {/* Persistent Header */}
        <Header setActiveSection={setActiveSection} />
        
        {/* Persistent Navigation */}
        <Navigation setActiveSection={setActiveSection} />
        
        {/* Persistent Footer */}
        <Footer />
      
      {/* Main Content Area */}
      <div className="pt-28 pb-50 h-full overflow-hidden">
        {activeSection === 'home' ? (
          /* Home Page - Logo */
          <div className="h-full flex items-right justify-center overflow-hidden">
            <div className="text-center w-4/5 max-w-4xl">
              <button 
                onClick={() => setActiveSection('home')} 
                className="cursor-pointer hover:opacity-80 transition-opacity w-full"
              >
                <div className="relative w-full">
                  <Image
                    src="/ArtHouseLogo.svg"
                    alt="Arthouse Screen Print and Design Studio"
                    width={800}
                    height={200}
                    className="w-full h-auto mx-auto mb-0 transition-all duration-200"
                    style={{ 
                      filter: `invert(var(--icon-invert))` 
                    }}
                    priority
                    onError={() => console.log('Logo failed to load')}
                  />
                  {/* Screen Print and Design Studio Text */}
                  <p 
                    className="whitespace-nowrap font-bold -mt-4 transition-colors duration-200"
                    style={{ 
                      fontFamily: 'TimesNRCyrMT, serif', 
                      fontSize: '10px',
                      letterSpacing: '1px',
                      color: 'var(--form-label-color)',
                      opacity: 0.9
                    }}
                  >
                    SCREEN PRINT AND DESIGN STUDIO
                  </p>
                  {/* Fallback text in case logo doesn't load */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div 
                      className="p-2 rounded text-xs transition-colors duration-200"
                      style={{ 
                        backgroundColor: 'var(--gray-background)',
                        color: 'var(--foreground)'
                      }}
                    >
                      Loading logo...
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Section Pages */
          <div className="h-full relative">
            <div className="w-full h-full">
              {activeSection === 'printing' && <PrintingSection />}
              {activeSection === 'shop' && <ShopSection />}
              {activeSection === 'repairs' && <RepairsSection />}
              {activeSection === 'contact' && <ContactSection />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'clients' && <ClientsSection />}
            </div>
          </div>
        )}
        </div>
      </div>
    </Providers>
  );
}
