"use strict";

module.exports = function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(400).json({ success: false, error: { name: "Access error", message: "You are not logined to do it" } });
  }
  return next();
};