import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Note {
    id: string;
    title: string;
    content: string;
    timestamp: number;
}

interface NotesContextValue {
    notes: Note[];
    saveNote: (id: string, title: string, content: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    getNote: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const STORAGE_KEY = '@notes_data';

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                setNotes(JSON.parse(data));
            } else {
                // Initial mock data
                const initialNotes: Note[] = [
                    {
                        id: '1',
                        title: 'Welcome to Pensieve',
                        content: 'This is a clean, frictionless note-taking app.',
                        timestamp: Date.now(),
                    }
                ];
                setNotes(initialNotes);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
            }
        } catch (e) {
            console.error('Failed to load notes', e);
        }
    };

    const saveNote = async (id: string, title: string, content: string) => {
        try {
            const existingParams = getNote(id);
            const newNote: Note = {
                id: id === 'new' ? Date.now().toString() : id,
                title,
                content,
                timestamp: Date.now(),
            };

            let updatedNotes;
            if (id === 'new' || !existingParams) {
                updatedNotes = [newNote, ...notes];
            } else {
                updatedNotes = notes.map(n => n.id === id ? newNote : n);
            }

            setNotes(updatedNotes);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
        } catch (e) {
            console.error('Failed to save note', e);
        }
    };

    const deleteNote = async (id: string) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    };

    const getNote = (id: string) => {
        return notes.find(n => n.id === id);
    };

    return (
        <NotesContext.Provider value={{ notes, saveNote, deleteNote, getNote }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error('useNotes must be used within a NotesProvider');
    return context;
};
