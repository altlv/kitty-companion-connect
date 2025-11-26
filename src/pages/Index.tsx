import { useState, useMemo } from "react";
import { cats, Cat } from "@/data/cats";
import { CatCard } from "@/components/CatCard";
import { FilterSection, Filters } from "@/components/FilterSection";
import { AdoptionModal } from "@/components/AdoptionModal";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [filters, setFilters] = useState<Filters>({
    age: "",
    color: "",
    size: "",
    personality: "",
    goodWith: "",
    gender: ""
  });
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredCats = useMemo(() => {
    let result = cats;

    // Filter by favorites
    if (showOnlyFavorites) {
      result = result.filter(cat => favorites.includes(cat.id));
    }

    // Apply filters
    if (filters.age) {
      result = result.filter(cat => cat.age === filters.age);
    }
    if (filters.color) {
      result = result.filter(cat => cat.color === filters.color);
    }
    if (filters.size) {
      result = result.filter(cat => cat.size === filters.size);
    }
    if (filters.personality) {
      result = result.filter(cat => cat.personality.includes(filters.personality));
    }
    if (filters.goodWith) {
      result = result.filter(cat => cat.goodWith.includes(filters.goodWith));
    }
    if (filters.gender) {
      result = result.filter(cat => cat.gender === filters.gender);
    }

    return result;
  }, [cats, filters, showOnlyFavorites, favorites]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      age: "",
      color: "",
      size: "",
      personality: "",
      goodWith: "",
      gender: ""
    });
    setShowOnlyFavorites(false);
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleViewFavorites = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const handleAdopt = (cat: Cat) => {
    setSelectedCat(cat);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center text-white mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg">
            🐱 MeowMatch
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-4">
            Find Your Perfect Feline Companion
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">❤️ Favorites:</span>
            <Badge className="bg-white/30 text-white hover:bg-white/40 text-base px-4 py-1">
              {favorites.length}
            </Badge>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8">
          <FilterSection
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={() => {}}
            onReset={handleReset}
            onViewFavorites={handleViewFavorites}
          />
        </div>

        {/* Results */}
        {filteredCats.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {filteredCats.map((cat) => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  isFavorite={favorites.includes(cat.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAdopt={handleAdopt}
                />
              ))}
            </div>
            <p className="text-center text-white/80 text-sm">
              Showing {filteredCats.length} {filteredCats.length === 1 ? 'cat' : 'cats'}
            </p>
          </>
        ) : (
          <div className="bg-card rounded-2xl p-12 text-center animate-in fade-in">
            <div className="text-7xl mb-6">😿</div>
            <h2 className="text-2xl font-bold mb-3 text-card-foreground">No Cats Found</h2>
            <p className="text-muted-foreground text-lg">
              {showOnlyFavorites 
                ? "You haven't added any favorites yet. Browse cats and click the heart icon to save your favorites!"
                : "Try adjusting your filters to find more cats."}
            </p>
          </div>
        )}
      </div>

      {/* Adoption Modal */}
      <AdoptionModal
        cat={selectedCat}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
