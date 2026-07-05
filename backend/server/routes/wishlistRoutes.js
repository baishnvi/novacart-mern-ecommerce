const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/", [body("productId").isMongoId().withMessage("Valid product id required")], validate, addToWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
