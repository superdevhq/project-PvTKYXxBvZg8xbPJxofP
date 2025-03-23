
import { Job } from "@/lib/types";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const postedDate = new Date(job.posted);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <Link 
      to={`/job/${job.id}`}
      className="block apple-card p-6 hover:translate-y-[-2px] transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 p-2">
          <img 
            src={job.logo} 
            alt={`${job.company} logo`} 
            className="h-full w-full object-contain"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-lg truncate">{job.title}</h3>
            <Badge variant="outline" className="whitespace-nowrap">
              {job.type}
            </Badge>
          </div>
          
          <p className="text-muted-foreground mt-1">{job.company}</p>
          
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
