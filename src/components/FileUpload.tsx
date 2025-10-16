'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
  buttonText?: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

export default function FileUpload({ 
  onFilesChange, 
  files, 
  buttonText = "UPLOAD",
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    'application/pdf': ['.pdf']
  },
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    onFilesChange(newFiles.slice(0, maxFiles));
  }, [files, onFilesChange, maxFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
    disabled: files.length >= maxFiles
  });

  return (
    <div className="space-y-2">
      {/* Upload Button/Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          flex justify-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-gray-600 bg-gray-50' 
            : 'border-gray-400 bg-white hover:border-gray-500'
          }
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <button 
          type="button"
          className="px-4 py-1 border-1 border-dashed border-gray-400 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-colors"
          style={{ fontFamily: 'Helvetica-Bold-Condensed, Arial, sans-serif' }}
          disabled={files.length >= maxFiles}
        >
          {isDragActive ? 'DROP FILES HERE' : buttonText}
          {files.length > 0 && ` (${files.length}/${maxFiles})`}
        </button>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="text-red-500 text-xs space-y-1">
          {fileRejections.map(({ file, errors }, index) => (
            <div key={index}>
              {file.name}: {errors.map(e => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 text-xs">
              <span className="text-black truncate flex-1">
                {file.name} ({(file.size / 1024).toFixed(1)}KB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-2 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Drag & drop files here, or click to select. Max {maxFiles} files, {(maxSize / 1024 / 1024).toFixed(0)}MB each.
      </p>
    </div>
  );
}