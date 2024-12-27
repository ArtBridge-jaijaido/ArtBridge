import React, {createContext, useState, useContext} from "react";
import ToastMessage from "@/components/ToastMsg.js";


const ToastContext = createContext();

export const useToast = () => useContext(ToastContext); 

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
  
    const addToast = (type, message, duration = 3000) => {
      const id = Date.now(); 
      setToasts((prevToasts) => [...prevToasts, { id, type, message, duration }]);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    };
  
    const removeToast = (id) => { 
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)); 
    };
  
    return (
      <ToastContext.Provider value={{ addToast }}>
        {children}
        <div className="toast-container">
          {toasts.map((toast) => (
            <ToastMessage
              key={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </ToastContext.Provider>
    );
  };