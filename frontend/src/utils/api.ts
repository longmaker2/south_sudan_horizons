import { Tour } from "../types/tours";
import { Booking } from "../types/bookings";

// For local development (uncomment for local testing)
// export const API_BASE_URL = "http://localhost:5000/api";
// export const BASE_URL = "http://localhost:5000";

// For production
export const API_BASE_URL = "https://south-sudan-horizons.onrender.com/api";
export const BASE_URL = "https://south-sudan-horizons.onrender.com";

export const fetchTours = async (): Promise<Tour[]> => {
  const response = await fetch(`${API_BASE_URL}/tours`);
  if (!response.ok) {
    throw new Error("Failed to fetch tours");
  }
  const tours = await response.json();
  console.log("Fetched tours:", tours);
  return tours.map((tour: Tour) => ({
    ...tour,
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
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
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
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
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
  };
};

export const fetchTourDetails = async (id: string): Promise<Tour> => {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch tour details");
  }
  const tour = await response.json();
  return {
    ...tour,
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
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
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to submit review");
  }

  const updatedTour = await response.json();
  return {
    ...updatedTour,
    _id: updatedTour._id,
    image: `${BASE_URL}/tour_pics/${updatedTour.image}`,
  };
};

export const submitBooking = async (bookingData: {
  tourId: string;
  userId: string;
  name: string;
  email: string;
  guests: number;
  date: string;
  needsGuide: boolean;
  guideId?: string;
  paymentMethod: "stripe" | "cash";
  paymentIntentId?: string;
}): Promise<{ success: boolean; bookingId: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  try {
    console.log(
      "Submitting booking with payload:",
      JSON.stringify(bookingData)
    );
    console.log("Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

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
      if (response.status === 401 && errorData.error === "Invalid token.") {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(
        errorData.error ||
          `Failed to submit booking (Status: ${response.status})`
      );
    }

    const data = await response.json();
    console.log("Booking response:", data);
    return data;
  } catch (error) {
    console.error("Error submitting booking:", error);
    throw error;
  }
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch booking details");
  }

  const data = await response.json();
  return {
    id: data._id,
    tourId: data.tourId._id,
    userId: data.userId,
    name: data.name,
    email: data.email,
    guests: data.guests,
    date: data.date,
    needsGuide: data.needsGuide,
    guideId: data.guideId?._id,
    status: data.status,
    title: data.tourId?.title || "Unknown Tour",
    price: data.tourId?.price || 0,
    description: data.tourId?.description || "No description available",
    guideName: data.guideId?.fullName || undefined,
  };
};

export const updateBooking = async (
  id: string,
  updates: { date: string; guests: number }
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update booking");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const cancelBooking = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to cancel booking");
    }

    return response.json();
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};

export const fetchUserBookings = async (): Promise<Booking[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch booking history");
  }

  const bookings = await response.json();
  return bookings.map((booking: Booking) => ({
    id: booking.id,
    tourId:
      typeof booking.tourId === "string"
        ? booking.tourId
        : booking.tourId?._id || "",
    userId: booking.userId,
    name: booking.name,
    email: booking.email,
    guests: booking.guests,
    date: booking.date,
    needsGuide: booking.needsGuide,
    guideId:
      typeof booking.guideId === "string"
        ? booking.guideId
        : booking.guideId?._id,
    status: booking.status || "pending",
    title:
      typeof booking.tourId === "string"
        ? "Unknown Tour"
        : booking.tourId?.title || "Unknown Tour",
    price: typeof booking.tourId === "string" ? 0 : booking.tourId?.price || 0,
    description:
      typeof booking.tourId === "string"
        ? "No description available"
        : booking.tourId?.description || "No description available",
    guideName:
      typeof booking.guideId === "string"
        ? undefined
        : booking.guideId?.fullName || undefined,
  }));
};

// Payment Intent API
export const createPaymentIntent = async (data: {
  tourId: string;
  guests: number;
}): Promise<{ clientSecret: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated. Please log in.");
  }

  const response = await fetch(
    `${API_BASE_URL}/bookings/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create payment intent");
  }

  return response.json();
};
