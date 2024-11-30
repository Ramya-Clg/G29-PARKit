import React, { useEffect, useState } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Separate Button component
const Button = ({ children, variant, size, onClick, className, ...props }) => (
  <button
    className={`
      px-6 py-3 
      rounded-md 
      transition-all duration-300 ease-in-out
      ${variant === "ghost" ? "hover:bg-gray-100" : ""}
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
const NavItem = ({ name, href, className, onClick }) => {
  const handleClick = (e) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      if (href === "/#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const sectionId = href.replace("/#", "");
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (onClick) onClick();
    }
  };

  return (
    <Link
      to={href}
      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
      className={`px-4 py-2 text-lg hover:text-[var(--text-primary)] hover:bg-[var(--text-light)] rounded-md ${className}`}
      onClick={handleClick}
    >
      {name}
    </Link>
  );
};

// Logo Component
const Logo = () => (
  <Link to="/" className="flex-shrink-0 flex items-center">
    <img src="../LOGO.svg" alt="Logo" className="h-30 w-auto ml-11 sm:h-10" />
  </Link>
);

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? "bg-[var(--background-primary)] shadow-lg"
            : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                {...item}
                className={`text-[var(--text-primary)]`}
              />
            ))}
            {isLoggedIn && (
              <Link
                to="/profile"
                className={`px-4 py-2 text-lg font-medium hover:bg-[var(--text-light)] rounded-md
                                text-[var(--text-primary)]`}
              >
                Profile
              </Link>
            )}
          </div>

          {/* Desktop Book Now and Auth Buttons */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button
              onClick={handleBookNow}
              className={`flex justify-center items-center
                            ${
                              isScrolled
                                ? "bg-[var(--text-secondary)] text-[var(--text-primary)]"
                                : "bg-[var(--text-secondary)] text-[var(--text-primary)]"
                            }`}
            >
              BOOK
            </Button>
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                className={`flex items-center space-x-2
                  bg-[var(--text-secondary)] text-[var(--text-light)]`}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                className={`flex items-center space-x-2
                  ${
                    isScrolled
                      ? "bg-[var(--text-secondary)] text-[var(--text-primary)]"
                      : "bg-[var(--text-secondary)] text-[var(--text-primary)]"
                  }`}
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
              className={
                isScrolled
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-light)]"
              }
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
          bg-[var(--text-light)]
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
              className="block px-4 py-2 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--text-light)] rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          )}
          <div className="pt-2 space-y-2">
            <Button
              className="w-full bg-[var(--text-secondary)] text-[var(--text-light)]"
              onClick={handleBookNow}
            >
              BOOK NOW
            </Button>
            {isLoggedIn ? (
              <Button
                className="w-full flex items-center justify-center space-x-2 bg-[var(--text-secondary)] text-[var(--text-light)]"
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
                className="w-full flex items-center justify-center space-x-2 bg-[var(--text-secondary)] text-[var(--text-light)]"
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
