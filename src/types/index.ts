// Navigation Types
export type NavigationSection = 
  | 'printing' 
  | 'shop' 
  | 'repairs' 
  | 'contact' 
  | 'about' 
  | 'clients';

export interface NavigationItem {
  id: NavigationSection;
  label: string;
  color: string;
  href: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

// Business Types
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  pricing: {
    min: number;
    max?: number;
    unit: string;
  };
}

export interface OrderForm {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  projectDetails: {
    serviceType: NavigationSection;
    description: string;
    quantity: number;
    urgency: 'standard' | 'rush' | 'urgent';
  };
  requirements: {
    colors: string[];
    sizes: string[];
    materials: string[];
    deadline: Date;
  };
}

export interface Quote {
  id: string;
  orderForm: OrderForm;
  estimatedCost: {
    subtotal: number;
    tax: number;
    total: number;
  };
  timeline: {
    startDate: Date;
    completionDate: Date;
  };
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}