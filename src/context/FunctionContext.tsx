import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FunctionItem } from '../types';
import {
  fetchFunctions,
  createFunctionApi,
  updateFunctionApi,
  deleteFunctionApi,
} from '../api/client';

interface FunctionContextType {
  activeFunctionId: string | null;
  activeFunction: FunctionItem | null;
  functions: FunctionItem[];
  isLoading: boolean;
  setActiveFunctionId: (id: string) => void;
  createFunction: (data: Partial<FunctionItem>) => Promise<FunctionItem>;
  updateFunction: (id: string, data: Partial<FunctionItem>) => Promise<FunctionItem>;
  deleteFunction: (id: string) => Promise<void>;
}

const FunctionContext = createContext<FunctionContextType | undefined>(undefined);

const ACTIVE_FUNCTION_KEY = 'function_kanakku_active_id';

export const FunctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [activeFunctionId, setActiveFunctionIdState] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_FUNCTION_KEY);
  });

  const { data: functions = [], isLoading } = useQuery({
    queryKey: ['functions'],
    queryFn: fetchFunctions,
  });

  // Auto select function if none selected or if active one no longer exists
  useEffect(() => {
    if (functions.length > 0) {
      const exists = functions.find((f) => f._id === activeFunctionId);
      if (!exists) {
        const firstId = functions[0]._id;
        setActiveFunctionIdState(firstId);
        localStorage.setItem(ACTIVE_FUNCTION_KEY, firstId);
      }
    } else {
      setActiveFunctionIdState(null);
      localStorage.removeItem(ACTIVE_FUNCTION_KEY);
    }
  }, [functions, activeFunctionId]);

  const setActiveFunctionId = (id: string) => {
    setActiveFunctionIdState(id);
    localStorage.setItem(ACTIVE_FUNCTION_KEY, id);
  };

  const createMutation = useMutation({
    mutationFn: createFunctionApi,
    onSuccess: (newFunc) => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
      setActiveFunctionId(newFunc._id);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FunctionItem> }) =>
      updateFunctionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFunctionApi,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['functions'] });
      if (activeFunctionId === deletedId) {
        localStorage.removeItem(ACTIVE_FUNCTION_KEY);
        setActiveFunctionIdState(null);
      }
    },
  });

  const activeFunction = functions.find((f) => f._id === activeFunctionId) || null;

  return (
    <FunctionContext.Provider
      value={{
        activeFunctionId,
        activeFunction,
        functions,
        isLoading,
        setActiveFunctionId,
        createFunction: (data) => createMutation.mutateAsync(data),
        updateFunction: (id, data) => updateMutation.mutateAsync({ id, data }),
        deleteFunction: (id) => deleteMutation.mutateAsync(id),
      }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export const useFunction = (): FunctionContextType => {
  const context = useContext(FunctionContext);
  if (!context) {
    throw new Error('useFunction must be used within a FunctionProvider');
  }
  return context;
};
