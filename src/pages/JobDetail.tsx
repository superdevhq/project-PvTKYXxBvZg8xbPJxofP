import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Job, Company } from "@/lib/types";
import { getJobById, getCompanyById } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
  BriefcaseBusiness,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      if (id) {
        const foundJob = getJobById(id);
        if (foundJob) {
          setJob(foundJob);
          const foundCompany = getCompanyById(foundJob.companyId);
          if (foundCompany) {
            setCompany(foundCompany);
          }
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
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse mb-4" />
          <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!job || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16 text-center">
          <h1 className="text-3xl font-medium mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The job you're looking for doesn't exist or has been removed.
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

  const postedDate = new Date(job.posted);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8 mb-8 transition-all duration-200">
              <div className="flex items-start gap-6 mb-8">
                <div className="h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 p-3 border border-border/50">
                  <img 
                    src={job.logo} 
                    alt={`${job.company} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h1 className="text-3xl font-semibold tracking-tight">{job.title}</h1>
                    <Badge variant="outline" className="whitespace-nowrap text-sm font-medium">
                      {job.type}
                    </Badge>
                  </div>

                  <Link 
                    to={`/company/${company.id}`}
                    className="text-xl text-muted-foreground hover:text-foreground transition-colors mt-1 inline-block"
                  >
                    {job.company}
                  </Link>

                  <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span>{job.salary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      <span>{company.industry}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1 font-medium">
                  Apply Now
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8 mb-8">
              <h2 className="text-2xl font-semibold tracking-tight mb-6">Job Description</h2>
              <p className="text-muted-foreground mb-8 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>

              <h2 className="text-2xl font-semibold tracking-tight mb-6">Requirements</h2>
              <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="leading-relaxed">{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 mb-6 sticky top-24">
              <h2 className="text-xl font-semibold tracking-tight mb-6">About {company.name}</h2>

              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 rounded-xl overflow-hidden bg-gray-50 p-3 border border-border/50">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {company.description.length > 150 
                  ? `${company.description.substring(0, 150)}...` 
                  : company.description}
              </p>

              <Separator className="my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium ml-auto">{company.industry}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Company size</span>
                  <span className="font-medium ml-auto">{company.size}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium ml-auto">{company.founded}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Headquarters</span>
                  <span className="font-medium ml-auto">{company.headquarters}</span>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <Link to={`/company/${company.id}`} className="block">
                  <button 
                    className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium rounded-md transition-colors"
                  >
                    View Company Profile
                  </button>
                </Link>
                
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="block">
                  <button 
                    className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition-colors flex items-center justify-center"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6">
              <h2 className="text-xl font-semibold tracking-tight mb-4">Share This Job</h2>
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-md transition-colors flex items-center justify-center"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
                <button 
                  className="flex-1 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-md transition-colors flex items-center justify-center"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;