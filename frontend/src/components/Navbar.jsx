import React from "react";
import { Menu, X } from "lucide-react";
import logo from "../../public/logo.svg"; // Correct path for logo

const Button = ({ children, variant, size, onClick, className, ...props }) => (
  <button
    className={`px-6 py-3 rounded-md ${
      variant === "ghost"
        ? "hover:bg-gray-100"
        : "bg-[#5B8F8F] text-white hover:bg-[#4A7A7A]"
    } ${size === "icon" ? "p-2" : ""} ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow overflow-hidden z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="h-30 w-auto ml-11 sm:h-10" />
          </a>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Book Now Button */}
          <div className="hidden sm:flex">
            <Button>BOOK NOW</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="px-4 pt-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2">
            <Button className="w-full">BOOK NOW</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
