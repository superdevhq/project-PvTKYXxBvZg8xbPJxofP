
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
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="apple-card p-6 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 p-2">
                  <img 
                    src={job.logo} 
                    alt={`${job.company} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h1 className="text-2xl font-medium">{job.title}</h1>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {job.type}
                    </Badge>
                  </div>
                  
                  <Link 
                    to={`/company/${company.id}`}
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {job.company}
                  </Link>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{timeAgo}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1">Apply Now</Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="apple-card p-6 mb-8">
              <h2 className="text-xl font-medium mb-4">Job Description</h2>
              <p className="text-muted-foreground mb-6 whitespace-pre-line">
                {job.description}
              </p>
              
              <h2 className="text-xl font-medium mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <div className="apple-card p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">About {company.name}</h2>
              
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-50 p-2">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {company.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company size</span>
                  <span className="font-medium">{company.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-medium">{company.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Headquarters</span>
                  <span className="font-medium">{company.headquarters}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to={`/company/${company.id}`}>
                  <Button variant="outline" className="w-full">
                    View Company Profile
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="apple-card p-6">
              <h2 className="text-xl font-medium mb-4">Share This Job</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
