export interface Cat {
  id: number;
  name: string;
  age: "kitten" | "young" | "adult" | "senior";
  color: string;
  size: "small" | "medium" | "large";
  gender: "male" | "female";
  personality: string[];
  goodWith: string[];
  description: string;
  image: string;
}

export const cats: Cat[] = [
  {
    id: 1,
    name: "Whiskers",
    age: "kitten",
    color: "orange",
    size: "small",
    gender: "male",
    personality: ["playful", "affectionate"],
    goodWith: ["children", "dogs"],
    description: "A mischievous orange tabby full of energy and love!",
    image: "https://images.unsplash.com/photo-1574158622682-e40c69881006?w=300&h=250&fit=crop"
  },
  {
    id: 2,
    name: "Luna",
    age: "young",
    color: "black",
    size: "medium",
    gender: "female",
    personality: ["calm", "affectionate"],
    goodWith: ["children", "other-cats"],
    description: "A beautiful black cat with a serene temperament.",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=300&h=250&fit=crop"
  },
  {
    id: 3,
    name: "Mittens",
    age: "adult",
    color: "white",
    size: "small",
    gender: "female",
    personality: ["independent", "playful"],
    goodWith: ["other-cats"],
    description: "Fluffy white cat who enjoys playtime and quiet moments.",
    image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=250&fit=crop"
  },
  {
    id: 4,
    name: "Shadow",
    age: "adult",
    color: "gray",
    size: "large",
    gender: "male",
    personality: ["calm", "affectionate"],
    goodWith: ["children", "dogs", "other-cats"],
    description: "A gentle giant with a loving heart.",
    image: "https://images.unsplash.com/photo-1535241749838-299bda431a63?w=300&h=250&fit=crop"
  },
  {
    id: 5,
    name: "Patches",
    age: "young",
    color: "calico",
    size: "medium",
    gender: "female",
    personality: ["playful", "affectionate"],
    goodWith: ["children"],
    description: "A colorful calico with boundless energy and charm.",
    image: "https://images.unsplash.com/photo-1573865526014-f3550276626e?w=300&h=250&fit=crop"
  },
  {
    id: 6,
    name: "Oliver",
    age: "kitten",
    color: "tabby",
    size: "small",
    gender: "male",
    personality: ["playful"],
    goodWith: ["children", "dogs"],
    description: "Adorable tabby kitten ready for adventures!",
    image: "https://images.unsplash.com/photo-1568152947382-f6f85e504b04?w=300&h=250&fit=crop"
  },
  {
    id: 7,
    name: "Princess",
    age: "senior",
    color: "siamese",
    size: "small",
    gender: "female",
    personality: ["calm", "independent"],
    goodWith: ["other-cats"],
    description: "Elegant Siamese senior looking for a quiet home.",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=250&fit=crop"
  },
  {
    id: 8,
    name: "Simba",
    age: "adult",
    color: "orange",
    size: "large",
    gender: "male",
    personality: ["affectionate", "playful"],
    goodWith: ["children", "dogs"],
    description: "A majestic orange cat with a king-sized personality!",
    image: "https://images.unsplash.com/photo-1608848461950-0fed8bed8311?w=300&h=250&fit=crop"
  },
  {
    id: 9,
    name: "Smokey",
    age: "adult",
    color: "gray",
    size: "medium",
    gender: "male",
    personality: ["calm"],
    goodWith: ["other-cats"],
    description: "Laid-back smokey gray cat perfect for relaxation.",
    image: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=300&h=250&fit=crop"
  },
  {
    id: 10,
    name: "Bella",
    age: "young",
    color: "black",
    size: "small",
    gender: "female",
    personality: ["affectionate", "playful"],
    goodWith: ["children"],
    description: "Sweet black cat with endless cuddles to give!",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=300&h=250&fit=crop"
  },
  {
    id: 11,
    name: "Tiger",
    age: "kitten",
    color: "tabby",
    size: "small",
    gender: "male",
    personality: ["playful"],
    goodWith: ["dogs"],
    description: "Brave little tabby with tiger stripes!",
    image: "https://images.unsplash.com/photo-1532386142143-f8e60652aee3?w=300&h=250&fit=crop"
  },
  {
    id: 12,
    name: "Snowball",
    age: "senior",
    color: "white",
    size: "medium",
    gender: "female",
    personality: ["calm", "affectionate"],
    goodWith: ["children", "other-cats"],
    description: "Gentle senior cat seeking a cozy retirement home.",
    image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=300&h=250&fit=crop"
  }
];
