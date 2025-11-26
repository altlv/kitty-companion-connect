import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw, Heart } from "lucide-react";

export interface Filters {
  age: string;
  color: string;
  size: string;
  personality: string;
  goodWith: string;
  gender: string;
}

interface FilterSectionProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onViewFavorites: () => void;
}

export const FilterSection = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onReset,
  onViewFavorites 
}: FilterSectionProps) => {
  return (
    <Card className="p-6 animate-in fade-in slide-in-from-top-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age Range</Label>
          <Select value={filters.age} onValueChange={(value) => onFilterChange("age", value)}>
            <SelectTrigger id="age">
              <SelectValue placeholder="All Ages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="kitten">Kitten (0-1 year)</SelectItem>
              <SelectItem value="young">Young (1-3 years)</SelectItem>
              <SelectItem value="adult">Adult (3-7 years)</SelectItem>
              <SelectItem value="senior">Senior (7+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color/Pattern</Label>
          <Select value={filters.color} onValueChange={(value) => onFilterChange("color", value)}>
            <SelectTrigger id="color">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="gray">Gray</SelectItem>
              <SelectItem value="calico">Calico</SelectItem>
              <SelectItem value="tabby">Tabby</SelectItem>
              <SelectItem value="siamese">Siamese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select value={filters.size} onValueChange={(value) => onFilterChange("size", value)}>
            <SelectTrigger id="size">
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personality">Personality</Label>
          <Select value={filters.personality} onValueChange={(value) => onFilterChange("personality", value)}>
            <SelectTrigger id="personality">
              <SelectValue placeholder="All Personalities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personalities</SelectItem>
              <SelectItem value="playful">Playful & Energetic</SelectItem>
              <SelectItem value="calm">Calm & Relaxed</SelectItem>
              <SelectItem value="affectionate">Affectionate & Cuddly</SelectItem>
              <SelectItem value="independent">Independent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goodWith">Good With</Label>
          <Select value={filters.goodWith} onValueChange={(value) => onFilterChange("goodWith", value)}>
            <SelectTrigger id="goodWith">
              <SelectValue placeholder="No Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">No Filter</SelectItem>
              <SelectItem value="children">Children</SelectItem>
              <SelectItem value="dogs">Dogs</SelectItem>
              <SelectItem value="other-cats">Other Cats</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={filters.gender} onValueChange={(value) => onFilterChange("gender", value)}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={onSearch}
          className="bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button 
          variant="outline"
          onClick={onReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button 
          variant="outline"
          onClick={onViewFavorites}
        >
          <Heart className="mr-2 h-4 w-4" />
          View Favorites
        </Button>
      </div>
    </Card>
  );
};
