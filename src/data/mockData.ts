
import { Company, Job, JobType } from "@/lib/types";

export const companies: Company[] = [
  {
    id: "apple",
    name: "Apple Inc.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website: "https://www.apple.com",
    description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    industry: "Technology",
    size: "10,000+",
    founded: 1976,
    headquarters: "Cupertino, California",
  },
  {
    id: "google",
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    website: "https://www.google.com",
    description: "Google LLC is an American multinational technology company that specializes in Internet-related services and products.",
    industry: "Technology",
    size: "10,000+",
    founded: 1998,
    headquarters: "Mountain View, California",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    website: "https://www.microsoft.com",
    description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    industry: "Technology",
    size: "10,000+",
    founded: 1975,
    headquarters: "Redmond, Washington",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.com",
    description: "Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    industry: "E-commerce, Cloud Computing",
    size: "10,000+",
    founded: 1994,
    headquarters: "Seattle, Washington",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    website: "https://about.meta.com",
    description: "Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate that owns Facebook, Instagram, and WhatsApp, among other products and services.",
    industry: "Technology, Social Media",
    size: "10,000+",
    founded: 2004,
    headquarters: "Menlo Park, California",
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior iOS Developer",
    company: "Apple Inc.",
    companyId: "apple",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$150,000 - $180,000",
    description: "We are looking for an experienced iOS developer to join our team working on next-generation mobile applications. You will be responsible for designing, developing, and maintaining high-performance iOS applications.",
    requirements: [
      "5+ years of experience with iOS development",
      "Proficient in Swift and Objective-C",
      "Experience with Apple's Human Interface Guidelines",
      "Strong understanding of software design patterns",
      "Bachelor's degree in Computer Science or related field"
    ],
    posted: "2023-06-15T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  },
  {
    id: "j2",
    title: "UX Designer",
    company: "Apple Inc.",
    companyId: "apple",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "Join our design team to create beautiful, intuitive user experiences for Apple products. You will collaborate with cross-functional teams to define, design, and ship new features.",
    requirements: [
      "3+ years of experience in UX design",
      "Strong portfolio demonstrating design thinking",
      "Experience with design tools like Figma and Sketch",
      "Excellent communication and collaboration skills",
      "Bachelor's degree in Design, HCI, or related field"
    ],
    posted: "2023-06-10T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  },
  {
    id: "j3",
    title: "Machine Learning Engineer",
    company: "Google",
    companyId: "google",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$160,000 - $200,000",
    description: "As a Machine Learning Engineer at Google, you will develop algorithms and systems to improve our products. You will work on cutting-edge technology to solve complex problems.",
    requirements: [
      "MS or PhD in Computer Science, Machine Learning, or related field",
      "Experience with machine learning frameworks like TensorFlow or PyTorch",
      "Strong programming skills in Python",
      "Experience with large-scale data processing",
      "Publications in top-tier conferences is a plus"
    ],
    posted: "2023-06-05T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
  },
  {
    id: "j4",
    title: "Product Manager",
    company: "Microsoft",
    companyId: "microsoft",
    location: "Redmond, WA",
    type: "Full-time",
    salary: "$140,000 - $170,000",
    description: "We are seeking a Product Manager to lead the development of innovative software products. You will work with engineering, design, and marketing teams to define product strategy and roadmap.",
    requirements: [
      "5+ years of experience in product management",
      "Experience with software development lifecycle",
      "Strong analytical and problem-solving skills",
      "Excellent communication and leadership abilities",
      "MBA or technical degree preferred"
    ],
    posted: "2023-06-01T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  {
    id: "j5",
    title: "Frontend Developer",
    company: "Amazon",
    companyId: "amazon",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description: "Join our team to build responsive and user-friendly web applications. You will work on high-traffic websites and contribute to the development of new features.",
    requirements: [
      "3+ years of experience with modern JavaScript frameworks (React, Vue, Angular)",
      "Strong HTML, CSS, and JavaScript skills",
      "Experience with responsive design and cross-browser compatibility",
      "Knowledge of web performance optimization",
      "Bachelor's degree in Computer Science or related field"
    ],
    posted: "2023-05-28T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
  },
  {
    id: "j6",
    title: "Data Scientist",
    company: "Meta",
    companyId: "meta",
    location: "Remote",
    type: "Remote",
    salary: "$140,000 - $180,000",
    description: "As a Data Scientist at Meta, you will analyze large datasets to extract insights and build models to improve our products. You will work with cross-functional teams to solve complex problems.",
    requirements: [
      "MS or PhD in Computer Science, Statistics, or related field",
      "Experience with data analysis and statistical modeling",
      "Proficiency in Python, R, or similar languages",
      "Experience with big data technologies",
      "Strong communication skills to present findings to non-technical stakeholders"
    ],
    posted: "2023-05-25T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
  },
  {
    id: "j7",
    title: "DevOps Engineer",
    company: "Microsoft",
    companyId: "microsoft",
    location: "Remote",
    type: "Contract",
    salary: "$120,000 - $150,000",
    description: "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work on automating deployment processes and improving system reliability.",
    requirements: [
      "3+ years of experience with cloud platforms (Azure, AWS, GCP)",
      "Experience with infrastructure as code (Terraform, CloudFormation)",
      "Knowledge of containerization technologies (Docker, Kubernetes)",
      "Experience with CI/CD pipelines",
      "Strong scripting skills (Bash, PowerShell, Python)"
    ],
    posted: "2023-05-20T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  {
    id: "j8",
    title: "Marketing Specialist",
    company: "Apple Inc.",
    companyId: "apple",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    description: "Join our marketing team to develop and execute marketing campaigns for Apple products. You will collaborate with creative teams to create compelling content.",
    requirements: [
      "3+ years of experience in marketing",
      "Experience with digital marketing channels",
      "Strong analytical skills to measure campaign performance",
      "Excellent written and verbal communication skills",
      "Bachelor's degree in Marketing, Communications, or related field"
    ],
    posted: "2023-05-15T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
  },
  {
    id: "j9",
    title: "Software Engineering Intern",
    company: "Google",
    companyId: "google",
    location: "Mountain View, CA",
    type: "Internship",
    salary: "$8,000 - $10,000 per month",
    description: "Join our engineering team for a summer internship. You will work on real projects and gain hands-on experience with Google technologies.",
    requirements: [
      "Currently pursuing a degree in Computer Science or related field",
      "Strong programming skills in one or more languages",
      "Knowledge of data structures and algorithms",
      "Ability to work in a team environment",
      "Previous internship or project experience is a plus"
    ],
    posted: "2023-05-10T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
  },
  {
    id: "j10",
    title: "Customer Success Manager",
    company: "Amazon",
    companyId: "amazon",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    description: "We are seeking a Customer Success Manager to ensure our enterprise customers achieve their business goals using our products. You will build relationships with key stakeholders and drive product adoption.",
    requirements: [
      "5+ years of experience in customer success or account management",
      "Experience with enterprise software",
      "Strong communication and presentation skills",
      "Ability to understand customer needs and translate them into solutions",
      "Bachelor's degree in Business, Communications, or related field"
    ],
    posted: "2023-05-05T00:00:00Z",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
  }
];

// Helper function to get jobs by company ID
export const getJobsByCompany = (companyId: string): Job[] => {
  return jobs.filter(job => job.companyId === companyId);
};

// Helper function to get company by ID
export const getCompanyById = (companyId: string): Company | undefined => {
  return companies.find(company => company.id === companyId);
};

// Helper function to get job by ID
export const getJobById = (jobId: string): Job | undefined => {
  return jobs.find(job => job.id === jobId);
};
