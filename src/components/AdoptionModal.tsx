import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cat } from "@/data/cats";
import { useState } from "react";
import { toast } from "sonner";

interface AdoptionModalProps {
  cat: Cat | null;
  open: boolean;
  onClose: () => void;
}

export const AdoptionModal = ({ cat, open, onClose }: AdoptionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Application submitted for ${cat?.name}! 🎉`, {
      description: "We'll contact you soon to schedule a meet and greet!"
    });
    setFormData({ name: "", email: "", phone: "", location: "", message: "" });
    onClose();
  };

  if (!cat) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ready to Adopt {cat.name}? 🎉</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-4">
          Fill out this quick form and we'll help you get started!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Your Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">City/State</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Tell us about your home and lifestyle</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your home, lifestyle, and why you'd be a great match for this cat..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
          >
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
