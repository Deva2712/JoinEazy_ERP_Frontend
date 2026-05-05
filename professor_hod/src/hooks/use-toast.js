import { useState, useCallback } from "react";

const toasts = [];
let toastCount = 0;

export function useToast() {
  const [, setToasts] = useState(toasts);

  const toast = useCallback(
    ({ ...props }) => {
      const id = (++toastCount).toString();
      const newToast = {
        ...props,
        id,
      };
      
      toasts.push(newToast);
      setToasts([...toasts]);

      setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index > -1) {
          toasts.splice(index, 1);
          setToasts([...toasts]);
        }
      }, 5000);

      return {
        id,
        dismiss: () => {
          const index = toasts.findIndex((t) => t.id === id);
          if (index > -1) {
            toasts.splice(index, 1);
            setToasts([...toasts]);
          }
        },
      };
    },
    []
  );

  return {
    toast,
    toasts,
  };
}
