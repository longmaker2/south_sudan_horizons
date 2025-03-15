export interface Booking {
  id: string;
  _id?: string;
  tourId:
    | string
    | { _id: string; title: string; price: number; description: string };
  userId: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  needsGuide: boolean;
  guideId?: string | { _id: string; fullName: string };
  status: "pending" | "confirmed" | "cancelled";
  title: string;
  price: number;
  description: string;
  guideName?: string;
  paymentMethod: "stripe" | "cash";
}

export interface BookingSummary {
  tourId: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  needsGuide: boolean;
  guide: string | undefined;
}
