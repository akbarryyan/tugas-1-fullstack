import { useState, useEffect } from "react";

export const useLocalStorageListener = (key) => {
  const [storageValue, setStorageValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setStorageValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
          setStorageValue(null);
        }
      }
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab changes
    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setStorageValue(e.detail.newValue);
      }
    };

    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange
      );
    };
  }, [key]);

  return storageValue;
};

// Helper function to trigger custom storage change event
export const triggerStorageChange = (key, newValue) => {
  const event = new CustomEvent("localStorageChange", {
    detail: { key, newValue },
  });
  window.dispatchEvent(event);
};
