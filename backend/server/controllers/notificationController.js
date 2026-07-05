const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const getNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const notifications = await Notification.find({ user: req.user._id })
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  const total = await Notification.countDocuments({ user: req.user._id });

  return sendSuccess(res, 200, "Notifications fetched successfully", notifications, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    unreadCount,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw ApiError.notFound("Notification not found");

  return sendSuccess(res, 200, "Notification marked as read", notification);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  return sendSuccess(res, 200, "All notifications marked as read");
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) throw ApiError.notFound("Notification not found");

  return sendSuccess(res, 200, "Notification deleted");
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
