import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; 
import api from '../api/axios';

export const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); 

    const refreshFolders = async () => {
        if (!user) {
            setFolders([]);
            return;
        }
        setLoading(true);
        try {
            const response = await api.get('/api/folders');
            setFolders(response.data);
        } catch (err) {
            console.error("Error fetching folders:", err);
        } finally {
            setLoading(false);
        }
    };

    const createFolder = async (name) => {
        try {
            const res = await api.post('/api/folders', {name});
            setFolders(prev => [...prev, res.data]);
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || 'Failed to create folder';
        }
    };

    const getFolderName = (id) => {
        const folder = folders.find(f => f._id === id);
        return folder ? folder.name : "Unknown Folder";
    };

    const renameFolder = async (folderId, newName) => {
        try {
            const res = await api.patch(`/api/folders/${folderId}`, {name: newName});
            setFolders(prev => prev.map(folder => folder._id === folderId ? {...folder, name: res.data.name} : folder));
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Rename failed";
        }
    };

    const addRecipeToFolder = async (folderId, recipeId) => {
        try {
            const res = await api.patch(`/api/folders/${folderId}/recipes`, { recipeId });
            setFolders(prev => prev.map(folder => folder._id === folderId ? res.data : folder));
            return res.data;
        } catch (err) {
            throw err.response?.data?.message || "Could not add recipe to folder";
        }
    };

    const removeRecipeFromFolder = async (folderId, recipeId) => {
        try {
            await api.patch(`/api/folders/${folderId}/recipes/${recipeId}`);
            setFolders(prev => prev.map(folder => {
                if (folder._id === folderId) {
                    return {
                        ...folder,
                        recipeIds: folder.recipeIds.filter(id => 
                            (typeof id === 'string' ? id : id._id) !== recipeId
                        )
                    };
                }
                return folder;
            }));
        } catch (err) {
            console.error("Remove failed:", err);
            throw err.response?.data?.message || "Could not remove recipe";
        }
    };

    const deleteFolder = async (folderId) => {
        try {
            await api.delete(`/api/folders/${folderId}`);
            setFolders(prev => prev.filter(folder => folder._id !== folderId));
        } catch (err) {
            throw err.response?.data?.message || 'Failed to delete folder';
        }
    };

    useEffect(() => {
        refreshFolders();
    }, [user]);

    return (
        <FolderContext.Provider value={{ folders, loading, refreshFolders, createFolder, getFolderName, renameFolder, addRecipeToFolder, removeRecipeFromFolder, deleteFolder }}>
            {children}
        </FolderContext.Provider>
    );
};

export const useFolders = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error('useFolders must be used with a FolderProvider');
    }
    return context;
};