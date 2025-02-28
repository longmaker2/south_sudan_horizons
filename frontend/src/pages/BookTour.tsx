import { useParams } from "react-router-dom";

const BookTour = () => {
  useParams();

  // Fetch tour details based on the ID
  const tour = {
    id: 1,
    name: "Adventure Tours",
    description:
      "Explore the wild side of South Sudan with our adventure tours.",
    price: "$500",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-800">Book {tour.name}</h1>
        <p className="mt-4 text-gray-700">{tour.description}</p>
        <p className="mt-2 text-lg font-semibold text-green-800">
          {tour.price}
        </p>
        <form className="mt-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTour;
