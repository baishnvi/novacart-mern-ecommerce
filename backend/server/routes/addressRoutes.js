const express = require("express");
const { body } = require("express-validator");
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getAddresses);
router.post(
  "/",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("addressLine1").trim().notEmpty().withMessage("Address line 1 is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("postalCode").trim().notEmpty().withMessage("Postal code is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
  ],
  validate,
  createAddress
);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
