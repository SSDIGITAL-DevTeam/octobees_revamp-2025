export type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type User = {
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

export type PlanService = {
  id: string;
  name: string;
  type: 'Standard' | 'Premium';
  showPrice: boolean;
  status: 'Draft' | 'Active' | 'NonActive';
  options: string;
  descriptions: string;
  categoryId: string;
}

export type CategoryService = {
  id: string;
  name: string;
  heading: string;
  description: string;
  status: 'Draft' | 'Active' | 'NonActive';
  slug: string;
}

export type Price = {
  id: string;
  curr: 'IDR' | 'SGR' | 'MYR';
  amount: number;
  discount: number;
  idPlan: string;
}

export type Benefit = {
  id: string;
  value: string;
  idPlan: string;
}

export type Role = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: 'Draft' | 'Active' | 'NonActive';
  refreshToken?: string | null;
  role: string;
  features: any; // bisa diganti lebih spesifik
}

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

export type Blog = {
  id: string;
  title: string;
  image: string;
  content: string;
  slug: string;
  status: string;
  favorite: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
  },
  category: {
    id: string;
    name: string;
    slug: string;
  }
}

export type Pages = {
  id: string;
  page: string;
  slug: string;
  categoryServiceId?: string | null;
}

export type MetaTag = {
  id: string;
  key: string;
  value: string;
  content: string;
  slug: string;
}

export type Order = {
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

export type Career = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  positionId: number;
  resume: string;
  portfolio: string;
  message?: string | null;
  status: string; // Sesuaikan dengan careerStatusEnum
  createdAt: string;
  updatedAt: string;
  position: {
    id: number;
    name: string;
  }
}
export type Position = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type Subscription = {
  id: number;
  email: string;
  source: string;
  insight?: string | null;
  createdAt: string;
  updatedAt: string;
}


