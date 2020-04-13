
export async function SaveSession(req) {
  await req.session.save((err) => {
    if (err) {
      console.log(err);
      const error = `Failed to save session. Error:${err}`;
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
    console.log(err);
    const error = `failed to destroy session. Error:${err}`;
    throw new Error(error);
  }
};
