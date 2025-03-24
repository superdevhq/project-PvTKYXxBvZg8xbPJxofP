
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/types";
import { getCompanyLogo } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const postedDate = new Date(job.posted);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <Link 
      to={`/job/${job.id}`}
      className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2 border border-border/50">
          <img 
            src={getCompanyLogo(job.logo)} 
            alt={`${job.company} logo`} 
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium">{job.title}</h2>
          <p className="text-muted-foreground">{job.company}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">{job.type}</Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary/70" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary/70" />
              <span>Posted {timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
