
import { useState, useEffect } from "react";
import { Job, JobFilters } from "@/lib/types";
import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilters";
import JobCard from "@/components/JobCard";
import { fetchJobs, fetchFilteredJobs } from "@/services/supabaseService";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchJobs();
        setJobs(data);
        setFilteredJobs(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleFilterChange = async (filters: JobFilters) => {
    try {
      setIsLoading(true);
      
      // If all filters are empty, just show all jobs
      if (!filters.search && !filters.location && !filters.type) {
        setFilteredJobs(jobs);
        return;
      }
      
      const filtered = await fetchFilteredJobs(filters);
      setFilteredJobs(filtered);
    } catch (err) {
      console.error("Failed to filter jobs:", err);
      setError("Failed to filter jobs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover opportunities at the world's leading tech companies
          </p>
        </section>

        <section className="mb-8">
          <SearchFilters onFilterChange={handleFilterChange} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
            </h2>
          </div>

          {error && (
            <div className="text-center py-12 text-red-500">
              <h3 className="text-xl font-medium mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-40 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
