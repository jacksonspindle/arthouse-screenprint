'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ImageCarousel from '@/components/ImageCarousel';
import { PrintingFormData, FormErrors } from '@/types/forms';

const PRINTING_IMAGES = Array.from({ length: 19 }, (_, i) => `/printing-page-images/${i + 1}.png`);

export default function PrintingSection() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PrintingFormData>({
    email: '',
    hasArtwork: '',
    garmentType: '',
    garmentColor: '',
    quantity: '',
    sizeBreakdown: '',
    printLocation: '',
    turnaroundTime: '',
    additionalInfo: '',
    files: []
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
          printLocation: '',
          turnaroundTime: '',
          additionalInfo: '',
          files: []
        });
      } else {
        setErrors({ general: result.message || 'Failed to submit form. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Image Carousel */}
      <ImageCarousel images={PRINTING_IMAGES} altPrefix="Printing work" />

      {/* Form Section - Scrollable with fade edges */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)'
        }}
      >
        <div className="max-w-md mx-auto px-8 pr-20 py-8 pt-12 pb-12">
        <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-center transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>Submit for a Print Quote</h2>

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
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>EMAIL/PHONE NUMBER:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-8 border  px-2  ${errors.email ? 'border-red-400' : 'border-gray-400'}`}
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="your@email.com or (555) 123-4567"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>DO YOU HAVE ARTWORK ALREADY?</label>
            <div className="relative">
              <select
                name="hasArtwork"
                value={formData.hasArtwork}
                onChange={handleInputChange}
                className={`w-full h-8 border  pl-2 pr-8 appearance-none  ${errors.hasArtwork ? 'border-red-400' : 'border-gray-400'}`}
                style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
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
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>SELECT TYPE OF GARMENT YOU WANT PRINTED:</label>
            <div className="relative">
              <select
                name="garmentType"
                value={formData.garmentType}
                onChange={handleInputChange}
                className={`w-full h-8 border  pl-2 pr-8 appearance-none  ${errors.garmentType ? 'border-red-400' : 'border-gray-400'}`}
                style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              >
                <option value="">Select garment type...</option>
                <option value="t-shirt">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="crewneck">Crewneck</option>
                <option value="longsleeve">Longsleeve</option>
                <option value="tank-top">Tank Top</option>
                <option value="sweatpants">Sweatpants</option>
                <option value="shorts">Shorts</option>
                <option value="bags-totes">Bags/Totes</option>
                <option value="jacket">Jacket</option>
                <option value="other">Other</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.garmentType && <p className="text-red-500 text-xs mt-1">{errors.garmentType}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>GARMENT COLOR:</label>
            <input
              type="text"
              name="garmentColor"
              value={formData.garmentColor}
              onChange={handleInputChange}
              className="w-full h-8 border border-gray-400 px-2"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="e.g. Black, White, Navy..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>QUANTITY:</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full h-8 border px-2 ${errors.quantity ? 'border-red-400' : 'border-gray-400'}`}
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="e.g. 10, 50, 100..."
            />
            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>
              SIZE BREAKDOWN: <span className="text-xs text-gray-500">(STANDARD SIZE BREAKDOWN HERE)</span>
            </label>
            <textarea
              name="sizeBreakdown"
              value={formData.sizeBreakdown}
              onChange={handleInputChange}
              className="w-full h-16 border border-gray-400  px-2 py-1 resize-none "
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="XS: 2, S: 5, M: 10, L: 8, XL: 5..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>WHERE DO YOU WANT THE DESIGN PRINTED?</label>
            <input
              type="text"
              name="printLocation"
              value={formData.printLocation}
              onChange={handleInputChange}
              className={`w-full h-8 border  px-2  ${errors.printLocation ? 'border-red-400' : 'border-gray-400'}`}
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="e.g., Front chest, Back, Front and back"
            />
            {errors.printLocation && <p className="text-red-500 text-xs mt-1">{errors.printLocation}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>
              WHEN DO YOU NEED THIS DONE BY? <span className="text-xs text-gray-500">(RUSH FEE FOR 1-2 WEEKS)</span>
            </label>
            <input
              type="text"
              name="turnaroundTime"
              value={formData.turnaroundTime}
              onChange={handleInputChange}
              className="w-full h-8 border border-gray-400 px-2"
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="e.g. January 15, 2026"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm transition-colors duration-200" style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)' }}>ANY ADDITIONAL INFO:</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full h-16 border border-gray-400  px-2 py-1 resize-none "
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
              placeholder="Any special requirements, deadlines, or other details..."
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-1 border-1 border-dashed border-gray-400  transition-colors ${
                isSubmitting
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:border-gray-500 hover:text-gray-700'
              }`}
              style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif', color: 'var(--form-label-color)', backgroundColor: 'var(--form-background-color)' }}
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
