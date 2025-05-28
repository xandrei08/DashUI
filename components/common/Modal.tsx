import React from "react";
import { XMarkIcon } from "./Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  darkMode?: boolean; // darkMode prop is less critical if using semantic classes
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div
        className={`bg-card-default dark:bg-card-dark text-base-default dark:text-base-dark 
                    rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-lg 
                    transform transition-all border border-card-default dark:border-card-dark`} // Added border for more definition
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-base-default dark:text-base-dark">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full text-muted0-black dark:text-muted-dark hover:bg-element-default dark:hover:bg-element-dark transition-colors`}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>{" "}
        {/* Added max-height and scroll for long content */}
      </div>
    </div>
  );
};

export default Modal;
