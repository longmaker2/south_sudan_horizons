import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import { Tour } from "../types/tours";
import { Booking } from "../types/bookings";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "tourist" | "guide" | "admin";
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for modals and forms
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "tourist" as User["role"],
  });
  const [newTour, setNewTour] = useState({
    title: "",
    type: "" as Tour["type"],
    description: "",
    price: 0,
    duration: "",
    image: null as File | null,
  });
  const [newBooking, setNewBooking] = useState({
    tourId: "",
    userId: "",
    name: "",
    email: "",
    guests: 1,
    date: "",
    needsGuide: false,
    paymentMethod: "cash" as "cash" | "stripe",
    status: "pending" as "pending" | "confirmed" | "cancelled",
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all users
      const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
        headers,
      });
      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const usersData: User[] = await usersResponse.json();
      setUsers(usersData);

      // Fetch all tours
      const toursResponse = await fetch(`${API_BASE_URL}/tours`, { headers });
      if (!toursResponse.ok) {
        const errorData = await toursResponse.json();
        throw new Error(errorData.message || "Failed to fetch tours");
      }
      const toursData: Tour[] = await toursResponse.json();
      setTours(toursData);

      // Fetch all bookings
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
        headers,
      });
      if (!bookingsResponse.ok) {
        const errorData = await bookingsResponse.json();
        throw new Error(errorData.message || "Failed to fetch bookings");
      }
      const bookingsData: Booking[] = await bookingsResponse.json();
      // Map _id to id for consistency with Booking type if needed
      setBookings(
        bookingsData.filter((b) => b._id).map((b) => ({ ...b, id: b._id! }))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Handlers for Users
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      const createdUser: User = await response.json();
      setUsers([...users, createdUser]);
      setShowUserModal(false);
      resetUserForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/users/${editUser!._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editUser),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
      const updatedUser: User = await response.json();
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setEditUser(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // CRUD Handlers for Tours
  const createTour = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", newTour.title);
    formData.append("type", newTour.type);
    formData.append("description", newTour.description);
    formData.append("price", newTour.price.toString());
    formData.append("duration", newTour.duration);
    if (newTour.image) formData.append("image", newTour.image);

    try {
      const response = await fetch(`${API_BASE_URL}/tours`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create tour");
      }
      const createdTour: Tour = await response.json();
      setTours([...tours, createdTour]);
      setShowTourModal(false);
      resetTourForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (editTour!.title) formData.append("title", editTour!.title);
    if (editTour!.type) formData.append("type", editTour!.type);
    if (editTour!.description)
      formData.append("description", editTour!.description);
    if (editTour!.price) formData.append("price", editTour!.price.toString());
    if (editTour!.duration) formData.append("duration", editTour!.duration);
    if (newTour.image) formData.append("image", newTour.image);

    try {
      const response = await fetch(`${API_BASE_URL}/tours/${editTour!._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update tour");
      }
      const updatedTour: Tour = await response.json();
      setTours(tours.map((t) => (t._id === updatedTour._id ? updatedTour : t)));
      setEditTour(null);
      resetTourForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteTour = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete tour");
      }
      setTours(tours.filter((t) => t._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // CRUD Handlers for Bookings
  const createBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBooking),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }
      const createdBooking: Booking = await response.json();
      setBookings([
        ...bookings,
        { ...createdBooking, id: createdBooking._id! },
      ]);
      setShowBookingModal(false);
      resetBookingForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!editBooking || !token) {
      setError("No booking or token available for update");
      return;
    }

    // Prepare the data to send, stripping out populated fields
    const bookingDataToSend = {
      tourId:
        typeof editBooking.tourId === "string"
          ? editBooking.tourId
          : editBooking.tourId._id,
      userId: editBooking.userId,
      name: editBooking.name,
      email: editBooking.email,
      guests: editBooking.guests,
      date: editBooking.date,
      needsGuide: editBooking.needsGuide,
      paymentMethod: editBooking.paymentMethod,
      status: editBooking.status,
      ...(editBooking.guideId &&
        typeof editBooking.guideId === "string" && {
          guideId: editBooking.guideId,
        }),
    };

    console.log("Sending booking update data:", bookingDataToSend);

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/admin/${editBooking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingDataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update booking error response:", errorData);
        throw new Error(errorData.message || "Failed to update booking");
      }

      const updatedBooking: Booking = await response.json();
      console.log("Received updated booking:", updatedBooking);

      // Update the bookings state with the returned data
      setBookings(
        bookings.map((b) =>
          b.id === updatedBooking.id
            ? { ...updatedBooking, id: updatedBooking._id! }
            : b
        )
      );
      setEditBooking(null);
    } catch (err) {
      console.error("Error in updateBooking:", err);
      setError((err as Error).message);
    }
  };

  const deleteBooking = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete booking");
      }
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Reset form states
  const resetUserForm = () =>
    setNewUser({ fullName: "", email: "", password: "", role: "tourist" });
  const resetTourForm = () =>
    setNewTour({
      title: "",
      type: "" as Tour["type"],
      description: "",
      price: 0,
      duration: "",
      image: null,
    });
  const resetBookingForm = () =>
    setNewBooking({
      tourId: "",
      userId: "",
      name: "",
      email: "",
      guests: 1,
      date: "",
      needsGuide: false,
      paymentMethod: "cash",
      status: "pending",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Admin Dashboard
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Users Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Users ({users.length})
            </h2>
            <button
              onClick={() => setShowUserModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add User
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tours Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Tours ({tours.length})
            </h2>
            <button
              onClick={() => setShowTourModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Tour
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{tour.title}</td>
                    <td className="p-2">{tour.type}</td>
                    <td className="p-2">${tour.price}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setEditTour(tour)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteTour(tour._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bookings Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Bookings ({bookings.length})
            </h2>
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Booking
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tour</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {typeof booking.tourId === "object" && booking.tourId
                        ? booking.tourId.title
                        : tours.find((t) => t._id === booking.tourId)?.title ||
                          "Unknown Tour"}
                    </td>
                    <td className="p-2">{booking.name}</td>
                    <td className="p-2">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{booking.status}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setEditBooking(booking)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Add User</h3>
              <form onSubmit={createUser}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <label htmlFor="userRole" className="block mb-1">
                  Role
                </label>
                <select
                  id="userRole"
                  value={newUser.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as User["role"],
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="tourist">Tourist</option>
                  <option value="guide">Guide</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      resetUserForm();
                    }}
                    className="mr-2 px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Edit User</h3>
              <form onSubmit={updateUser}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={editUser.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditUser({ ...editUser, fullName: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <label htmlFor="editUserRole" className="block mb-1">
                  Role
                </label>
                <select
                  id="editUserRole"
                  value={editUser.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditUser({
                      ...editUser,
                      role: e.target.value as User["role"],
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="tourist">Tourist</option>
                  <option value="guide">Guide</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="mr-2 px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tour Modal */}
        {showTourModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Add Tour</h3>
              <form onSubmit={createTour}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newTour.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({ ...newTour, title: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={newTour.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({
                      ...newTour,
                      type: e.target.value as Tour["type"],
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newTour.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewTour({ ...newTour, description: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newTour.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({
                      ...newTour,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={newTour.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({ ...newTour, duration: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="file"
                  placeholder="Image"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({
                      ...newTour,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full p-2 mb-2"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTourModal(false);
                      resetTourForm();
                    }}
                    className="mr-2 px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Tour Modal */}
        {editTour && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Edit Tour</h3>
              <form onSubmit={updateTour}>
                <input
                  type="text"
                  placeholder="Title"
                  value={editTour.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTour({ ...editTour, title: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={editTour.type}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTour({
                      ...editTour,
                      type: e.target.value as Tour["type"],
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editTour.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditTour({ ...editTour, description: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editTour.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTour({
                      ...editTour,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={editTour.duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditTour({ ...editTour, duration: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="file"
                  placeholder="Image"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTour({
                      ...newTour,
                      image: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full p-2 mb-2"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditTour(null)}
                    className="mr-2 px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Add Booking</h3>
              <form onSubmit={createBooking}>
                <label htmlFor="tourSelect" className="block mb-1">
                  Select Tour
                </label>
                <select
                  id="tourSelect"
                  value={newBooking.tourId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewBooking({ ...newBooking, tourId: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                >
                  <option value="">Select Tour</option>
                  {tours.map((tour) => (
                    <option key={tour._id} value={tour._id}>
                      {tour.title}
                    </option>
                  ))}
                </select>
                <label htmlFor="userSelect" className="block mb-1">
                  Select User
                </label>
                <select
                  id="userSelect"
                  value={newBooking.userId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewBooking({ ...newBooking, userId: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  value={newBooking.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBooking({ ...newBooking, name: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newBooking.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBooking({ ...newBooking, email: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Guests"
                  value={newBooking.guests}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBooking({
                      ...newBooking,
                      guests: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  min="1"
                  required
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={newBooking.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={newBooking.needsGuide}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewBooking({
                        ...newBooking,
                        needsGuide: e.target.checked,
                      })
                    }
                  />
                  <span className="ml-2">Needs Guide</span>
                </label>
                <label htmlFor="paymentMethod" className="block mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={newBooking.paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewBooking({
                      ...newBooking,
                      paymentMethod: e.target.value as "cash" | "stripe",
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="cash">Cash</option>
                  <option value="stripe">Stripe</option>
                </select>
                <label htmlFor="status" className="block mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newBooking.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewBooking({
                      ...newBooking,
                      status: e.target.value as
                        | "pending"
                        | "confirmed"
                        | "cancelled",
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      resetBookingForm();
                    }}
                    className="mr-2 px-4 py-2 text-gray-

600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editBooking && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Edit Booking</h3>
              <form onSubmit={updateBooking}>
                <label htmlFor="editTourSelect" className="block mb-1">
                  Select Tour
                </label>
                <select
                  id="editTourSelect"
                  value={
                    typeof editBooking.tourId === "string"
                      ? editBooking.tourId
                      : editBooking.tourId?._id || ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditBooking({ ...editBooking, tourId: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                >
                  <option value="">Select Tour</option>
                  {tours.map((tour) => (
                    <option key={tour._id} value={tour._id}>
                      {tour.title}
                    </option>
                  ))}
                </select>
                <label htmlFor="editUserSelect" className="block mb-1">
                  Select User
                </label>
                <select
                  id="editUserSelect"
                  value={
                    typeof editBooking.userId === "string"
                      ? editBooking.userId
                      : (editBooking.userId as User)?._id || ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditBooking({ ...editBooking, userId: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  value={editBooking.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditBooking({ ...editBooking, name: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editBooking.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditBooking({ ...editBooking, email: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Guests"
                  value={editBooking.guests}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditBooking({
                      ...editBooking,
                      guests: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  min="1"
                  required
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={
                    typeof editBooking.date === "string"
                      ? editBooking.date.split("T")[0]
                      : new Date(editBooking.date).toISOString().split("T")[0]
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditBooking({ ...editBooking, date: e.target.value })
                  }
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editBooking.needsGuide}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditBooking({
                        ...editBooking,
                        needsGuide: e.target.checked,
                      })
                    }
                  />
                  <span className="ml-2">Needs Guide</span>
                </label>
                <label htmlFor="editPaymentMethod" className="block mb-1">
                  Payment Method
                </label>
                <select
                  id="editPaymentMethod"
                  value={editBooking.paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditBooking({
                      ...editBooking,
                      paymentMethod: e.target.value as "cash" | "stripe",
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="cash">Cash</option>
                  <option value="stripe">Stripe</option>
                </select>
                <label htmlFor="editStatus" className="block mb-1">
                  Status
                </label>
                <select
                  id="editStatus"
                  value={editBooking.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditBooking({
                      ...editBooking,
                      status: e.target.value as
                        | "pending"
                        | "confirmed"
                        | "cancelled",
                    })
                  }
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditBooking(null)}
                    className="mr-2 px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
