// User Roles
export enum UserRole {
  ADMIN = 'admin',
  SALESPERSON = 'salesperson',
  TECHNICIAN = 'technician',
}

// User Type
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Type
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  assignedTechnician?: string;
  status: 'active' | 'inactive' | 'dnc'; // Do Not Contact
  notes?: string;
  totalRevenue: number;
  lastServiceDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job Status
export enum JobStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Job Type
export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  assignedTo: string;
  assignedToName: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // in minutes
  status: JobStatus;
  price: number;
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  signature?: string;
  completedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Availability Type
export interface Availability {
  id: string;
  userId: string;
  date: Date;
  slots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  isFullDayOff: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Map Pin Type
export enum PinType {
  CUSTOMER = 'customer',
  LEAD = 'lead',
  DNC = 'dnc',
}

export interface MapPin {
  id: string;
  type: PinType;
  customerId?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  name?: string;
  phone?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Type
export interface Invoice {
  id: string;
  jobId: string;
  customerId: string;
  customerName: string;
  amount: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  pdfUrl?: string;
  sentAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Type
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// Analytics Type
export interface Analytics {
  totalRevenue: number;
  totalJobs: number;
  completedJobs: number;
  activeCustomers: number;
  averageJobValue: number;
  topTechnician: string;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}
