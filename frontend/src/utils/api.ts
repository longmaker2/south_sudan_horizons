import { Tour } from "../types/tours";

const API_BASE_URL = "http://localhost:5000/api/tours";

export const fetchTours = async (): Promise<Tour[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tours");
  }
  const tours = await response.json();
  console.log("Fetched tours:", tours); // Log the fetched tours
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
  const response = await fetch(`${API_BASE_URL}?type=${type}&limit=${limit}`);
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
  const response = await fetch(`${API_BASE_URL}/${id}`);
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
  const response = await fetch(`${API_BASE_URL}/${id}`);
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
  const response = await fetch(`${API_BASE_URL}/${id}/reviews`, {
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
