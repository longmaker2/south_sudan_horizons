import dotenv from "dotenv";
dotenv.config();

export const STRIPE_PUBLISHABLE_KEY =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || // For CRA
  import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || // For Vite
  "pk_test_51R1V6q07gKx24rpiZjXRcf84SdMraXj90Ze5W8ScYyWfs6GrimmkipURPoNoinDrVC7gu4oLnobwxlPMPXBvwOJz00iMMbS7qK";
