import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitBooking, createPaymentIntent } from "../utils/api";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import PaymentMethod from "./PaymentMethod";

// Determine the Stripe publishable key using Vite's import.meta.env
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error(
    "Stripe publishable key is missing in the environment variables."
  );
}

// Log the key for debugging
console.log("Stripe Publishable Key:", stripeKey);

// Initialize Stripe with the publishable key
const stripePromise: Promise<Stripe | null> = loadStripe(stripeKey).catch(
  (error) => {
    console.error("Failed to initialize Stripe:", error);
    throw new Error("Stripe initialization failed");
  }
);

const availableGuides = [
  { id: "507f1f77bcf86cd799439011", name: "John Doe", profile: "..." },
  { id: "507f1f77bcf86cd799439012", name: "Jane Smith", profile: "..." },
  { id: "507f1f77bcf86cd799439013", name: "Alex Johnson", profile: "..." },
];

const Booking = ({ tourId }: { tourId: string }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [needsGuide, setNeedsGuide] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cash">(
    "stripe"
  );

  interface BookingSummary {
    tourId: string;
    name: string;
    email: string;
    guests: number;
    date: string;
    needsGuide: boolean;
    guide: string | undefined;
    paymentMethod: "stripe" | "cash";
  }

  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(
    null
  );

  // Check if Stripe and Elements are loaded
  useEffect(() => {
    if (stripe && elements) {
      setStripeLoaded(true);
    } else if (paymentMethod === "stripe") {
      console.warn("Stripe or Elements not loaded yet");
      stripePromise.catch((err) => setError(err.message));
    }
  }, [stripe, elements, paymentMethod]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setBookingSummary(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handlePaymentSetup = async () => {
    try {
      setIsLoading(true);
      const paymentIntent = await createPaymentIntent({ tourId, guests });
      setClientSecret(paymentIntent.clientSecret);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize payment. Please try again."
      );
      console.error("Payment setup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!tourId || !user?.id) {
      setError("Missing required booking data.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      setError("Please select a future date for the tour.");
      setIsLoading(false);
      return;
    }

    const bookingDataBase = {
      tourId,
      userId: user.id,
      name,
      email,
      guests: Number(guests),
      date: selectedDate.toISOString(),
      needsGuide,
      guideId: selectedGuide || undefined,
      paymentMethod,
    };

    try {
      if (paymentMethod === "stripe") {
        if (!stripe || !elements) {
          setError("Payment system is not ready. Please wait a moment.");
          setIsLoading(false);
          return;
        }

        if (!clientSecret) {
          await handlePaymentSetup();
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
          setError("Payment form not loaded correctly.");
          setIsLoading(false);
          return;
        }

        const { paymentIntent, error: paymentError } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardNumberElement,
              billing_details: { name },
            },
          });

        if (paymentError) {
          setError(paymentError.message || "Payment failed. Please try again.");
          setIsLoading(false);
          return;
        }

        const bookingData = {
          ...bookingDataBase,
          paymentIntentId: paymentIntent!.id,
        };

        await submitBooking(bookingData);
        setBookingSummary({
          ...bookingDataBase,
          guide: selectedGuide
            ? availableGuides.find((g) => g.id === selectedGuide)?.name
            : "None",
          paymentMethod: "stripe",
        });
      } else {
        // Cash payment
        const bookingData = { ...bookingDataBase };
        await submitBooking(bookingData);
        setBookingSummary({
          ...bookingDataBase,
          guide: selectedGuide
            ? availableGuides.find((g) => g.id === selectedGuide)?.name
            : "None",
          paymentMethod: "cash",
        });
      }
      setShowSuccess(true);
      setClientSecret(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit booking. Please try again."
      );
      console.error("Booking submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state if Stripe isn't ready and Stripe is selected
  if (paymentMethod === "stripe" && !stripeLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
          />
        </svg>
        <span className="ml-2 text-gray-700">Loading payment system...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="lg:col-span-1"
    >
      <div className="sticky top-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-800">Book This Tour</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="guests"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Number of Guests"
              title="Number of Guests"
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Tour Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
              required
              placeholder="Select a Date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do you need a guide?
            </label>
            <div className="flex items-center mt-2">
              <button
                type="button"
                onClick={() => setNeedsGuide(!needsGuide)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  needsGuide ? "bg-green-600" : "bg-gray-300"
                }`}
                title={needsGuide ? "Disable guide" : "Enable guide"}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    needsGuide ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="ml-2 text-sm text-gray-600">
                {needsGuide ? "Yes" : "No"}
              </span>
            </div>
          </div>
          {needsGuide && (
            <div>
              <label
                htmlFor="guide"
                className="block text-sm font-medium text-gray-700"
              >
                Select a Guide
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="guide"
                  value={selectedGuide}
                  onChange={(e) => setSelectedGuide(e.target.value)}
                  className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  title="Select a guide"
                >
                  <option value="">Choose a guide</option>
                  {availableGuides.map((guide) => (
                    <option key={guide.id} value={guide.id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
                {selectedGuide && (
                  <Link
                    to={`/guides/${selectedGuide}`}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          )}
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            clientSecret={clientSecret}
            setClientSecret={setClientSecret}
            cardErrors={cardErrors}
            setCardErrors={setCardErrors}
            cardBrand={cardBrand}
            setCardBrand={setCardBrand}
            handlePaymentSetup={handlePaymentSetup}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={
              isLoading ||
              (paymentMethod === "stripe" && (!stripe || !elements))
            }
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            )}
            {isLoading
              ? "Processing..."
              : paymentMethod === "stripe" && clientSecret
              ? "Confirm Payment"
              : "Book Now"}
          </button>
        </form>

        {showSuccess && bookingSummary && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-green-800">
              Booking Successful!
            </h3>
            <p className="text-sm text-gray-700 mt-2">Booking Summary:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Name: {bookingSummary.name}</li>
              <li>Email: {bookingSummary.email}</li>
              <li>Guests: {bookingSummary.guests}</li>
              <li>Date: {bookingSummary.date}</li>
              <li>
                Guide:{" "}
                {bookingSummary.needsGuide ? bookingSummary.guide : "No guide"}
              </li>
              <li>
                Payment Method:{" "}
                {bookingSummary.paymentMethod === "stripe"
                  ? "Stripe"
                  : "Cash on Arrival"}
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const WrappedBooking = (props: { tourId: string }) => (
  <Elements stripe={stripePromise}>
    <Booking {...props} />
  </Elements>
);

export default WrappedBooking;
