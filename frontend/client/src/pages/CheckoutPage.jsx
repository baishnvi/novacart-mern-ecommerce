import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { orderService, addressService } from "../services/cartService";
import { resetCartLocal } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import StripePaymentForm from "../components/checkout/StripePaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 9.99;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, coupon } = useSelector((state) => state.cart);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [step, setStep] = useState("address");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    addressService.getAddresses().then((res) => {
      setSavedAddresses(res.data);
      const def = res.data.find((a) => a.isDefault) || res.data[0];
      if (def) setSelectedAddressId(def._id);
      else setShowNewAddressForm(true);
    });
  }, []);

  const discountAmount =
    coupon?.code && coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon?.code
      ? coupon.discountValue
      : 0;
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const taxPrice = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const shippingPrice = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = discountedSubtotal + taxPrice + shippingPrice;

  const getShippingAddress = () => {
    if (showNewAddressForm) return null;
    const addr = savedAddresses.find((a) => a._id === selectedAddressId);
    return addr;
  };

  const proceedToPayment = async (formData) => {
    let shippingAddress = getShippingAddress();

    if (showNewAddressForm) {
      try {
        const res = await addressService.createAddress(formData);
        shippingAddress = res.data;
        setSavedAddresses((prev) => [...prev, res.data]);
        setSelectedAddressId(res.data._id);
        setShowNewAddressForm(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not save address");
        return;
      }
    }

    if (!shippingAddress) {
      toast.error("Please select or add a shipping address");
      return;
    }

    try {
      const res = await orderService.createPaymentIntent();
      setClientSecret(res.data.clientSecret);
      setStep("payment");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not initialize payment");
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    setIsPlacingOrder(true);
    try {
      const shippingAddress = getShippingAddress();
      const res = await orderService.createOrder({
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod: "stripe",
        paymentIntentId,
      });
      dispatch(resetCartLocal());
      toast.success("Order placed successfully!");
      navigate(`/dashboard/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="mb-8 font-display text-4xl tracking-tightest">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {step === "address" ? (
            <div>
              <h2 className="mb-4 font-display text-xl">Shipping Address</h2>

              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="mb-6 flex flex-col gap-3">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`card-surface flex cursor-pointer items-start gap-3 p-4 ${
                        selectedAddressId === addr._id ? "!border-gold" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1 accent-gold"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-stone">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                        <p className="text-stone">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-sm font-medium text-gold underline-offset-2 hover:underline"
                  >
                    + Add a new address
                  </button>
                </div>
              )}

              {showNewAddressForm && (
                <form onSubmit={handleSubmit(proceedToPayment)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    {...register("fullName", { required: "Full name is required" })}
                    error={errors.fullName?.message}
                  />
                  <Input
                    label="Phone"
                    {...register("phone", { required: "Phone is required" })}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Address Line 1"
                    className="sm:col-span-2"
                    {...register("addressLine1", { required: "Address is required" })}
                    error={errors.addressLine1?.message}
                  />
                  <Input label="Address Line 2 (optional)" {...register("addressLine2")} />
                  <Input
                    label="City"
                    {...register("city", { required: "City is required" })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    {...register("state", { required: "State is required" })}
                    error={errors.state?.message}
                  />
                  <Input
                    label="Postal Code"
                    {...register("postalCode", { required: "Postal code is required" })}
                    error={errors.postalCode?.message}
                  />
                  <Input
                    label="Country"
                    {...register("country", { required: "Country is required" })}
                    error={errors.country?.message}
                  />
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}

              {!showNewAddressForm && savedAddresses.length > 0 && (
                <Button onClick={handleSubmit(proceedToPayment)} className="w-full">
                  Continue to Payment
                </Button>
              )}
            </div>
          ) : (
            <div>
              <h2 className="mb-4 font-display text-xl">Payment</h2>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm onSuccess={handlePaymentSuccess} isPlacingOrder={isPlacingOrder} />
                </Elements>
              )}
              <button
                onClick={() => setStep("address")}
                className="mt-4 text-sm text-stone underline-offset-2 hover:underline"
              >
                &larr; Back to shipping address
              </button>
            </div>
          )}
        </div>

        <div className="card-surface h-fit p-6">
          <h3 className="mb-5 font-display text-xl">Order Summary</h3>
          <div className="mb-4 flex flex-col gap-3 border-b border-hairline pb-4 dark:border-hairline-dark">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-stone">
                  {item.name} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-stone">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone">
              <span>Tax</span>
              <span className="tabular-nums">{formatCurrency(taxPrice)}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Shipping</span>
              <span className="tabular-nums">{shippingPrice === 0 ? "Free" : formatCurrency(shippingPrice)}</span>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 text-base font-semibold dark:border-hairline-dark">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
