import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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
  is_available: boolean;
}

const catSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  age: z.enum(["kitten", "young", "adult", "senior"]),
  color: z.string().min(1, "Color is required"),
  size: z.enum(["small", "medium", "large"]),
  gender: z.enum(["male", "female"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  image_url: z.string().url("Must be a valid URL")
});

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isShelterStaff, loading } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    age: "kitten" | "young" | "adult" | "senior";
    color: string;
    size: "small" | "medium" | "large";
    gender: "male" | "female";
    personality: string[];
    good_with: string[];
    description: string;
    image_url: string;
    is_available: boolean;
  }>({
    name: "",
    age: "adult",
    color: "",
    size: "medium",
    gender: "male",
    personality: [],
    good_with: [],
    description: "",
    image_url: "",
    is_available: true
  });

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && !isShelterStaff))) {
      navigate("/auth");
    }
  }, [user, isAdmin, isShelterStaff, loading, navigate]);

  useEffect(() => {
    if (user && (isAdmin || isShelterStaff)) {
      fetchCats();
      fetchShelters();
    }
  }, [user, isAdmin, isShelterStaff]);

  const fetchCats = async () => {
    const { data, error } = await supabase
      .from("cats")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setCats(data);
  };

  const fetchShelters = async () => {
    const { data, error } = await supabase
      .from("shelters")
      .select("*");

    if (!error && data) setShelters(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      catSchema.parse(formData);

      if (!shelters.length) {
        toast.error("No shelter found. Please contact administrator.");
        return;
      }

      const catData = {
        ...formData,
        shelter_id: shelters[0].id
      };

      if (editingCat) {
        const { error } = await supabase
          .from("cats")
          .update(catData)
          .eq("id", editingCat.id);

        if (error) throw error;
        toast.success("Cat updated successfully!");
      } else {
        const { error } = await supabase
          .from("cats")
          .insert(catData);

        if (error) throw error;
        toast.success("Cat added successfully!");
      }

      setModalOpen(false);
      resetForm();
      fetchCats();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to save cat. Please try again.");
      }
    }
  };

  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      age: cat.age,
      color: cat.color,
      size: cat.size,
      gender: cat.gender,
      personality: cat.personality,
      good_with: cat.good_with,
      description: cat.description,
      image_url: cat.image_url,
      is_available: cat.is_available
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cat?")) return;

    const { error } = await supabase
      .from("cats")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete cat");
    } else {
      toast.success("Cat deleted successfully");
      fetchCats();
    }
  };

  const resetForm = () => {
    setEditingCat(null);
    setFormData({
      name: "",
      age: "adult",
      color: "",
      size: "medium",
      gender: "male",
      personality: [],
      good_with: [],
      description: "",
      image_url: "",
      is_available: true
    });
  };

  const handlePersonalityToggle = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(t => t !== trait)
        : [...prev.personality, trait]
    }));
  };

  const handleGoodWithToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      good_with: prev.good_with.includes(value)
        ? prev.good_with.filter(v => v !== value)
        : [...prev.good_with, value]
    }));
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-primary flex items-center justify-center text-white">
      Loading...
    </div>;
  }

  if (!user || (!isAdmin && !isShelterStaff)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Admin Dashboard
            </h1>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Cat
          </Button>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cats.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="capitalize">{cat.age}</TableCell>
                  <TableCell className="capitalize">{cat.color}</TableCell>
                  <TableCell className="capitalize">{cat.size}</TableCell>
                  <TableCell className="capitalize">{cat.gender}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      cat.is_available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {cat.is_available ? "Available" : "Adopted"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCat ? "Edit Cat" : "Add New Cat"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Select value={formData.age} onValueChange={(value: any) => setFormData({ ...formData, age: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitten">Kitten (0-1 year)</SelectItem>
                      <SelectItem value="young">Young (1-3 years)</SelectItem>
                      <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                      <SelectItem value="senior">Senior (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Select value={formData.size} onValueChange={(value: any) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value: any) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Personality Traits</Label>
                <div className="flex flex-wrap gap-2">
                  {["playful", "calm", "affectionate", "independent"].map((trait) => (
                    <Button
                      key={trait}
                      type="button"
                      variant={formData.personality.includes(trait) ? "default" : "outline"}
                      onClick={() => handlePersonalityToggle(trait)}
                    >
                      {trait}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Good With</Label>
                <div className="flex flex-wrap gap-2">
                  {["children", "dogs", "other-cats"].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={formData.good_with.includes(value) ? "default" : "outline"}
                      onClick={() => handleGoodWithToggle(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-gradient-primary">
                  {editingCat ? "Update Cat" : "Add Cat"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
