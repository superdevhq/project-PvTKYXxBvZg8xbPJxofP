
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
      className="block bg-white rounded-xl shadow-sm border border-border/50 p-4 sm:p-6 hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2 border border-border/50">
          <img 
            src={job.logo} 
            alt={`${job.company} logo`} 
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-medium text-base sm:text-lg truncate">{job.title}</h3>
            <Badge variant="outline" className="whitespace-nowrap text-xs">
              {job.type}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{job.company}</p>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary/70" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-primary/70" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary/70" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
