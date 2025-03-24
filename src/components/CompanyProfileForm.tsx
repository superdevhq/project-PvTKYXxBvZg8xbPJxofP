
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Company } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchCompanyById, updateCompany } from "@/services/supabaseService";

interface CompanyProfileFormProps {
  onSave?: () => void;
}

const CompanyProfileForm = ({ onSave }: CompanyProfileFormProps) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    logo: "",
    website: "",
    description: "",
    industry: "",
    size: "",
    founded: 0,
    headquarters: ""
  });

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        
        // For now, we'll use a mock company ID (in a real app, this would come from the user's profile)
        // In a production app, you would store the company_id in the user's metadata or in a separate table
        const companyId = "apple"; // This is just for demo purposes
        
        const companyData = await fetchCompanyById(companyId);
        
        if (companyData) {
          setCompany(companyData);
          setFormData({
            name: companyData.name || "",
            logo: companyData.logo || "",
            website: companyData.website || "",
            description: companyData.description || "",
            industry: companyData.industry || "",
            size: companyData.size || "",
            founded: companyData.founded || 0,
            headquarters: companyData.headquarters || ""
          });
        } else {
          setError("Company profile not found. Please create a new company profile.");
        }
      } catch (err) {
        console.error("Failed to load company data:", err);
        setError("Failed to load company profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "founded" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) return;
    
    try {
      setIsSaving(true);
      await updateCompany(company.id, formData);
      toast.success("Company profile updated successfully");
      if (onSave) onSave();
    } catch (err) {
      console.error("Failed to update company profile:", err);
      toast.error("Failed to update company profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium mb-2">Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a URL to your company logo (recommended size: 400x400px)
          </p>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="size">Company Size</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g. 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+"
              required
            />
          </div>

          <div>
            <Label htmlFor="founded">Founded Year</Label>
            <Input
              id="founded"
              name="founded"
              type="number"
              value={formData.founded}
              onChange={handleChange}
              min={1800}
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div>
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input
              id="headquarters"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              placeholder="City, Country"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyProfileForm;
