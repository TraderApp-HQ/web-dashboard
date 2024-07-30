import clsx from "clsx";
import { useEffect, useRef } from "react";
import CancelIcon from "../icons/CancelIcon";

export interface ModalOptions {
  children: React.ReactNode;
  openModal?: boolean;
  onClose: () => void;
  width?: string;
  title?: string;
  description?: string;
}

export default function ({ children, openModal, onClose, width, title, description }: ModalOptions) {
  function close() {
    if (onClose) {
      onClose();
    }
  }

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close && close();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [close]);

  return (
    <div
      className={clsx(
        "overflow-y-auto overflow-x-hidden bg-gray-600 bg-opacity-70 flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full",
        openModal ? "" : "hidden",
      )}
    >
      <div ref={ref} className={clsx("w-full relative max-w-4xl max-h-full p-4", width)}>
        <div className="bg-white relative rounded-xl py-6 px-8 shadow">
          <div className="flex items-center justify-between py-4 rounded-t">
            <div className="space-y-3 flex-col">
              <p className="text-xl font-semibold text-[#414141]">{title}</p>
              <p className="text-[12px] text-[#BEBFC1]">{description}</p>
            </div>
            <div className="cursor-pointer" onClick={close}>
              <CancelIcon />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
