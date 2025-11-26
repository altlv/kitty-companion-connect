import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Cat {
  id: string;
  name: string;
  age: "kitten" | "young" | "adult" | "senior";
  color: string;
  size: "small" | "medium" | "large";
  gender: "male" | "female";
  personality: string[];
  good_with: string[];
  description: string;
  image_url: string;
}

interface CatCardProps {
  cat: Cat;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAdopt: (cat: Cat) => void;
}

export const CatCard = ({ cat, isFavorite, onToggleFavorite, onAdopt }: CatCardProps) => {
  const getAgeLabel = (age: string) => {
    switch (age) {
      case "kitten": return "Kitten (0-1 year)";
      case "young": return "Young (1-3 years)";
      case "adult": return "Adult (3-7 years)";
      case "senior": return "Senior (7+ years)";
      default: return age;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <div className="relative h-64 overflow-hidden bg-gradient-primary">
        <img 
          src={cat.image_url} 
          alt={cat.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-card-foreground mb-3">{cat.name}</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-muted p-2 rounded-lg text-sm">
              <strong className="block text-card-foreground mb-1">Age:</strong>
              <span className="text-muted-foreground">{getAgeLabel(cat.age)}</span>
            </div>
            <div className="bg-muted p-2 rounded-lg text-sm">
              <strong className="block text-card-foreground mb-1">Color:</strong>
              <span className="text-muted-foreground capitalize">{cat.color}</span>
            </div>
            <div className="bg-muted p-2 rounded-lg text-sm">
              <strong className="block text-card-foreground mb-1">Size:</strong>
              <span className="text-muted-foreground capitalize">{cat.size}</span>
            </div>
            <div className="bg-muted p-2 rounded-lg text-sm">
              <strong className="block text-card-foreground mb-1">Gender:</strong>
              <span className="text-muted-foreground capitalize">{cat.gender}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {cat.personality.map((trait) => (
              <Badge 
                key={trait} 
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {cat.description}
        </p>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onAdopt(cat)}
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105"
          >
            Adopt Me
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onToggleFavorite(cat.id)}
            className={cn(
              "transition-all duration-300",
              isFavorite && "bg-favorite-light text-favorite border-favorite hover:bg-favorite-light"
            )}
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-favorite")} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
