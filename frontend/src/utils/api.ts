import { Tour } from "../types/tours";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchTours = async (): Promise<Tour[]> => {
  const response = await fetch(`${API_BASE_URL}/tours`);
  if (!response.ok) {
    throw new Error("Failed to fetch tours");
  }
  const tours = await response.json();
  console.log("Fetched tours:", tours);
  return tours.map((tour: Tour) => ({
    ...tour,
    id: tour._id, // Map _id to id
    image: `http://localhost:5000/tour_pics/${tour.image}`,
  }));
};

export const getRandomTours = async (
  type: string,
  limit: number
): Promise<Tour[]> => {
  const response = await fetch(
    `${API_BASE_URL}/tours?type=${type}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch random tours");
  }
  const tours = await response.json();
  return tours.map((tour: Tour) => ({
    ...tour,
    image: `http://localhost:5000/tour_pics/${tour.image}`,
  }));
};

export const fetchTourById = async (id: string): Promise<Tour> => {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tour with id ${id}`);
  }
  const tour = await response.json();
  return {
    ...tour,
    image: `http://localhost:5000/tour_pics/${tour.image}`,
  };
};

export const fetchTourDetails = async (id: string): Promise<Tour> => {
  console.log(`Fetching tour details for ID: ${id}`);
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tour details");
  }
  const tour = await response.json();
  console.log("Fetched tour details:", tour);
  return {
    ...tour,
    image: `http://localhost:5000/tour_pics/${tour.image}`,
  };
};

export const submitReview = async (
  id: string,
  review: { author: string; comment: string; rating: number }
): Promise<Tour> => {
  const response = await fetch(`${API_BASE_URL}/tours/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error("Failed to submit review");
  }

  const updatedTour = await response.json();
  return updatedTour;
};

export const submitBooking = async (bookingData: {
  tourId: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  needsGuide: boolean;
  guideId?: string;
}): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend Error:", errorData);
      throw new Error(errorData.error || "Failed to submit booking");
    }

    return response.json();
  } catch (error) {
    console.error("Error submitting booking:", error);
    throw error;
  }
};
