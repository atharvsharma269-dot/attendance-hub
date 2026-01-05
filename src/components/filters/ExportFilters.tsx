import { useState, useCallback } from "react";
import { Calendar, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { SessionStatus } from "@/types/session";
import { format } from "date-fns";

export interface AttendanceFilters {
  search: string;
  status: SessionStatus | "all";
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  course: string;
}

interface ExportFiltersProps {
  filters: AttendanceFilters;
  onFiltersChange: (filters: AttendanceFilters) => void;
  courses?: string[];
}

const defaultFilters: AttendanceFilters = {
  search: "",
  status: "all",
  dateFrom: undefined,
  dateTo: undefined,
  course: "all",
};

export const ExportFilters = ({
  filters,
  onFiltersChange,
  courses = [],
}: ExportFiltersProps) => {
  const [isDateFromOpen, setIsDateFromOpen] = useState(false);
  const [isDateToOpen, setIsDateToOpen] = useState(false);

  const updateFilter = useCallback(
    <K extends keyof AttendanceFilters>(key: K, value: AttendanceFilters[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const clearFilters = () => {
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.course !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll number..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value as SessionStatus | "all")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Course Filter */}
        <Select
          value={filters.course}
          onValueChange={(value) => updateFilter("course", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, "MMM d, yyyy") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => {
                updateFilter("dateFrom", date);
                setIsDateFromOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, "MMM d, yyyy") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => {
                updateFilter("dateTo", date);
                setIsDateToOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filters active</span>
          {filters.dateFrom && filters.dateTo && (
            <span className="px-2 py-0.5 rounded bg-secondary">
              {format(filters.dateFrom, "MMM d")} - {format(filters.dateTo, "MMM d, yyyy")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Export this for easy initialization
export { defaultFilters };
