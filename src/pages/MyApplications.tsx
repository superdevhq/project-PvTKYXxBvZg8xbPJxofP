
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { JobApplication } from "@/lib/types";
import { getUserApplications } from "@/services/applicationService";
import { getCompanyLogo } from "@/lib/utils";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'reviewed':
      return 'secondary';
    case 'interviewing':
      return 'default';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const MyApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        window.location.href = "/login";
        return;
      }
      
      loadApplications();
    };

    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getUserApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load your applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-1">Track the status of your job applications</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="h-32 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
            <h3 className="text-xl font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't applied to any jobs yet
            </p>
            <Button asChild>
              <Link to="/">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => {
              const appliedDate = new Date(application.createdAt);
              const timeAgo = formatDistanceToNow(appliedDate, { addSuffix: true });
              
              return (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-1 border border-border/50">
                          <img 
                            src={getCompanyLogo(application.job?.logo)} 
                            alt={`${application.job?.company} logo`} 
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            <Link 
                              to={`/job/${application.jobId}`}
                              className="hover:text-primary transition-colors"
                            >
                              {application.job?.title}
                            </Link>
                          </CardTitle>
                          <p className="text-muted-foreground">{application.job?.company}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Applied {timeAgo}</p>
                        <p className="text-sm">
                          Applied as: <span className="font-medium">{application.fullName}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link to={`/job/${application.jobId}`}>View Job</Link>
                        </Button>
                        {application.resumeUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
