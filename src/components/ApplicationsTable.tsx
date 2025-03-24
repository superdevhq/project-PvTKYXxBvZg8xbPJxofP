
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { JobApplication, ApplicationStatus } from "@/lib/types";
import { updateApplicationStatus } from "@/services/applicationService";

interface ApplicationsTableProps {
  applications: JobApplication[];
  onStatusChange?: () => void;
}

const getStatusBadgeVariant = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending':
      return 'outline';
    case 'reviewed':
      return 'secondary';
    case 'interviewing':
      return 'default';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const ApplicationsTable = ({ applications, onStatusChange }: ApplicationsTableProps) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      setUpdatingId(id);
      await updateApplicationStatus(id, status);
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${status}`,
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-border/50">
        <h3 className="text-xl font-medium mb-2">No applications found</h3>
        <p className="text-muted-foreground">
          There are no applications for your jobs yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const appliedDate = new Date(application.createdAt);
            const timeAgo = formatDistanceToNow(appliedDate, { addSuffix: true });
            
            return (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.fullName}</div>
                    <div className="text-sm text-muted-foreground">{application.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/job/${application.jobId}`}
                    className="text-primary hover:underline"
                  >
                    {application.job?.title}
                  </Link>
                </TableCell>
                <TableCell>{timeAgo}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) => handleStatusChange(application.id, value as ApplicationStatus)}
                    disabled={updatingId === application.id}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <Badge variant={getStatusBadgeVariant(application.status as ApplicationStatus)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {application.resumeUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
