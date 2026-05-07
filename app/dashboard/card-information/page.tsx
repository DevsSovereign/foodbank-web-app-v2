"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

interface Card {
  id: string;
  cardType: string;
  cardNumber: string;
  expireDate: string;
  cvc: string;
  name: string;
}

export default function CardInformationPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      cardType: "Visa",
      cardNumber: "5758 4899 **** ****",
      expireDate: "12/27",
      cvc: "123",
      name: "Frank Donald",
    },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("Frank Donald"); // Defaulting to user's name

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < val.length; i += 4) {
      if (i > 0) formatted += " ";
      formatted += val.substring(i, i + 4);
    }
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpireDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setExpireDate(val.substring(0, 5));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, "").substring(0, 4));
  };

  // Actions
  const handleAddClick = () => {
    setEditingId(null);
    setCardType("");
    setCardNumber("");
    setExpireDate("");
    setCvc("");
    setName("Frank Donald");
    setView("form");
  };

  const handleEditClick = (card: Card) => {
    setEditingId(card.id);
    setCardType(card.cardType);
    setCardNumber(card.cardNumber);
    setExpireDate(card.expireDate);
    setCvc(card.cvc);
    setName(card.name);
    setDropdownOpen(null);
    setView("form");
  };

  const handleDeleteClick = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
    setDropdownOpen(null);
  };

  const handleSave = () => {
    if (!cardNumber || !expireDate) return; // Basic validation

    if (editingId) {
      setCards(
        cards.map((c) =>
          c.id === editingId
            ? {
                id: editingId,
                cardType: cardType || "Visa",
                cardNumber,
                expireDate,
                cvc,
                name,
              }
            : c,
        ),
      );
    } else {
      setCards([
        ...cards,
        {
          id: Date.now().toString(),
          cardType: cardType || "Visa",
          cardNumber,
          expireDate,
          cvc,
          name,
        },
      ]);
    }
    setView("list");
  };

  // Mask card number for display
  const getMaskedCardNumber = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.length <= 8) return num;
    const first8 = cleanNum.substring(0, 8);
    return `${first8.substring(0, 4)} ${first8.substring(4, 8)} **** ****`;
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[400px]">
      {view === "list" ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              PAYMENT METHOD
            </h2>
            <button
              onClick={handleAddClick}
              className="text-[#f97316] font-medium text-sm hover:text-[#ea580c] transition-colors"
            >
              Add Card +
            </button>
          </div>

          <div className="space-y-6">
            {cards.length === 0 ? (
              <p className="text-gray-500 text-sm">No cards saved yet.</p>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="flex items-center gap-4">
                  {/* Card Display */}
                  <div className="w-full max-w-[320px] bg-gradient-to-r from-[#2a9d5c] to-[#8cc629] rounded-2xl p-6 text-white shadow-md">
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-medium tracking-wide">{card.name}</span>
                      <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        {card.cardType || "Visa"}
                      </span>
                    </div>
                    <div className="text-xl tracking-widest font-medium mb-8">
                      {getMaskedCardNumber(card.cardNumber)}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase opacity-80 mb-1 tracking-wider">
                          Expiry Date
                        </p>
                        <p className="text-sm font-medium">{card.expireDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="relative" ref={dropdownOpen === card.id ? dropdownRef : null}>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === card.id ? null : card.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {dropdownOpen === card.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-36 z-20">
                        <button
                          onClick={() => handleEditClick(card)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit Card
                        </button>
                        <button
                          onClick={() => handleDeleteClick(card.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete Card
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-8">
            {editingId ? "EDIT CARD INFORMATION" : "ADD CARD INFORMATION"}
          </h2>

          <form className="space-y-6">
            {/* Card Type */}
            <div>
              <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-2">
                Card Type
              </label>
              <input
                type="text"
                id="cardType"
                placeholder="e.g. Visa, Mastercard"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all"
              />
            </div>

            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all"
              />
            </div>

            {/* Expire Date and CVC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="expireDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expire Date
                </label>
                <input
                  type="text"
                  id="expireDate"
                  placeholder="MM/YY"
                  value={expireDate}
                  onChange={handleExpireDateChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="password"
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={handleCvcChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!cardNumber || !expireDate}
                className="bg-[#8cc629] hover:bg-[#7db424] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-lg font-bold text-sm transition-colors w-full md:w-auto"
              >
                {editingId ? "Save Changes" : "Add Card"}
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-3.5 rounded-lg font-bold text-sm transition-colors w-full md:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
