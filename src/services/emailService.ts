
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus } from "@/lib/types";

/**
 * Send email notification for a new job application
 */
export const sendNewApplicationEmail = async (applicationId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("No authenticated session found");
      return false;
    }

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        applicationType: 'new',
        applicationId
      }
    });

    if (error) {
      console.error("Error sending application email:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send application email:", err);
    return false;
  }
};

/**
 * Send email notification for an application status change
 */
export const sendStatusChangeEmail = async (
  applicationId: string, 
  newStatus: ApplicationStatus,
  message?: string
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.error("No authenticated session found");
      return false;
    }

    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        applicationType: 'status-change',
        applicationId,
        newStatus,
        message
      }
    });

    if (error) {
      console.error("Error sending status change email:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send status change email:", err);
    return false;
  }
};
