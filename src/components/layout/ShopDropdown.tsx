"use client";

import { useState, useRef, useEffect } from "react";

const shops = [
  {
    label: "Bonfire Apparel",
    href: "https://www.bonfire.com/store/gig-harbor-womens-co-op/",
  },
  {
    label: "GHWC Store",
    href: "https://gig-harbor-womens-co-op.square.site/",
  },
];

export default function ShopDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 flex items-center gap-1"
      >
        Our Shops
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 bg-offwhite rounded-xl shadow-lg border border-foreground/5 py-2 min-w-[180px]">
          {shops.map((shop) => (
            <a
              key={shop.href}
              href={shop.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              {shop.label}
              <svg
                className="w-3 h-3 ml-auto opacity-40"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M1 11L11 1M11 1H4M11 1v7" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
