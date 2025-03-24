
import { supabase } from "@/integrations/supabase/client";
import { JobApplication, ApplicationStatus } from "@/lib/types";

// Submit a job application
export const submitJobApplication = async (application: Omit<JobApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      job_id: application.jobId,
      user_id: application.userId,
      full_name: application.fullName,
      email: application.email,
      phone: application.phone || null,
      resume_url: application.resumeUrl || null,
      cover_letter: application.coverLetter || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting job application:', error);
    throw error;
  }

  return {
    id: data.id,
    jobId: data.job_id,
    userId: data.user_id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    resumeUrl: data.resume_url,
    coverLetter: data.cover_letter,
    status: data.status as ApplicationStatus,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Get user's job applications
export const getUserApplications = async (): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      jobs:job_id (
        title,
        company,
        logo
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }

  return data.map(app => ({
    id: app.id,
    jobId: app.job_id,
    userId: app.user_id,
    fullName: app.full_name,
    email: app.email,
    phone: app.phone,
    resumeUrl: app.resume_url,
    coverLetter: app.cover_letter,
    status: app.status as ApplicationStatus,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    job: app.jobs
  }));
};

// Check if user has already applied to a job
export const checkUserApplication = async (jobId: string): Promise<boolean> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return false;
  
  const userId = session.session.user.id;
  
  const { data, error } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking application:', error);
    return false;
  }

  return !!data;
};

// Get applications for a company's jobs
export const getCompanyApplications = async (): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      jobs:job_id (
        title,
        company,
        logo
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching company applications:', error);
    throw error;
  }

  return data.map(app => ({
    id: app.id,
    jobId: app.job_id,
    userId: app.user_id,
    fullName: app.full_name,
    email: app.email,
    phone: app.phone,
    resumeUrl: app.resume_url,
    coverLetter: app.cover_letter,
    status: app.status as ApplicationStatus,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    job: app.jobs
  }));
};

// Update application status
export const updateApplicationStatus = async (id: string, status: ApplicationStatus): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
