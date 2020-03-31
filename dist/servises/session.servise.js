"use strict";

exports.session_db = async function (req, res, next, user) {
  req.session.user = user;
  req.session.isAuthenticated = true;
  await req.session.save(function (err) {
    if (err) {
      res.status(400).json({ success: false, error: { name: "error session", message: "session doesn\'t saved" } });
      return next();
    }
  });
  return next();
};