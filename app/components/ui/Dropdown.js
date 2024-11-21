"use client";

const Dropdown = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-40 py-1 ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default Dropdown;
