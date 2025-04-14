'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for a breadcrumb item
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

// Define the context type
interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (index: number) => void;
  clearItems: () => void;
  replaceItems: (items: BreadcrumbItem[]) => void;
}

// Create the context with default values
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Props for the BreadcrumbProvider component
interface BreadcrumbProviderProps {
  children: ReactNode;
  initialItems?: BreadcrumbItem[];
}

export function BreadcrumbProvider({ 
  children, 
  initialItems = [] 
}: BreadcrumbProviderProps) {
  const [items, setItems] = useState<BreadcrumbItem[]>(initialItems);

  // Add a new breadcrumb item to the end of the list
  const addItem = (item: BreadcrumbItem) => {
    setItems(prev => [...prev, item]);
  };

  // Remove a breadcrumb item by index
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all breadcrumb items
  const clearItems = () => {
    setItems([]);
  };

  // Replace all breadcrumb items with a new array
  const replaceItems = (newItems: BreadcrumbItem[]) => {
    setItems(newItems);
  };

  // Create the context value object
  const contextValue: BreadcrumbContextType = {
    items,
    setItems,
    addItem,
    removeItem,
    clearItems,
    replaceItems
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Custom hook for using the breadcrumb context
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  
  return context;
} 