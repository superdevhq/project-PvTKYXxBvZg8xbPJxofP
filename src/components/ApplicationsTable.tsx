
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { JobApplication, ApplicationStatus } from "@/lib/types";
import { updateApplicationStatus } from "@/services/applicationService";
import { sendStatusChangeEmail } from "@/services/emailService";

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
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [currentApplication, setCurrentApplication] = useState<{id: string, status: ApplicationStatus} | null>(null);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    // If status is rejected, show the rejection dialog
    if (status === 'rejected') {
      setCurrentApplication({ id, status });
      setShowRejectionDialog(true);
      return;
    }

    // Otherwise, proceed with the status update
    await updateApplicationStatusWithEmail(id, status);
  };

  const handleRejectionSubmit = async () => {
    if (!currentApplication) return;
    
    await updateApplicationStatusWithEmail(
      currentApplication.id, 
      currentApplication.status, 
      rejectionMessage
    );
    
    // Reset the dialog state
    setShowRejectionDialog(false);
    setRejectionMessage("");
    setCurrentApplication(null);
  };

  const updateApplicationStatusWithEmail = async (
    id: string, 
    status: ApplicationStatus, 
    message?: string
  ) => {
    try {
      setUpdatingId(id);
      
      // Update the status in the database
      await updateApplicationStatus(id, status);
      
      // Send email notification
      const emailSent = await sendStatusChangeEmail(id, status, message);
      
      toast.success(
        emailSent 
          ? "Status updated and notification sent" 
          : "Status updated (email notification failed)"
      );

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status");
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
    <>
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

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rejection Message</DialogTitle>
            <DialogDescription>
              Add a personalized message to send to the candidate. If left empty, a generic rejection message will be sent.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Optional: Add a personalized message explaining the rejection reason..."
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
            rows={5}
            className="mt-4"
          />
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRejectionSubmit}>
              Send Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationsTable;
