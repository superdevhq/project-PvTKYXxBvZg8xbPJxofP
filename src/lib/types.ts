
export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  type: JobType;
  salary: string;
  description: string;
  requirements: string[];
  posted: string; // ISO date string
  logo: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  jobs?: Job[];
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';

export interface JobFilters {
  search: string;
  location: string;
  type: JobType | '';
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: {
    title: string;
    company: string;
    logo: string;
  };
}
