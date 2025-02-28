export interface Tour {
  _id: string;
  id: number;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
  video: string;
  price: number;
  duration: string;
  rating: number;
  type: "Adventure" | "Cultural" | "Wildlife" | "Nature" | "All";
  reviews: { author: string; comment: string; rating: number }[];
  included?: string[];
  toBring?: string[];
}
