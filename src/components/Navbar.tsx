
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      setIsLoggedIn(event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED');
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        </nav>

        {/* Desktop buttons */}
        <div className="ml-4 hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Post a Job</Link>
              </Button>
            </>
          )}
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
            </nav>

            <div className="flex flex-col gap-2 mt-2">
              {isLoggedIn ? (
                <>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full"
                    asChild
                  >
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      Post a Job
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
