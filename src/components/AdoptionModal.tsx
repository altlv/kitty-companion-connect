import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface Cat {
  id: string;
  name: string;
}

const applicationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(20),
  location: z.string().min(1, "Location is required").max(100),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000)
});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cat) return;

    try {
      const validated = applicationSchema.parse(formData);

      const { error } = await supabase
        .from("adoption_applications")
        .insert({
          cat_id: cat.id,
          applicant_name: validated.name,
          applicant_email: validated.email,
          applicant_phone: validated.phone,
          applicant_location: validated.location,
          message: validated.message
        });

      if (error) throw error;

      toast.success(`Application submitted for ${cat?.name}! 🎉`, {
        description: "We'll contact you soon to schedule a meet and greet!"
      });
      setFormData({ name: "", email: "", phone: "", location: "", message: "" });
      onClose();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    }
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
