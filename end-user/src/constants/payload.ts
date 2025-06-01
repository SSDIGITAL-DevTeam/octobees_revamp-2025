export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  status: string; // Sesuaikan dengan enum userStatusEnum
  refreshToken?: string | null;
  role: string;
  features?: any; // Bisa diganti dengan spesifik shape kalau diketahui
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanService {
  id: string;
  name: string;
  type: 'Standard' | 'Premium';
  showPrice: boolean;
  status: 'Draft' | 'Active' | 'NonActive';
  options: string;
  descriptions: string;
  categoryId: string;
}

export interface CategoryService {
  id: string;
  name: string;
  heading: string;
  description: string;
  status: 'Draft' | 'Active' | 'NonActive';
  slug: string;
}

export interface Price {
  id: string;
  curr: 'IDR' | 'SGR' | 'MYR';
  amount: number;
  discount: number;
  idPlan: string;
}

export interface Benefit {
  id: string;
  value: string;
  idPlan: string;
}

export interface Role {
  id: string;
  name: string;
  email: string;
  password: string;
  status: 'Draft' | 'Active' | 'NonActive';
  refreshToken?: string | null;
  role: string;
  features: any; // bisa diganti lebih spesifik
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

export interface Blog {
  id: string;
  title: string;
  image: string;
  content: string;
  slug: string;
  status: string; // Sesuaikan dengan blogStatusEnum
  favorite: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Pages {
  id: string;
  page: string;
  slug: string;
  categoryServiceId?: string | null;
}

export interface MetaTag {
  id: string;
  key: string;
  value: string;
  content: string;
  slug: string;
}

export interface Order {
  id: string;
  amount: number;
  bussiness: string;
  categoryId: string;
  date: string;
  email: string;
  message: string;
  name: string;
  phoneNumber: string;
  idPlan: string;
  time: string;
}

export interface Career {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  positionId: number;
  resume: string;
  portfolio: string;
  message?: string | null;
  status: string; // Sesuaikan dengan careerStatusEnum
  createdAt: Date;
  updatedAt: Date;
  position: {
    id: number;
    name: string;
  };
}
export interface Position {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

