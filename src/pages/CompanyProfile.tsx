
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Company, Job } from "@/lib/types";
import { getCompanyById, getJobsByCompany } from "@/data/mockData";
import { 
  Building, 
  Globe, 
  Users, 
  Calendar, 
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      if (id) {
        const foundCompany = getCompanyById(id);
        if (foundCompany) {
          setCompany(foundCompany);
          const companyJobs = getJobsByCompany(id);
          setJobs(companyJobs);
        }
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="h-64 rounded-xl bg-gray-100 animate-pulse mb-4" />
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 text-center">
          <h1 className="text-3xl font-medium mb-4">Company Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
        
        <div className="apple-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="h-32 w-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 p-4">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="h-full w-full object-contain"
              />
            </div>
            
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h1 className="text-3xl font-medium mb-2">{company.name}</h1>
              
              <p className="text-muted-foreground mb-6 max-w-3xl">
                {company.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center md:items-start gap-1">
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Industry</span>
                  </div>
                  <span className="font-medium">{company.industry}</span>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-1">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Company Size</span>
                  </div>
                  <span className="font-medium">{company.size}</span>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-1">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Founded</span>
                  </div>
                  <span className="font-medium">{company.founded}</span>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-1">
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Headquarters</span>
                  </div>
                  <span className="font-medium">{company.headquarters}</span>
                </div>
              </div>
              
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button>
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-medium mb-6">
            {jobs.length} Open Positions at {company.name}
          </h2>
          
          {jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="apple-card p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No open positions</h3>
              <p className="text-muted-foreground">
                {company.name} doesn't have any open positions at the moment.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompanyProfile;
