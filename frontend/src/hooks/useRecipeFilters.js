import { useState, useCallback } from 'react';

const useRecipeFilters = (initialState) => {
  const [filters, setFilters] = useState(initialState);

  const updateField = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const toggleArrayItem = useCallback((field, value) => {
    setFilters((prev) => {
      const currentArray = prev[field] || [];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [field]: isSelected
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  }, []);

  const resetFilters = () => setFilters(initialState);

  return {
    filters,
    updateField,
    toggleArrayItem,
    resetFilters,
  };
};

export default useRecipeFilters;