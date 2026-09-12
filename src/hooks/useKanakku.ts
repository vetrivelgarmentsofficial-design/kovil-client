import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFunction } from '../context/FunctionContext';
import {
  fetchTransactions,
  fetchFunctionSummary,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
  TransactionFilters,
} from '../api/client';
import { TransactionItem } from '../types';

export const useSummary = () => {
  const { activeFunctionId } = useFunction();

  return useQuery({
    queryKey: ['summary', activeFunctionId],
    queryFn: () => (activeFunctionId ? fetchFunctionSummary(activeFunctionId) : null),
    enabled: !!activeFunctionId,
    staleTime: 5000,
  });
};

export const useTransactions = (filters?: TransactionFilters) => {
  const { activeFunctionId } = useFunction();

  return useQuery({
    queryKey: ['transactions', activeFunctionId, filters],
    queryFn: () => (activeFunctionId ? fetchTransactions(activeFunctionId, filters) : []),
    enabled: !!activeFunctionId,
    staleTime: 5000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { activeFunctionId } = useFunction();

  return useMutation({
    mutationFn: (data: Omit<TransactionItem, '_id' | 'functionId' | 'createdAt' | 'updatedAt'>) => {
      if (!activeFunctionId) throw new Error('No active function selected');
      return createTransactionApi(activeFunctionId, data);
    },
    onSuccess: () => {
      // Invalidate both summary and transactions queries
      queryClient.invalidateQueries({ queryKey: ['summary', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { activeFunctionId } = useFunction();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionItem> }) => {
      if (!activeFunctionId) throw new Error('No active function selected');
      return updateTransactionApi(activeFunctionId, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { activeFunctionId } = useFunction();

  return useMutation({
    mutationFn: (id: string) => {
      if (!activeFunctionId) throw new Error('No active function selected');
      return deleteTransactionApi(activeFunctionId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', activeFunctionId] });
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
  });
};
