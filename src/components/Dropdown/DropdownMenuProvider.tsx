import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface DropdownMenuContextProps {
  isOpen: boolean;
  toggle: () => void;
  ref: React.RefObject<HTMLDivElement>;
  positionRef: React.RefObject<HTMLDivElement>;
  position: { top: number; left: number };
}

const DropdownMenuContext = createContext<DropdownMenuContextProps | undefined>(undefined);

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenuProvider");
  }
  return context;
};

export const DropdownMenuProvider: React.FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      setPosition({
        top: rect.top + rect.height + 10 <= windowHeight ? rect.top + rect.height + 10 : rect.top - 10,
        left: rect.left + rect.width + 10 <= windowWidth ? rect.left + rect.width + 10 : rect.left - 10,
      });
    }
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, toggle, ref, positionRef, position }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};
