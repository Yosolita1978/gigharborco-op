import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import ShopDropdown from "./ShopDropdown";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Story", href: "/our-story" },
  { label: "Orientation", href: "/orientation" },
  { label: "Volunteer", href: "/volunteer-opportunities" },
  { label: "Events", href: "/events" },
  { label: "Newsletters", href: "/newsletters" },
  { label: "Contact", href: "/contact" },
];

const shopLinks = [
  {
    label: "Bonfire Apparel",
    href: "https://www.bonfire.com/store/gig-harbor-womens-co-op/",
  },
  {
    label: "GHWC Store",
    href: "https://gig-harbor-womens-co-op.square.site/",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-offwhite/90 backdrop-blur-md border-b border-foreground/5">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/ghwc-logo.png"
            alt="Gig Harbor Women's Co-Op"
            width={48}
            height={48}
            className="w-11 h-11 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden sm:block font-semibold text-foreground tracking-tight">
            Gig Harbor Women&apos;s Co-Op
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
          <ShopDropdown />
          <Link
            href="/login"
            className="ml-2 bg-teal text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/20 transition-all duration-300"
          >
            Member Login
          </Link>
        </nav>

        <MobileMenu navItems={navItems} shopLinks={shopLinks} />
      </div>
    </header>
  );
}
