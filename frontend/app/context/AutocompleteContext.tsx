"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AutocompleteContextType {
    activeId: string | null;
    requestFocus: (id: string) => void;
    releaseFocus: () => void;
}

// Initialize the context with a default value
const AutocompleteContext = createContext<AutocompleteContextType>({
    activeId: null,
    requestFocus: () => {},
    releaseFocus: () => {},
});

// Custom hook to use the autocomplete context
export const useAutocomplete = () => useContext(AutocompleteContext);

interface AutocompleteProviderProps {
    children: ReactNode;
}

// Provider component
export const AutocompleteProvider: React.FC<AutocompleteProviderProps> = ({ children }) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const requestFocus = (id: string) => {
        setActiveId(id);
    };

    const releaseFocus = () => {
        setActiveId(null);
    };

    return (
        <AutocompleteContext.Provider value={{ activeId, requestFocus, releaseFocus }}>
            {children}
        </AutocompleteContext.Provider>
    );
};
