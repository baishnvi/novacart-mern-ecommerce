import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, X, Tag } from "lucide-react";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
} from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";
import QuantityStepper from "../components/ui/QuantityStepper";
import Button from "../components/ui/Button";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 9.99;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, coupon, status } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const discountAmount =
    coupon?.code && coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon?.code
      ? coupon.discountValue
      : 0;

  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const taxPrice = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const shippingPrice =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : FLAT_SHIPPING_RATE;
  const total = discountedSubtotal + taxPrice + shippingPrice;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    dispatch(applyCoupon(couponInput.trim()));
  };

  if (!isAuthenticated) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag size={40} className="text-stone" strokeWidth={1.25} />
        <h2 className="font-display text-2xl">Sign in to view your bag</h2>
        <Link to="/login" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (status !== "loading" && items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag size={40} className="text-stone" strokeWidth={1.25} />
        <h2 className="font-display text-2xl">Your bag is empty</h2>
        <p className="text-sm text-stone">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="mb-8 font-display text-4xl tracking-tightest">Your Bag</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col divide-y divide-hairline dark:divide-hairline-dark">
          {items.map((item) => (
            <div key={item._id} className="flex gap-5 py-6 first:pt-0">
              <img src={item.image} alt={item.name} className="h-32 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-stone">
                      {item.color && `${item.color} `}
                      {item.size && `· Size ${item.size}`}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(removeCartItem(item._id))}
                    className="text-stone hover:text-ink dark:hover:text-cream"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantityStepper
                    quantity={item.quantity}
                    onIncrease={() =>
                      dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))
                    }
                    onDecrease={() =>
                      dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))
                    }
                  />
                  <span className="text-base font-semibold tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-surface h-fit p-6">
          <h3 className="mb-5 font-display text-xl">Order Summary</h3>

          <div className="mb-5 flex gap-2">
            <div className="relative flex-1">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="input-field !pl-9 !py-2.5 text-sm"
              />
            </div>
            <Button onClick={handleApplyCoupon} variant="secondary" size="sm">
              Apply
            </Button>
          </div>

          {coupon?.code && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gold/10 px-3 py-2 text-xs">
              <span className="font-medium text-gold-dark">Coupon "{coupon.code}" applied</span>
              <button onClick={() => dispatch(removeCoupon())} className="text-stone hover:text-ink">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-hairline pt-4 text-sm dark:border-hairline-dark">
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
              <span>Estimated Tax</span>
              <span className="tabular-nums">{formatCurrency(taxPrice)}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Shipping</span>
              <span className="tabular-nums">
                {shippingPrice === 0 ? "Free" : formatCurrency(shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between border-t border-hairline pt-3 text-base font-semibold dark:border-hairline-dark">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button onClick={() => navigate("/checkout")} className="mt-6 w-full">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
