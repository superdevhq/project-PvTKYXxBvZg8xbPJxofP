
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobType } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { Wand2 } from "lucide-react";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType | "">("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [improvingDescription, setImprovingDescription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !type || !salary || !description || !requirements) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login");
        return;
      }

      // Get company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (companyError) throw companyError;

      // Parse requirements into array
      const requirementsArray = requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      // Create new job
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          id: uuidv4(),
          title,
          company: companyData.name,
          company_id: session.user.id,
          location,
          type,
          salary,
          description,
          requirements: requirementsArray,
          posted: new Date().toISOString(),
          logo: companyData.logo
        });

      if (jobError) throw jobError;

      toast({
        title: "Success",
        description: "Job posted successfully",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const improveDescription = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description first",
        variant: "destructive",
      });
      return;
    }

    try {
      setImprovingDescription(true);
      
      const { data, error } = await supabase.functions.invoke('improve-job-description', {
        body: { description }
      });

      if (error) throw error;
      
      setDescription(data.improvedDescription);
      
      toast({
        title: "Success",
        description: "Job description improved successfully",
      });
    } catch (error: any) {
      console.error("Error improving description:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to improve job description",
        variant: "destructive",
      });
    } finally {
      setImprovingDescription(false);
    }
  };

  const jobTypes: JobType[] = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-3xl">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
            <CardDescription>
              Fill in the details to create a new job listing
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, NY or Remote"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as JobType)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((jobType) => (
                      <SelectItem key={jobType} value={jobType}>
                        {jobType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $80,000 - $100,000"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Job Description</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={improveDescription}
                    disabled={improvingDescription || !description.trim()}
                    className="flex items-center gap-1"
                  >
                    <Wand2 className="h-4 w-4" />
                    {improvingDescription ? "Improving..." : "Improve with AI"}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Enter each requirement on a new line"
                  rows={6}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter each requirement on a new line
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Job"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
