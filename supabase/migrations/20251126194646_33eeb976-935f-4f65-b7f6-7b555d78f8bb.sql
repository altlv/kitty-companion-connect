-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('admin', 'shelter_staff', 'user');
CREATE TYPE cat_age AS ENUM ('kitten', 'young', 'adult', 'senior');
CREATE TYPE cat_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE cat_gender AS ENUM ('male', 'female');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create shelters table
CREATE TABLE public.shelters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create cats table
CREATE TABLE public.cats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shelter_id UUID REFERENCES public.shelters(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age cat_age NOT NULL,
  color TEXT NOT NULL,
  size cat_size NOT NULL,
  gender cat_gender NOT NULL,
  personality TEXT[] NOT NULL DEFAULT '{}',
  good_with TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create adoption_applications table
CREATE TABLE public.adoption_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cat_id UUID REFERENCES public.cats(id) ON DELETE CASCADE NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_location TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for shelters
CREATE POLICY "Anyone can view shelters"
  ON public.shelters FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins and shelter staff can insert shelters"
  ON public.shelters FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins and shelter staff can update shelters"
  ON public.shelters FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins can delete shelters"
  ON public.shelters FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cats
CREATE POLICY "Anyone can view available cats"
  ON public.cats FOR SELECT
  TO authenticated, anon
  USING (is_available = true);

CREATE POLICY "Admins and shelter staff can view all cats"
  ON public.cats FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins and shelter staff can insert cats"
  ON public.cats FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins and shelter staff can update cats"
  ON public.cats FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins can delete cats"
  ON public.cats FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for adoption_applications
CREATE POLICY "Anyone can submit adoption applications"
  ON public.adoption_applications FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins and shelter staff can view applications"
  ON public.adoption_applications FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

CREATE POLICY "Admins and shelter staff can update applications"
  ON public.adoption_applications FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'shelter_staff')
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shelters_updated_at
  BEFORE UPDATE ON public.shelters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cats_updated_at
  BEFORE UPDATE ON public.cats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample shelter
INSERT INTO public.shelters (name, email, phone, address, city, state, description)
VALUES (
  'Happy Paws Shelter',
  'contact@happypaws.org',
  '(555) 123-4567',
  '123 Main Street',
  'San Francisco',
  'CA',
  'A loving shelter dedicated to finding forever homes for cats in need.'
);

-- Insert sample cats from the original data
INSERT INTO public.cats (shelter_id, name, age, color, size, gender, personality, good_with, description, image_url)
SELECT 
  (SELECT id FROM public.shelters LIMIT 1),
  name,
  age::cat_age,
  color,
  size::cat_size,
  gender::cat_gender,
  personality,
  good_with,
  description,
  image_url
FROM (VALUES
  ('Whiskers', 'kitten', 'orange', 'small', 'male', ARRAY['playful', 'affectionate'], ARRAY['children', 'dogs'], 'A mischievous orange tabby full of energy and love!', 'https://images.unsplash.com/photo-1574158622682-e40c69881006?w=300&h=250&fit=crop'),
  ('Luna', 'young', 'black', 'medium', 'female', ARRAY['calm', 'affectionate'], ARRAY['children', 'other-cats'], 'A beautiful black cat with a serene temperament.', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=300&h=250&fit=crop'),
  ('Mittens', 'adult', 'white', 'small', 'female', ARRAY['independent', 'playful'], ARRAY['other-cats'], 'Fluffy white cat who enjoys playtime and quiet moments.', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=250&fit=crop'),
  ('Shadow', 'adult', 'gray', 'large', 'male', ARRAY['calm', 'affectionate'], ARRAY['children', 'dogs', 'other-cats'], 'A gentle giant with a loving heart.', 'https://images.unsplash.com/photo-1535241749838-299bda431a63?w=300&h=250&fit=crop'),
  ('Patches', 'young', 'calico', 'medium', 'female', ARRAY['playful', 'affectionate'], ARRAY['children'], 'A colorful calico with boundless energy and charm.', 'https://images.unsplash.com/photo-1573865526014-f3550276626e?w=300&h=250&fit=crop'),
  ('Oliver', 'kitten', 'tabby', 'small', 'male', ARRAY['playful'], ARRAY['children', 'dogs'], 'Adorable tabby kitten ready for adventures!', 'https://images.unsplash.com/photo-1568152947382-f6f85e504b04?w=300&h=250&fit=crop'),
  ('Princess', 'senior', 'siamese', 'small', 'female', ARRAY['calm', 'independent'], ARRAY['other-cats'], 'Elegant Siamese senior looking for a quiet home.', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=250&fit=crop'),
  ('Simba', 'adult', 'orange', 'large', 'male', ARRAY['affectionate', 'playful'], ARRAY['children', 'dogs'], 'A majestic orange cat with a king-sized personality!', 'https://images.unsplash.com/photo-1608848461950-0fed8bed8311?w=300&h=250&fit=crop'),
  ('Smokey', 'adult', 'gray', 'medium', 'male', ARRAY['calm'], ARRAY['other-cats'], 'Laid-back smokey gray cat perfect for relaxation.', 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=300&h=250&fit=crop'),
  ('Bella', 'young', 'black', 'small', 'female', ARRAY['affectionate', 'playful'], ARRAY['children'], 'Sweet black cat with endless cuddles to give!', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=300&h=250&fit=crop'),
  ('Tiger', 'kitten', 'tabby', 'small', 'male', ARRAY['playful'], ARRAY['dogs'], 'Brave little tabby with tiger stripes!', 'https://images.unsplash.com/photo-1532386142143-f8e60652aee3?w=300&h=250&fit=crop'),
  ('Snowball', 'senior', 'white', 'medium', 'female', ARRAY['calm', 'affectionate'], ARRAY['children', 'other-cats'], 'Gentle senior cat seeking a cozy retirement home.', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=300&h=250&fit=crop')
) AS sample_cats(name, age, color, size, gender, personality, good_with, description, image_url);