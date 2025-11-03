export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  promotion_price: number | null;
  image_base64: string;
  status: 'available' | 'unavailable';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  perfume_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Favorite {
  id: string;
  perfume_id: string;
  user_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  perfume_id: string;
  user_id: string;
  quantity: number;
  created_at: string;
  perfumes?: Perfume;
}
