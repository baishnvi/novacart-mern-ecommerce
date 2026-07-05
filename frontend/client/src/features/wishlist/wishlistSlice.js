import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/cartService";
import { toast } from "react-toastify";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await wishlistService.getWishlist();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggle",
  async (productId, { getState, rejectWithValue }) => {
    const { wishlist } = getState();
    const exists = wishlist.products.some((p) => p._id === productId);
    try {
      if (exists) {
        await wishlistService.removeFromWishlist(productId);
        toast.info("Removed from wishlist");
        return { productId, action: "remove" };
      } else {
        await wishlistService.addToWishlist(productId);
        toast.success("Added to wishlist");
        return { productId, action: "add" };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update wishlist");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.products = action.payload.products || [];
        state.status = "succeeded";
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        if (action.payload.action === "remove") {
          state.products = state.products.filter((p) => p._id !== action.payload.productId);
        }
      });
  },
});

export default wishlistSlice.reducer;
