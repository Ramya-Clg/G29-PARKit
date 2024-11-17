import React, { useEffect, useState } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import logo from "../../public/logo.svg";
import { useNavigate, Link } from "react-router-dom";

// Separate Button component
const Button = ({ children, variant, size, onClick, className, ...props }) => (
  <button
    className={`
            px-6 py-3 
            rounded-md 
            ${variant === "ghost" ? "hover:bg-gray-100" : "bg-[#5B8F8F] text-white hover:bg-[#4A7A7A]"}
            ${size === "icon" ? "p-2" : ""}
            ${className}
        `}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Navigation Items Component
const NavItem = ({ name, href, className, onClick }) => (
  <a
    href={href}
    className={`px-4 py-2 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md ${className}`}
    onClick={onClick}
  >
    {name}
  </a>
);

// Logo Component
const Logo = () => (
  <a href="/" className="flex-shrink-0 flex items-center">
    <img src={logo} alt="Logo" className="h-30 w-auto ml-11 sm:h-10" />
  </a>
);

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on mount and token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const handleBookNow = () => navigate("/booking");
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow overflow-hidden z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <NavItem key={item.name} {...item} />
            ))}
            {isLoggedIn && (
              <Link
                to="/profile"
                className="px-4 py-2 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Profile
              </Link>
            )}
          </div>

          {/* Desktop Book Now and Auth Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button
              onClick={handleBookNow}
              className="flex justify-center items-center"
            >
              BOOK
            </Button>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
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
        className={`
          sm:hidden 
          ${isMobileMenuOpen ? "block" : "hidden"}
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="px-4 pt-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              {...item}
              className="block"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
          {isLoggedIn && (
            <Link
              to="/profile"
              className="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          )}
          <div className="pt-2 space-y-2">
            <Button className="w-full" onClick={handleBookNow}>
              BOOK NOW
            </Button>
            {isLoggedIn ? (
              <Button
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
