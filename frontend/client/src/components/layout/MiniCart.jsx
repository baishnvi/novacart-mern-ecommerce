import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { closeMiniCart, updateCartItem, removeCartItem } from "../../features/cart/cartSlice";
import { formatCurrency } from "../../utils/formatters";
import QuantityStepper from "../ui/QuantityStepper";
import Button from "../ui/Button";

const MiniCart = () => {
  const dispatch = useDispatch();
  const { isMiniCartOpen, items, subtotal } = useSelector((state) => state.cart);

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeMiniCart())}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory dark:bg-charcoal"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5 dark:border-hairline-dark">
              <h3 className="font-display text-xl">Your Bag ({items.length})</h3>
              <button
                onClick={() => dispatch(closeMiniCart())}
                className="rounded-full p-2 hover:bg-ink/5 dark:hover:bg-cream/10"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag size={40} className="text-stone" strokeWidth={1.25} />
                <p className="text-sm text-stone">Your bag is empty</p>
                <Button variant="secondary" onClick={() => dispatch(closeMiniCart())}>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="flex flex-col gap-5">
                    {items.map((item) => (
                      <li key={item._id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-20 rounded-lg object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-stone">
                              {item.color && `${item.color} `}
                              {item.size && `· ${item.size}`}
                            </p>
                            <p className="mt-1 text-sm font-semibold tabular-nums">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              quantity={item.quantity}
                              onIncrease={() =>
                                dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))
                              }
                              onDecrease={() =>
                                dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))
                              }
                            />
                            <button
                              onClick={() => dispatch(removeCartItem(item._id))}
                              className="text-xs text-stone underline-offset-2 hover:text-ink hover:underline dark:hover:text-cream"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-hairline px-6 py-6 dark:border-hairline-dark">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-stone">Subtotal</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(subtotal)}</span>
                  </div>
                  <Link to="/cart" onClick={() => dispatch(closeMiniCart())}>
                    <Button className="w-full">View Bag & Checkout</Button>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MiniCart;
