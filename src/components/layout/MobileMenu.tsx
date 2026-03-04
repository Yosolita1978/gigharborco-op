"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

export default function MobileMenu({
  navItems,
  shopLinks,
}: {
  navItems: NavItem[];
  shopLinks: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function close() {
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-offwhite shadow-lg border-t border-gray-100">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "text-teal bg-mint/30"
                    : "text-foreground hover:text-teal hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <hr className="my-2 border-gray-100" />

            <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-foreground/40">
              Our Shops
            </p>
            {shopLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="py-3 px-4 rounded-lg text-base font-medium text-foreground hover:text-teal hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                {item.label}
                <svg
                  className="w-3.5 h-3.5 opacity-40"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 11L11 1M11 1H4M11 1v7" />
                </svg>
              </a>
            ))}

            <hr className="my-2 border-gray-100" />

            <Link
              href="/login"
              onClick={close}
              className="bg-teal text-white text-center font-semibold rounded-full px-5 py-3 hover:bg-teal-dark transition-colors"
            >
              Member Login
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
