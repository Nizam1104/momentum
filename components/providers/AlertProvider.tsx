// context/alert-context.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AlertModal, AlertModalProps } from '@/components/global/AlertModal'

// Define the options for showing an alert
interface AlertOptions {
    title: string;
    type: AlertModalProps['type']; // Re-use type definition from AlertModalProps
    text: string;
}

// Define the shape of the context value
interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

// Create the context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// AlertProvider component
export function AlertProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [alertContent, setAlertContent] = useState<AlertOptions>({
        title: '',
        type: 'info',
        text: '',
    });

    // Function to show the alert
    const showAlert = useCallback((options: AlertOptions) => {
        setAlertContent(options);
        setIsOpen(true);
    }, []);

    // Function to hide the alert
    const hideAlert = useCallback(() => {
        setIsOpen(false);
        // Optionally, clear content after closing if you want to reset it
        // setAlertContent({ title: '', type: 'info', text: '' });
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {/* The AlertModal is rendered here, controlled by the provider's state */}
            <AlertModal
                isOpen={isOpen}
                onClose={hideAlert}
                title={alertContent.title}
                type={alertContent.type}
                text={alertContent.text}
            />
        </AlertContext.Provider>
    );
}

// Custom hook to use the alert functionality
export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}
