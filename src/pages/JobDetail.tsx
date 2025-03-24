
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Building, Calendar, DollarSign, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import JobApplicationForm from "@/components/JobApplicationForm";
import { Job } from "@/lib/types";
import { fetchJobById } from "@/services/supabaseService";
import { checkUserApplication } from "@/services/applicationService";
import { supabase } from "@/integrations/supabase/client";
import { getCompanyLogo } from "@/lib/utils";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const jobData = await fetchJobById(id);

        if (!jobData) {
          setError("Job not found");
          return;
        }

        setJob(jobData);
        setError(null);

        // Check if user has already applied
        const applied = await checkUserApplication(id);
        setHasApplied(applied);
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for this job",
      });
      navigate("/login", { state: { from: `/job/${id}` } });
      return;
    }
    setIsApplicationOpen(true);
  };

  const handleCloseApplication = () => {
    setIsApplicationOpen(false);
  };

  const handleApplicationSuccess = () => {
    setIsApplicationOpen(false);
    setHasApplied(true);
    toast({
      title: "Application submitted",
      description: "Your application has been successfully submitted",
    });
  };

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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 text-center">
          <h2 className="text-2xl font-medium mb-4">{error || "Job not found"}</h2>
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
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2 border border-border/50">
                  <img 
                    src={getCompanyLogo(job.logo)} 
                    alt={`${job.company} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">{job.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Link to={`/company/${job.companyId}`} className="text-muted-foreground hover:text-foreground">
                      {job.company}
                    </Link>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary/70" />
                      <span>{job.salary}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <span>Posted {timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-4">Job Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>

              <Separator className="my-6" />

              <h2 className="text-xl font-medium mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-4">Company Info</h2>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0 bg-gray-50 p-1 border border-border/50">
                  <img 
                    src={getCompanyLogo(job.logo)} 
                    alt={`${job.company} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{job.company}</h3>
                </div>
              </div>

              <Link to={`/company/${job.companyId}`}>
                <Button variant="outline" className="w-full">
                  <Building className="mr-2 h-4 w-4" />
                  View Company Profile
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-4">Apply for this job</h2>
              
              {hasApplied ? (
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="font-medium mb-2">You've already applied</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can view your application status in My Applications
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/my-applications">View My Applications</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button className="w-full" onClick={handleApplyClick}>Apply Now</Button>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Application will be sent to the employer
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Application Dialog */}
        <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply for {job.title} at {job.company}</DialogTitle>
            </DialogHeader>
            <JobApplicationForm 
              job={job} 
              onCancel={handleCloseApplication} 
              onSuccess={handleApplicationSuccess}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default JobDetail;
