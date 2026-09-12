import axios from 'axios';
import { FunctionItem, TransactionItem, FunctionSummary } from '../types';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Functions API
export const fetchFunctions = async (): Promise<FunctionItem[]> => {
  const res = await api.get('/functions');
  return res.data.data;
};

export const fetchFunctionById = async (id: string): Promise<FunctionItem> => {
  const res = await api.get(`/functions/${id}`);
  return res.data.data;
};

export const createFunctionApi = async (data: Partial<FunctionItem>): Promise<FunctionItem> => {
  const res = await api.post('/functions', data);
  return res.data.data;
};

export const updateFunctionApi = async (id: string, data: Partial<FunctionItem>): Promise<FunctionItem> => {
  const res = await api.put(`/functions/${id}`, data);
  return res.data.data;
};

export const deleteFunctionApi = async (id: string): Promise<void> => {
  await api.delete(`/functions/${id}`);
};

// Transactions API
export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export const fetchTransactions = async (
  functionId: string,
  filters?: TransactionFilters
): Promise<TransactionItem[]> => {
  const res = await api.get(`/functions/${functionId}/transactions`, { params: filters });
  return res.data.data;
};

export const fetchTransactionById = async (
  functionId: string,
  id: string
): Promise<TransactionItem> => {
  const res = await api.get(`/functions/${functionId}/transactions/${id}`);
  return res.data.data;
};

export const createTransactionApi = async (
  functionId: string,
  data: Omit<TransactionItem, '_id' | 'functionId' | 'createdAt' | 'updatedAt'>
): Promise<TransactionItem> => {
  const res = await api.post(`/functions/${functionId}/transactions`, data);
  return res.data.data;
};

export const updateTransactionApi = async (
  functionId: string,
  id: string,
  data: Partial<TransactionItem>
): Promise<TransactionItem> => {
  const res = await api.put(`/functions/${functionId}/transactions/${id}`, data);
  return res.data.data;
};

export const deleteTransactionApi = async (functionId: string, id: string): Promise<void> => {
  await api.delete(`/functions/${functionId}/transactions/${id}`);
};

// Summary API
export const fetchFunctionSummary = async (functionId: string): Promise<FunctionSummary> => {
  const res = await api.get(`/functions/${functionId}/summary`);
  return res.data.data;
};
