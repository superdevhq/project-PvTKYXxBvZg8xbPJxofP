
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
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
        
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
        
        <div className="ml-4 flex items-center gap-2">
          <Button variant="outline" size="sm">Sign In</Button>
          <Button size="sm">Post a Job</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
