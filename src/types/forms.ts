export interface PrintingFormData {
  email: string;
  hasArtwork: string;
  garmentType: string;
  garmentColor: string;
  quantity: string;
  sizeBreakdown: string;
  designColors: string;
  printLocation: string;
  turnaroundTime: string;
  additionalInfo: string;
  files: File[];
}

export interface RepairsFormData {
  email: string;
  garmentType: string;
  quantity: string;
  repairType: string;
  hasReferenceGarment: string;
  turnaroundTime: string;
  description: string;
  files: File[];
}

export interface ContactFormData {
  name: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}