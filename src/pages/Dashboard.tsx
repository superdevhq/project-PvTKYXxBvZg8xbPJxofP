
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Building, Briefcase, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import ApplicationsTable from "@/components/ApplicationsTable";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { JobApplication, Company } from "@/lib/types";
import { getCompanyApplications } from "@/services/applicationService";
import { fetchCompanyById } from "@/services/supabaseService";

const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("applications");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login", { state: { from: "/dashboard" } });
        return;
      }

      loadData();
    };

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load applications
        const applicationsData = await getCompanyApplications();
        setApplications(applicationsData);
        
        // Load company profile (for demo, we're using a fixed company ID)
        // In a real app, this would come from the user's profile
        const companyId = "apple"; // This is just for demo purposes
        const companyData = await fetchCompanyById(companyId);
        setCompany(companyData);
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRefreshData = async () => {
    try {
      setIsLoading(true);
      
      // Refresh applications
      const applicationsData = await getCompanyApplications();
      setApplications(applicationsData);
      
      // Refresh company profile
      if (company) {
        const companyData = await fetchCompanyById(company.id);
        setCompany(companyData);
      }
      
      setError(null);
    } catch (err) {
      console.error("Failed to refresh data:", err);
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

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="applications" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Company Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Job Applications</h2>
                <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
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
                  onStatusChange={handleRefreshData}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">My Jobs</h2>
                <Button onClick={() => navigate("/post-job")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a New Job
                </Button>
              </div>
              
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Manage Your Job Listings</h3>
                <p className="text-muted-foreground mb-6">
                  View, edit, and track applications for your job postings
                </p>
                <Button asChild>
                  <a href="/post-job">Post a New Job</a>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-medium mb-6">Company Profile</h2>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <CompanyProfileForm onSave={handleRefreshData} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
