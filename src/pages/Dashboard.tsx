
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import ApplicationsTable from "@/components/ApplicationsTable";
import { supabase } from "@/integrations/supabase/client";
import { JobApplication } from "@/lib/types";
import { getCompanyApplications } from "@/services/applicationService";

const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/login", { state: { from: "/dashboard" } });
        return;
      }
      
      loadApplications();
    };

    const loadApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getCompanyApplications();
        setApplications(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRefreshApplications = async () => {
    try {
      setIsLoading(true);
      const data = await getCompanyApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/post-job")}>
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </div>

        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Job Applications</h2>
                <Button variant="outline" onClick={handleRefreshApplications} disabled={isLoading}>
                  Refresh
                </Button>
              </div>

              {isLoading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div 
                      key={index} 
                      className="h-16 rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
                  <h3 className="text-xl font-medium mb-2">Error</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <ApplicationsTable 
                  applications={applications} 
                  onStatusChange={handleRefreshApplications}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
              <h3 className="text-xl font-medium mb-2">My Jobs</h3>
              <p className="text-muted-foreground mb-6">
                Manage your job listings
              </p>
              <Button asChild>
                <a href="/post-job">Post a New Job</a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
              <h3 className="text-xl font-medium mb-2">Company Profile</h3>
              <p className="text-muted-foreground mb-6">
                Update your company information
              </p>
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
