
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import { Company, Job } from "@/lib/types";
import { fetchCompanyById, fetchJobsByCompany } from "@/services/supabaseService";
import { getCompanyLogo } from "@/lib/utils";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!id) {
        setError("Company ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching company with ID:", id);

        // Fetch company details
        const companyData = await fetchCompanyById(id);
        console.log("Company data received:", companyData);

        if (!companyData) {
          setError("Company not found");
          return;
        }

        setCompany(companyData);

        // Fetch jobs for this company
        const companyJobs = await fetchJobsByCompany(id);
        console.log("Company jobs received:", companyJobs);
        setJobs(companyJobs);

        setError(null);
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 text-center">
          <h2 className="text-2xl font-medium mb-4">{error || "Company not found"}</h2>
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
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-3 border border-border/50">
              <img 
                src={getCompanyLogo(company.logo)} 
                alt={`${company.name} logo`} 
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold">{company.name}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-primary/70" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span>{company.headquarters}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary/70" />
                  <span>{company.size}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  <span>Founded in {company.founded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-4">About {company.name}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{company.description}</p>

              <Separator className="my-6" />

              <div>
                <h2 className="text-xl font-medium mb-4">Company Details</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                    <p>{company.industry}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Company Size</h3>
                    <p>{company.size}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Founded</h3>
                    <p>{company.founded}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Headquarters</h3>
                    <p>{company.headquarters}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-4">Company Website</h2>
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Company Jobs */}
        <div className="mt-8">
          <h2 className="text-2xl font-medium mb-6">
            {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} at {company.name}
          </h2>

          {jobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
              <h3 className="text-xl font-medium mb-2">No open positions</h3>
              <p className="text-muted-foreground">
                There are currently no job openings at {company.name}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
