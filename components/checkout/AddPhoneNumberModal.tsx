import React, { FormEvent, useState } from "react";

interface AddPhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phoneNumber: string) => void;
}

const AddPhoneNumberModal: React.FC<AddPhoneNumberModalProps> = ({ isOpen, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(`+234${phoneNumber}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-100 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[20px] font-bold text-gray-800">Add Phone Number</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2 w-full">
              <div className="relative flex items-center">
                <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-800 font-medium text-[14px]">+234</span>
                  <div className="h-5 w-px bg-gray-300 ml-3"></div>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  maxLength={10}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-17.5 pr-4 py-3.5 border border-gray-200 rounded-md text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#8cc629] focus:ring-1 focus:ring-[#8cc629] transition-all"
                  required
                />
              </div>

              <div className="bg-[#fff5f5] text-[#ff8080] p-1 rounded-md text-sm font-medium w-full">
                Enter your number without the first zero
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4 rounded-lg font-bold text-[14px] transition-colors"
              >
                Save Phone Number
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPhoneNumberModal;
