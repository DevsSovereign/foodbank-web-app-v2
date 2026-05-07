import React, { useState } from "react";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: { houseNumber: string; landmark: string; stateLocation: string }) => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ isOpen, onClose, onSave }) => {
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [stateLocation, setStateLocation] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ houseNumber, landmark, stateLocation });
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[20px] font-bold text-gray-800">Customer Detail</h2>
            <span className="text-[#ff6b6b] text-sm font-medium">Enter Correct Details*</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="House/Flat Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-md text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#8cc629] focus:ring-1 focus:ring-[#8cc629] transition-all"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Landmark (Optional)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-md text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#8cc629] focus:ring-1 focus:ring-[#8cc629] transition-all"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="State"
                value={stateLocation}
                onChange={(e) => setStateLocation(e.target.value)}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-md text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#8cc629] focus:ring-1 focus:ring-[#8cc629] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!houseNumber || !stateLocation}
                className={`w-full py-4 rounded-lg font-bold text-[14px] transition-colors ${
                  !houseNumber || !stateLocation
                    ? "bg-[#e8e8e8] text-white cursor-not-allowed"
                    : "bg-[#8cc629] hover:bg-[#7db424] text-white"
                }`}
              >
                Save and Proceed to Checkout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
