import React, { useState, useEffect } from "react";
import ProfileComponent from "../components/ProfileComponent";
import ChangePassword from "../components/ChangePassword";
import BookingHistory from "../components/BookingHistory";
import EditProfileModal from "../components/EditProfileModal";
import config from "../config";
import { Booking } from "../types/bookings";

interface Tourist {
  name: string;
  email: string;
  profilePicture: string | null;
}

const Profile: React.FC = () => {
  const [tourist, setTourist] = useState<Tourist>({
    name: "",
    email: "",
    profilePicture: null,
  });

  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(`${config.baseUrl}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Fetched profile data:", data);

        setTourist({
          name: data.fullName,
          email: data.email,
          profilePicture: data.profilePicture
            ? `${config.baseUrl}${data.profilePicture}`
            : null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found for booking history");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.baseUrl}/api/bookings/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking history");
        }

        const bookings = await response.json();
        console.log("Fetched booking history:", bookings);

        interface BookingResponse {
          _id: string;
          tourId:
            | { _id: string; title: string; price: number; description: string }
            | string;
          userId: string;
          name: string;
          email: string;
          guests: number;
          date: string;
          needsGuide: boolean;
          guideId?: { _id: string; fullName: string } | string;
          status?: string;
        }

        const mappedBookings: Booking[] = bookings.map(
          (booking: BookingResponse) => ({
            id: booking._id,
            tourId:
              typeof booking.tourId === "string"
                ? booking.tourId
                : booking.tourId._id,
            userId: booking.userId,
            name: booking.name,
            email: booking.email,
            guests: booking.guests,
            date: new Date(booking.date).toLocaleDateString(),
            needsGuide: booking.needsGuide,
            guideId:
              typeof booking.guideId === "string"
                ? booking.guideId
                : booking.guideId?._id,
            status: booking.status || "pending",
            title:
              typeof booking.tourId === "string"
                ? "Unknown Tour"
                : booking.tourId.title || "Unknown Tour",
            price:
              typeof booking.tourId === "string"
                ? 0
                : booking.tourId.price || 0,
            description:
              typeof booking.tourId === "string"
                ? "No description available"
                : booking.tourId.description || "No description available",
            guideName:
              typeof booking.guideId === "string"
                ? undefined
                : booking.guideId?.fullName || undefined,
          })
        );

        setBookingHistory(mappedBookings);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  const handleSaveProfile = (updatedTourist: Tourist) => {
    setTourist({
      ...updatedTourist,
      profilePicture: updatedTourist.profilePicture
        ? `${config.baseUrl}${updatedTourist.profilePicture}`
        : null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-15 mt-16">
      <div className="max-w-3xl mx-auto my-16">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Tourist Dashboard
        </h1>

        <ProfileComponent
          tourist={tourist}
          onEditProfile={() => setIsEditingProfile(true)}
        />

        {isEditingProfile && (
          <EditProfileModal
            tourist={tourist}
            onClose={() => setIsEditingProfile(false)}
            onSave={handleSaveProfile}
          />
        )}

        <ChangePassword
          currentPassword={""}
          setCurrentPassword={() => {}}
          newPassword={""}
          setNewPassword={() => {}}
          confirmPassword={""}
          setConfirmPassword={() => {}}
          showCurrentPassword={false}
          setShowCurrentPassword={() => {}}
          showNewPassword={false}
          setShowNewPassword={() => {}}
          showConfirmPassword={false}
          setShowConfirmPassword={() => {}}
          error={""}
          success={""}
          handlePasswordChange={() => {}}
        />

        <BookingHistory loading={loading} bookingHistory={bookingHistory} />
      </div>
    </div>
  );
};

export default Profile;
