
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, MapPin, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Company } from "@/lib/types";
import { fetchCompanies } from "@/services/supabaseService";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCompanies();
        setCompanies(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setError("Failed to load companies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className="text-muted-foreground mb-8">Browse all companies and explore their open positions</p>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
            <h3 className="text-xl font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              There are currently no companies listed.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link 
                key={company.id} 
                to={`/company/${company.id}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2 border border-border/50">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`} 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-medium">{company.name}</h2>
                    <p className="text-muted-foreground text-sm mb-3">{company.industry}</p>
                    
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span>{company.headquarters}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-primary/70" />
                        <span>{company.size}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-primary/70" />
                        <span>{company.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Companies;
