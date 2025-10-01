import { useState } from 'react';
import Image from 'next/image';

export default function ContactSection() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isFormSubmitted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-bold text-gray-400 mb-0 italic" style={{ fontFamily: 'serif' }}>Thanks!</h3>
            <p className="text-lg font-bold text-gray-400 italic" style={{ fontFamily: 'serif' }}>You'll hear from us soon.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto px-8 pr-20 py-8">
            <h2 className="text-xl font-bold text-gray-500 mb-6 uppercase tracking-wide text-center mt-16" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>Contact</h2>
            
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>NAME:</label>
                <input 
                  type="text" 
                  className="w-full h-8 border border-gray-400 bg-white px-2 text-black"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}>MESSAGE:</label>
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
              
              <div className="flex justify-center mt-4">
                <p className="text-lg font-bold text-gray-400 italic" style={{ fontFamily: 'serif' }}>arthousescreens@gmail.com</p>
              </div>
              
              <div className="flex justify-center mt-1">
                <Image
                  src="/instagramIcon.png"
                  alt="Instagram"
                  width={32}
                  height={32}
                  className="opacity-80 hover:opacity-60 transition-opacity cursor-pointer"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}