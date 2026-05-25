import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white pt-12 pb-8 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 pr-8">
          <Image
            src="/assets/foodbank-logo-4-1.png"
            alt="FoodBank Logo"
            width={150}
            height={40}
            className="object-contain mb-4"
          />
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Our mission is to empower individuals with accessible, flexible food loans to promote
            financial wellness and ensure everyone has access to nutritious meals.{" "}
            <span className="text-orange-500">
              FoodBank is a product of Sovereign Technology and Innovations Limited.
            </span>
          </p>
          <div className="flex gap-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">EMAIL</h4>
              <p className="text-sm">info@foodbank4u.com</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-1">PHONE</h4>
              <p className="text-sm">+2349159665799</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
                Home
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to our newsletter for the latest updates, stories, and ways you can help make
            a difference in our community.
          </p>
          <div className="flex gap-2 mb-8">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white text-black px-3 py-2 rounded-md text-sm w-full outline-none focus:ring-2 focus:ring-[#21a84f]"
            />
            <button className="bg-[#21a84f] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition">
              Subscribe
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Social links:</h3>
          <div className="flex space-x-3 mb-6">
            <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
              <Facebook className="size-4 fill-current" />
            </div>
            <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer hover:bg-orange-600 transition">
              <Instagram className="size-4" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Download our Mobile App</h4>
            <div className="flex flex-wrap lg:flex-nowrap gap-3">
              <a
                href="https://apps.apple.com/ng/app/foodbankapp/id6608982689"
                target="_blank"
                className="flex items-center bg-[#2a2a2a] rounded-lg px-4 py-2.5 hover:bg-[#3a3a3a] transition cursor-pointer whitespace-nowrap"
              >
                <Image
                  src="/assets/apple-negative-1.svg"
                  alt="Apple logo"
                  width={20}
                  height={24}
                  className="w-5 h-6 object-contain"
                />
                <div className="ml-2.5">
                  <p className="text-[10px] text-gray-300 leading-tight">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.foodbank4u.app"
                target="_blank"
                className="flex items-center bg-[#2a2a2a] rounded-lg px-4 py-2.5 hover:bg-[#3a3a3a] transition cursor-pointer whitespace-nowrap"
              >
                <Image
                  src="/assets/icon-google-play-1.svg"
                  alt="Google Play logo"
                  width={20}
                  height={24}
                  className="w-5 h-6 object-contain"
                />
                <div className="ml-2.5">
                  <p className="text-[10px] text-gray-300 leading-tight">Download on the</p>
                  <p className="text-sm font-semibold text-white leading-tight">Google play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {year} Foodbank. All Rights Reserved | Powered by:{" "}
        <span className="text-orange-500">Sovereign Tech and Innovations</span>
      </div>
    </footer>
  );
}
