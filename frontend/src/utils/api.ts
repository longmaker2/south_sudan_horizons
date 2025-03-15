import { Tour } from "../types/tours";
import { Booking } from "../types/bookings";
import mongoose from "mongoose";

// For local development (uncomment for local testing)
export const API_BASE_URL = "http://localhost:5000/api";
export const BASE_URL = "http://localhost:5000";

// For production
// export const API_BASE_URL = "https://south-sudan-horizons.onrender.com/api";
// export const BASE_URL = "https://south-sudan-horizons.onrender.com";

// API functions
export const fetchTours = async (): Promise<Tour[]> => {
  const response = await fetch(`${API_BASE_URL}/tours`);
  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to fetch tours");
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
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to fetch random tours");
  }
  const tours = await response.json();
  return tours.map((tour: Tour) => ({
    ...tour,
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
  }));
};

export const fetchTourById = async (id: string): Promise<Tour> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid tour ID format:", id);
    throw new Error("Invalid tour ID format");
  }
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || `Failed to fetch tour with id ${id}`);
  }
  const tour = await response.json();
  return {
    ...tour,
    _id: tour._id,
    image: `${BASE_URL}/tour_pics/${tour.image}`,
  };
};

export const fetchTourDetails = async (id: string): Promise<Tour> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid tour ID format:", id);
    throw new Error("Invalid tour ID format");
  }
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to fetch tour details");
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid tour ID format:", id);
    throw new Error("Invalid tour ID format");
  }
  const response = await fetch(`${API_BASE_URL}/tours/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
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
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(bookingData.tourId)) {
    console.error("Invalid tour ID format:", bookingData.tourId);
    throw new Error("Invalid tour ID format");
  }
  if (!bookingData.userId) {
    console.error("No user ID provided in booking data");
    throw new Error("No user ID provided");
  }
  if (
    bookingData.guideId &&
    !mongoose.Types.ObjectId.isValid(bookingData.guideId)
  ) {
    console.error("Invalid guide ID format:", bookingData.guideId);
    throw new Error("Invalid guide ID format");
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
      console.error("API Error Response:", errorData);
      if (
        response.status === 401 &&
        errorData.error === "Invalid or expired token"
      ) {
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
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid booking ID format:", id);
    throw new Error("Invalid booking ID format");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to fetch booking details");
  }

  const data = await response.json();
  return {
    id: data._id?.toString() || "",
    tourId: data.tourId?._id?.toString() || "",
    userId: data.userId?.toString() || "",
    name: data.name || "",
    email: data.email || "",
    guests: data.guests || 0,
    date: data.date || "",
    needsGuide: data.needsGuide || false,
    guideId: data.guideId?._id?.toString() || "",
    status: data.status || "pending",
    title: data.tourId?.title || "Unknown Tour",
    price: data.tourId?.price || 0,
    description: data.tourId?.description || "No description available",
    guideName: data.guideId?.fullName || undefined,
    paymentMethod: data.paymentMethod || "cash",
  };
};

export const updateBooking = async (
  id: string,
  updates: { date: string; guests: number }
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid booking ID format:", id);
    throw new Error("Invalid booking ID format");
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
      console.error("API Error Response:", errorData);
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
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid booking ID format:", id);
    throw new Error("Invalid booking ID format");
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
      console.error("API Error Response:", errorData);
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
    console.error("No token found in localStorage");
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
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to fetch booking history");
  }

  const bookings = await response.json();
  if (!Array.isArray(bookings)) {
    console.error("Invalid response format:", bookings);
    throw new Error("Invalid response format: Expected an array of bookings");
  }

  return bookings.map((booking: Booking) => ({
    id: booking._id?.toString() || booking.id || "",
    tourId:
      typeof booking.tourId === "string"
        ? booking.tourId
        : booking.tourId?._id?.toString() || "",
    userId: booking.userId?.toString() || "",
    name: booking.name || "",
    email: booking.email || "",
    guests: booking.guests || 0,
    date: booking.date || "",
    needsGuide: booking.needsGuide || false,
    guideId:
      typeof booking.guideId === "string"
        ? booking.guideId
        : booking.guideId?._id?.toString() || "",
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
    paymentMethod: booking.paymentMethod || "cash",
  }));
};

// Fetch bookings assigned to the logged-in guide
export const fetchGuideBookings = async (): Promise<Booking[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  console.log("Fetching guide bookings with token:", token);

  // Decode token for debugging (client-side JWT parsing)
  let decoded;
  try {
    decoded = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded token payload:", decoded);
    if (!decoded.id) {
      console.error("Token missing 'id' field");
      throw new Error("Invalid token: Missing user ID");
    }
    if (decoded.role !== "guide") {
      console.error(`Token role is '${decoded.role}', expected 'guide'`);
      throw new Error("Access denied: User is not a guide");
    }
  } catch (e) {
    console.error("Failed to decode token:", e);
    throw new Error("Invalid token format. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/bookings/guide`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response from /bookings/guide:", errorData);
    if (
      response.status === 401 &&
      errorData.error === "Invalid or expired token"
    ) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log in again.");
    }
    if (response.status === 400 && errorData.error.includes("guide ID")) {
      throw new Error("Invalid token: Missing or invalid guide ID");
    }
    if (response.status === 403) {
      throw new Error("Access denied: Guides only");
    }
    throw new Error(
      errorData.error ||
        `Failed to fetch guide bookings (Status: ${response.status})`
    );
  }

  const bookings = await response.json();
  console.log("Raw guide bookings response:", bookings);
  if (!Array.isArray(bookings)) {
    console.error("Invalid response format:", bookings);
    throw new Error("Invalid response format: Expected an array of bookings");
  }

  return bookings.map((booking: Booking) => ({
    id: booking._id?.toString() || booking.id || "",
    tourId:
      typeof booking.tourId === "object" && booking.tourId?._id
        ? booking.tourId._id.toString()
        : booking.tourId || "",
    userId: booking.userId?.toString() || "",
    name: booking.name || "",
    email: booking.email || "",
    guests: booking.guests || 0,
    date: booking.date || "",
    needsGuide: booking.needsGuide || false,
    guideId:
      typeof booking.guideId === "object" && booking.guideId?._id
        ? booking.guideId._id.toString()
        : booking.guideId || "",
    status: booking.status || "pending",
    title:
      typeof booking.tourId === "object" && booking.tourId?.title
        ? booking.tourId.title
        : "Unknown Tour",
    price:
      typeof booking.tourId === "object" && booking.tourId?.price
        ? booking.tourId.price
        : 0,
    description:
      typeof booking.tourId === "object" && booking.tourId?.description
        ? booking.tourId.description
        : "No description available",
    guideName:
      typeof booking.guideId === "object" && booking.guideId?.fullName
        ? booking.guideId.fullName
        : undefined,
    paymentMethod: booking.paymentMethod || "cash",
  }));
};

// Update booking status by guide
export const updateBookingStatus = async (
  id: string,
  status: "confirmed" | "cancelled"
): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid booking ID format:", id);
    throw new Error("Invalid booking ID format");
  }

  console.log(`Updating booking ${id} to status: ${status}`);
  const response = await fetch(`${API_BASE_URL}/bookings/${id}/guide`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);
    if (
      response.status === 401 &&
      errorData.error === "Invalid or expired token"
    ) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error("Access denied: Guides only");
    }
    throw new Error(
      errorData.error ||
        `Failed to update booking status (Status: ${response.status})`
    );
  }

  console.log(`Booking ${id} updated successfully to ${status}`);
};

// Payment Intent API
export const createPaymentIntent = async (data: {
  tourId: string;
  guests: number;
}): Promise<{ clientSecret: string }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("User is not authenticated. Please log in.");
  }

  if (!mongoose.Types.ObjectId.isValid(data.tourId)) {
    console.error("Invalid tour ID format:", data.tourId);
    throw new Error("Invalid tour ID format");
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
    console.error("API Error Response:", errorData);
    throw new Error(errorData.error || "Failed to create payment intent");
  }

  return response.json();
};
