import { useSearchParams } from 'react-router-dom';

export const useRecipeFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Parse URL into a clean object
    const filters = {
        search: searchParams.get('search') || '',
        folderId: searchParams.get('folderId') || '',
        spirits: searchParams.get('spirits')?.split(',').filter(Boolean) || [],
        flavors: searchParams.get('flavors')?.split(',').filter(Boolean) || [],
        cocktailType: searchParams.get('cocktailType')?.split(',').filter(Boolean) || [],
        spiritsMatch: searchParams.get('spiritsMatch') || 'all',
        flavorsMatch: searchParams.get('flavorsMatch') || 'all',
    };

    // 2. Helper to update the URL
    const setFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        
        Object.entries(newFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(','));
                else params.delete(key);
            } else if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    };

    return { filters, setFilters };
};