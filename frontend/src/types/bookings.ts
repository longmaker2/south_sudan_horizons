export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  needsGuide: boolean;
  guideId?: string;
  status: "pending" | "confirmed" | "cancelled";
  title: string;
  price: number;
  description: string;
  guideName?: string;
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
