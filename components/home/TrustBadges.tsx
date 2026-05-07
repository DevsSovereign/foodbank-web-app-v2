import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "FASTEST DELIVERY",
    subtitle: "Delivery in 24 hours",
  },
  {
    icon: RotateCcw,
    title: "24 HOURS RETURN",
    subtitle: "100% money-back guarantee",
  },
  {
    icon: ShieldCheck,
    title: "SECURE PAYMENT",
    subtitle: "Your money is safe",
  },
  {
    icon: Headphones,
    title: "SUPPORT 24/7",
    subtitle: "Live contact/message",
  },
];

export default function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-6">
      <div className="bg-white border border-gray-100 rounded-sm shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 py-6">
          {badges.map((badge, index) => (
            <div key={badge.title} className="flex items-center justify-center gap-4 px-4 py-2">
              <div className="flex items-center justify-center shrink-0">
                <badge.icon className="size-8 text-gray-500 stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[10px] font-bold text-gray-800 tracking-wide mb-0.5">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
