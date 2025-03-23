
import { supabase } from "@/integrations/supabase/client";
import { Job, Company, JobFilters } from "@/lib/types";

// Fetch all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*');
  
  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
  
  return data.map(job => ({
    ...job,
    requirements: job.requirements as string[],
    type: job.type as any
  }));
};

// Fetch filtered jobs
export const fetchFilteredJobs = async (filters: JobFilters): Promise<Job[]> => {
  let query = supabase.from('jobs').select('*');
  
  // Apply search filter
  if (filters.search) {
    const searchTerm = `%${filters.search.toLowerCase()}%`;
    query = query.or(`title.ilike.${searchTerm},company.ilike.${searchTerm},description.ilike.${searchTerm}`);
  }
  
  // Apply location filter
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  
  // Apply job type filter
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching filtered jobs:', error);
    throw error;
  }
  
  return data.map(job => ({
    ...job,
    requirements: job.requirements as string[],
    type: job.type as any
  }));
};

// Fetch a single job by ID
export const fetchJobById = async (id: string): Promise<Job | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching job:', error);
    throw error;
  }
  
  return {
    ...data,
    requirements: data.requirements as string[],
    type: data.type as any
  };
};

// Fetch all companies
export const fetchCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');
  
  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
  
  return data;
};

// Fetch a single company by ID
export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching company:', error);
    throw error;
  }
  
  return data;
};

// Fetch jobs by company ID
export const fetchJobsByCompany = async (companyId: string): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId);
  
  if (error) {
    console.error('Error fetching jobs by company:', error);
    throw error;
  }
  
  return data.map(job => ({
    ...job,
    requirements: job.requirements as string[],
    type: job.type as any
  }));
};
