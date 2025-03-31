import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  StripeCardNumberElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardCvcElementChangeEvent,
} from "@stripe/stripe-js";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Common Stripe Element options
const elementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

interface CardErrors {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface PaymentMethodProps {
  paymentMethod: "stripe" | "cash";
  setPaymentMethod: (method: "stripe" | "cash") => void;
  clientSecret: string | null;
  setClientSecret: (secret: string | null) => void;
  cardErrors: CardErrors;
  setCardErrors: (
    errors: CardErrors | ((prev: CardErrors) => CardErrors)
  ) => void;
  cardBrand: string | null;
  setCardBrand: (brand: string | null) => void;
  handlePaymentSetup: () => Promise<void>;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
  clientSecret,
  setClientSecret,
  cardErrors,
  setCardErrors,
  cardBrand,
  setCardBrand,
  handlePaymentSetup,
}) => {
  const { t } = useTranslation(); // Hook to access translations
  const stripe = useStripe();
  const elements = useElements();

  // Handler for CardNumberElement changes
  const handleCardNumberChange = (
    event: StripeCardNumberElementChangeEvent
  ) => {
    const { error, brand } = event;
    setCardErrors((prev) => ({
      ...prev,
      cardNumber: error ? error.message : "",
    }));
    setCardBrand(brand === "unknown" ? null : brand);
  };

  // Handler for CardExpiryElement changes
  const handleCardExpiryChange = (
    event: StripeCardExpiryElementChangeEvent
  ) => {
    const { error } = event;
    setCardErrors((prev) => ({
      ...prev,
      expiry: error ? error.message : "",
    }));
  };

  // Handler for CardCvcElement changes
  const handleCardCvcChange = (event: StripeCardCvcElementChangeEvent) => {
    const { error } = event;
    setCardErrors((prev) => ({
      ...prev,
      cvc: error ? error.message : "",
    }));
  };

  const renderCardLogos = () => {
    const supportedCards = [
      { brand: "visa", icon: <FaCcVisa size={28} />, color: "#1A1F71" },
      {
        brand: "mastercard",
        icon: <FaCcMastercard size={28} />,
        color: "#FF5F00",
      },
      { brand: "amex", icon: <FaCcAmex size={28} />, color: "#2E77BC" },
      { brand: "discover", icon: <FaCcDiscover size={28} />, color: "#F68C1F" },
    ];

    return (
      <div className="flex items-center gap-3 mt-2">
        {supportedCards.map((card) => (
          <span
            key={card.brand}
            className={`transition-all duration-300 ${
              cardBrand === card.brand
                ? "opacity-100 scale-110"
                : cardBrand
                ? "opacity-20 scale-90"
                : "opacity-50 scale-100"
            }`}
            style={{ color: cardBrand === card.brand ? card.color : "#9CA3AF" }}
            title={t(`paymentMethod.cardBrands.${card.brand}`)}
          >
            {card.icon}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {t("paymentMethod.title")}
      </h3>
      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-md border border-green-200 space-y-4">
        <label
          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-300 ${
            paymentMethod === "stripe"
              ? "bg-green-200 border-green-400 shadow-lg"
              : "bg-white border-gray-300 hover:bg-gray-50"
          } border`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={paymentMethod === "stripe"}
            onChange={() => {
              setPaymentMethod("stripe");
              if (!clientSecret) handlePaymentSetup();
            }}
            className="text-green-600 focus:ring-green-500 h-5 w-5"
          />
          <FaCreditCard className="text-green-600 text-xl" />
          <div>
            <span className="text-sm font-medium text-gray-800">
              {t("paymentMethod.stripeTitle")}
            </span>
            <p className="text-xs text-gray-500">
              {t("paymentMethod.stripeDescription")}
            </p>
          </div>
        </label>
        <label
          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-300 ${
            paymentMethod === "cash"
              ? "bg-green-200 border-green-400 shadow-lg"
              : "bg-white border-gray-300 hover:bg-gray-50"
          } border`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => {
              setPaymentMethod("cash");
              setClientSecret(null);
            }}
            className="text-green-600 focus:ring-green-500 h-5 w-5"
          />
          <FaMoneyBillWave className="text-green-600 text-xl" />
          <div>
            <span className="text-sm font-medium text-gray-800">
              {t("paymentMethod.cashTitle")}
            </span>
            <p className="text-xs text-gray-500">
              {t("paymentMethod.cashDescription")}
            </p>
          </div>
        </label>
      </div>

      {paymentMethod === "stripe" && stripe && elements && (
        <div className="space-y-4 mt-4">
          <h4 className="text-md font-medium text-gray-700">
            {t("paymentMethod.cardInfoTitle")}
          </h4>
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              {t("paymentMethod.cardNumberLabel")}
            </label>
            <CardNumberElement
              id="cardNumber"
              options={elementOptions}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              onChange={handleCardNumberChange}
            />
            {renderCardLogos()}
            {cardErrors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">
                {cardErrors.cardNumber}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cardExpiry"
                className="block text-sm font-medium text-gray-700"
              >
                {t("paymentMethod.expiryLabel")}
              </label>
              <CardExpiryElement
                id="cardExpiry"
                options={elementOptions}
                className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                onChange={handleCardExpiryChange}
              />
              {cardErrors.expiry && (
                <p className="text-red-500 text-xs mt-1">{cardErrors.expiry}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="cardCvc"
                className="block text-sm font-medium text-gray-700"
              >
                {t("paymentMethod.cvcLabel")}
              </label>
              <CardCvcElement
                id="cardCvc"
                options={elementOptions}
                className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
                onChange={handleCardCvcChange}
              />
              {cardErrors.cvc && (
                <p className="text-red-500 text-xs mt-1">{cardErrors.cvc}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
