
import { Company } from "@/lib/types";
import { Link } from "react-router-dom";
import { Building, Globe, Users } from "lucide-react";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Link 
      to={`/company/${company.id}`}
      className="block apple-card p-6 hover:translate-y-[-2px] transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 p-2">
          <img 
            src={company.logo} 
            alt={`${company.name} logo`} 
            className="h-full w-full object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg">{company.name}</h3>
          
          <p className="text-muted-foreground mt-1 line-clamp-2">
            {company.description}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{company.industry}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{company.size}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{company.headquarters}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
