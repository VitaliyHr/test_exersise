
export async function SaveSession(req) {
  await req.session.save((err) => {
    if (err) {
      const error = 'Failed to save session';
      throw new Error(error);
    }
  });
}

export const DestroySession = (req, res, next) => {
  try {
    req.session.destroy(() => {
      res.status(203).json({ success: true });
      return next();
    });
  } catch (err) {
    const error = 'Failed to destroy session';
    throw new Error(error);
  }
};
