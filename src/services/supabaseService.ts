
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
    type: job.type as any,
    companyId: job.company_id
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
    type: job.type as any,
    companyId: job.company_id
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
    type: data.type as any,
    companyId: data.company_id
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
  console.log("Fetching company with ID:", id);

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  console.log("Company data retrieved:", data);
  return data;
};

// Fetch jobs by company ID
export const fetchJobsByCompany = async (companyId: string): Promise<Job[]> => {
  console.log("Fetching jobs for company ID:", companyId);

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching jobs by company:', error);
    throw error;
  }

  console.log("Jobs retrieved:", data);
  return data.map(job => ({
    ...job,
    requirements: job.requirements as string[],
    type: job.type as any,
    companyId: job.company_id
  }));
};

// Create a new job
export const createJob = async (jobData: Omit<Job, 'id'> & { id?: string }): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return {
    ...data,
    requirements: data.requirements as string[],
    type: data.type as any,
    companyId: data.company_id
  };
};

// Update a job
export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating job:', error);
    throw error;
  }

  return {
    ...data,
    requirements: data.requirements as string[],
    type: data.type as any,
    companyId: data.company_id
  };
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Update company profile
export const updateCompany = async (id: string, companyData: Partial<Company>): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .update(companyData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company:', error);
    throw error;
  }

  return data;
};
