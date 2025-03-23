
import { useState, useEffect } from "react";
import { Job, JobFilters } from "@/lib/types";
import { jobs } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilters";
import JobCard from "@/components/JobCard";

const Index = () => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: JobFilters) => {
    const filtered = jobs.filter(job => {
      const matchesSearch = !filters.search || 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || job.type === filters.type;
      
      return matchesSearch && matchesLocation && matchesType;
    });
    
    setFilteredJobs(filtered);
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
