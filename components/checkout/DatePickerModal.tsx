import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPickupCalendar } from "@/lib/queries";
import { toLocalDateKey, toLocalMonthKey } from "@/functions/formatDate";
import type { PickupCalendarDay } from "@/types/cart";

interface CheckoutDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const CheckoutDatePickerModal: React.FC<CheckoutDatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const { data: pickupCalendar } = useGetPickupCalendar({
    month: toLocalMonthKey(currentMonth),
    enabled: isOpen,
  });

  /** `YYYY-MM-DD` → day, so each calendar cell can look up its availability. */
  const dayByDate = useMemo(() => {
    const map = new Map<string, PickupCalendarDay>();
    (pickupCalendar?.days ?? []).forEach((day) => map.set(day.date, day));
    return map;
  }, [pickupCalendar]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentMonth(new Date(selectedDate));
    } else if (isOpen) {
      setCurrentMonth(new Date());
    }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  /** Availability comes solely from the calendar; unknown days stay disabled. */
  const isDateDisabled = (date: Date) => {
    const dayInfo = dayByDate.get(toLocalDateKey(date));
    if (!dayInfo) return true;

    return !dayInfo.isOpen || !dayInfo.isSelectable;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelectDate(date);
      onClose();
    }
  };

  const renderHeader = () => {
    const monthName = currentMonth.toLocaleString("default", { month: "long" });
    const year = currentMonth.getFullYear();
    // Nothing bookable before today, so there is nowhere to go back to.
    const canGoBack = !isSameMonth(currentMonth, new Date());

    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold text-gray-800">{monthName}</span>
          <span className="text-[20px] font-bold text-gray-800">{year}</span>
        </div>
        <div className="flex items-center gap-2">
          {canGoBack && (
            <button onClick={prevMonth} className="text-gray-500 hover:text-gray-800 transition p-1">
              <ChevronLeft className="size-4" />
            </button>
          )}
          <button onClick={nextMonth} className="text-gray-500 hover:text-gray-800 transition p-1">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    // Assuming week starts on Monday (1) to Sunday (0)
    let day = startDate.getDay();
    if (day === 0) day = 7; // Convert Sunday from 0 to 7 to make Monday 1
    startDate.setDate(startDate.getDate() - (day - 1)); // Go back to Monday

    const endDate = new Date(monthEnd);
    let endDay = endDate.getDay();
    if (endDay === 0) endDay = 7;
    endDate.setDate(endDate.getDate() + (7 - endDay)); // Go forward to Sunday

    const rows = [];
    let days = [];
    const dayCursor = new Date(startDate);

    while (dayCursor <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = dayCursor.getDate().toString();
        const cloneDay = new Date(dayCursor);

        const isCurrentMonth = cloneDay.getMonth() === currentMonth.getMonth();
        const disabled = isDateDisabled(cloneDay);
        const isSelected =
          selectedDate &&
          cloneDay.getDate() === selectedDate.getDate() &&
          cloneDay.getMonth() === selectedDate.getMonth() &&
          cloneDay.getFullYear() === selectedDate.getFullYear();

        days.push(
          <div
            key={cloneDay.toISOString()}
            onClick={() => handleDateClick(cloneDay)}
            className={`
                            h-10 flex items-center justify-center text-[13px] rounded-sm transition-colors
                            ${disabled ? "text-gray-300 opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                            ${!isCurrentMonth ? "text-gray-300" : "text-gray-800 font-medium"}
                            ${isSelected && !disabled ? "bg-[#8cc629] text-white! hover:bg-[#8cc629]" : ""}
                        `}
          >
            <span>{formattedDate}</span>
          </div>,
        );

        dayCursor.setDate(dayCursor.getDate() + 1);
      }
      rows.push(
        <div key={dayCursor.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-85 p-8 overflow-hidden">
        {renderHeader()}
        {renderCells()}
      </div>
    </div>
  );
};

export default CheckoutDatePickerModal;
