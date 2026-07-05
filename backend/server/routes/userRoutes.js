const express = require("express");
const { body } = require("express-validator");
const {
  updateProfile,
  changePassword,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.put("/profile", upload.single("avatar"), updateProfile);
router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("New password must contain at least one number"),
  ],
  validate,
  changePassword
);

router.get("/", authorize("admin"), getUsers);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
