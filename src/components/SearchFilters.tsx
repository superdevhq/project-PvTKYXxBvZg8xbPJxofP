
import { useState } from "react";
import { JobFilters, JobType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, MapPin, Briefcase } from "lucide-react";

interface SearchFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    location: "",
    type: ""
  });

  const handleChange = (key: keyof JobFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      location: "",
      type: ""
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const jobTypes: JobType[] = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm border border-border/50">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Job title or keyword"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="pl-9 apple-input"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="pl-9 apple-input"
          />
        </div>

        <div className="relative sm:col-span-2 lg:col-span-1">
          <Select
            value={filters.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className="w-full">
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleReset}
          variant="outline"
          className="w-full sm:col-span-2 lg:col-span-1"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
