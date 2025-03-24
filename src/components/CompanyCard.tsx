
import { Link } from "react-router-dom";
import { Globe, MapPin, Users } from "lucide-react";
import { Company } from "@/lib/types";
import { getCompanyLogo } from "@/lib/utils";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Link 
      to={`/company/${company.id}`}
      className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2 border border-border/50">
          <img 
            src={getCompanyLogo(company.logo)} 
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
  );
};

export default CompanyCard;
