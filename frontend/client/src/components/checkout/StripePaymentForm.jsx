import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "../ui/Button";

const StripePaymentForm = ({ onSuccess, isPlacingOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        isLoading={isProcessing || isPlacingOrder}
        className="w-full"
      >
        Pay & Place Order
      </Button>
    </form>
  );
};

export default StripePaymentForm;
