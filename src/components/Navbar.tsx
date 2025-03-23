
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M20 7h-9" />
            <path d="M14 17H5" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
          </svg>
          <span className="text-xl font-medium">JobBoard</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="ml-auto md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Jobs
          </Link>
          <Link to="/companies" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            Companies
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            About
          </Link>
        </nav>

        {/* Desktop buttons */}
        <div className="ml-4 hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm">Sign In</Button>
          <Button size="sm">Post a Job</Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4 px-4 sm:px-6 flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                to="/companies" 
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="outline" size="sm" className="w-full">Sign In</Button>
              <Button size="sm" className="w-full">Post a Job</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
