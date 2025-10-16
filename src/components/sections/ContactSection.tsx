import { useState } from 'react';
import Image from 'next/image';
import { ContactFormData, FormErrors } from '@/types/forms';

export default function ContactSection() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsFormSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          message: ''
        });
      } else {
        setErrors({ general: result.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form Section - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
        {isFormSubmitted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-bold text-gray-400 mb-0 italic" style={{ fontFamily: 'serif' }}>Thanks!</h3>
            <p className="text-lg font-bold text-gray-400 italic" style={{ fontFamily: 'serif' }}>You&apos;ll hear from us soon.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto px-8 pr-20 py-8">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-center mt-16 transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>Contact</h2>
            
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>NAME:</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full h-8 border bg-white px-2 text-black ${errors.name ? 'border-red-400' : 'border-gray-400'}`}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--foreground)' }}>MESSAGE:</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full h-24 border bg-white px-2 py-1 resize-none text-black ${errors.message ? 'border-red-400' : 'border-gray-400'}`}
                  placeholder="Your message..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
                  {isSubmitting ? 'SENDING...' : 'SUBMIT'}
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