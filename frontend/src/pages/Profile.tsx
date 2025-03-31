import React, { useState, useEffect } from "react";
import ProfileComponent from "../components/ProfileComponent";
import ChangePassword from "../components/ChangePassword";
import BookingHistory from "../components/BookingHistory";
import EditProfileModal from "../components/EditProfileModal";
import { API_BASE_URL, BASE_URL } from "../utils/api";
import { Booking } from "../types/bookings";
import { useTranslation } from "react-i18next";

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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { t } = useTranslation(); // Hook to access translations

  const fetchProfile = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(t("profile.noTokenError"));
      setLoadingProfile(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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
          ? `${BASE_URL}${data.profilePicture}`
          : null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(t("profile.fetchProfileError"));
    } finally {
      setLoadingProfile(false);
    }
  }, [t]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(t("profile.noTokenError"));
        setLoadingBookings(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/bookings/user`, {
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
            | string
            | {
                _id: string;
                title: string;
                price: number;
                description: string;
              };
          userId: string;
          name: string;
          email: string;
          guests: number;
          date: string;
          needsGuide: boolean;
          guideId: string | { _id: string; fullName: string };
          status: string;
        }

        const mappedBookings: Booking[] = bookings.map(
          (booking: BookingResponse) => ({
            id: booking._id,
            tourId:
              typeof booking.tourId === "string"
                ? booking.tourId
                : booking.tourId?._id || "",
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
                ? t("profile.unknownTour")
                : booking.tourId?.title || t("profile.unknownTour"),
            price:
              typeof booking.tourId === "string"
                ? 0
                : booking.tourId?.price || 0,
            description:
              typeof booking.tourId === "string"
                ? t("profile.noDescription")
                : booking.tourId?.description || t("profile.noDescription"),
            guideName:
              typeof booking.guideId === "string"
                ? undefined
                : booking.guideId?.fullName || undefined,
          })
        );

        setBookingHistory(mappedBookings);
      } catch (error) {
        console.error("Error fetching booking history:", error);
        setError(t("profile.fetchBookingError"));
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchProfile();
    fetchBookingHistory();
  }, [t, fetchProfile]);

  const handleSaveProfile = (updatedTourist: Tourist) => {
    setTourist({
      ...updatedTourist,
      profilePicture: updatedTourist.profilePicture
        ? `${BASE_URL}${updatedTourist.profilePicture}`
        : null,
    });
    setIsEditingProfile(false);
    fetchProfile();
  };

  if (loadingProfile || loadingBookings) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 mx-auto"></div>
          <p className="mt-2">{t("profile.loadingMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="max-w-3xl mx-auto my-16">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          {t("profile.title")}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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

        <BookingHistory
          loading={loadingBookings}
          bookingHistory={bookingHistory}
        />
      </div>
    </div>
  );
};

export default Profile;
