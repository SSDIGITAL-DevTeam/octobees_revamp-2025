import { axiosInstance } from '@/lib/axios';

const BASE_URL = '/back-office/training';

export type TrainingContent = {
  id: string;
  title: string;
  description?: string;
  contentType:
    | 'embed_code'
    | 'embed_script'
    | 'widget_id'
    | 'video_youtube_url'
    | 'video_direct_url'
    | 'video_url'
    | 'pdf_file'
    | 'credentials'
    | 'agreement';
  contentValue: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TrainingContentType = TrainingContent['contentType'];

export const getTrainingContent = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/training-content`);
  return response.data;
};

export const getTrainingContentById = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/training-content/${id}`);
  return response.data;
};

export const createTrainingContent = async (data: {
  title: string;
  description?: string;
  contentType: string;
  contentValue: string;
  orderIndex?: number;
}) => {
  const response = await axiosInstance.post(`${BASE_URL}/training-content`, data);
  return response.data;
};

export const updateTrainingContent = async (id: string, data: {
  title?: string;
  description?: string;
  contentType?: string;
  contentValue?: string;
  orderIndex?: number;
  isActive?: boolean;
}) => {
  const response = await axiosInstance.put(`${BASE_URL}/training-content/${id}`, data);
  return response.data;
};

export const deleteTrainingContent = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/training-content/${id}`);
  return response.data;
};

export const reorderTrainingContent = async (orders: { id: string; orderIndex: number }[]) => {
  const response = await axiosInstance.post(`${BASE_URL}/training-content/reorder`, { orders });
  return response.data;
};

export const uploadTrainingPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await axiosInstance.post(`${BASE_URL}/training-content/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
