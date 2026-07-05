const express = require("express");
const {
  getProducts,
  getProductBySlug,
  getProductCollection,
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createProductValidator, updateProductValidator } = require("../validators/productValidators");

const router = express.Router();

router.get("/", getProducts);
router.get("/collections/:type", getProductCollection);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 6),
  createProductValidator,
  validate,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 6),
  updateProductValidator,
  validate,
  updateProduct
);

router.delete("/:id/images/:imageId", protect, authorize("admin"), deleteProductImage);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
