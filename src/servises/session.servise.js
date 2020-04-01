
export async function session_db(req, res, next, user) {
  req.session.user = user;
  req.session.isAuthenticated = true;
  try {
    await req.session.save((err) => {
      if (err) {
        res.status(400).json({ success: false, error: { name: "error session", message: "session doesn\'t saved" } });
        return next();
      }
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failing while saving session", errorSthamp:err } });
    return next();
  }
  res.status(200).json({ success: true, user: req.session.user });
  return next();
}