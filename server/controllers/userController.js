import db from '../models/db.js';

export const upsertUser = async (req, res) => {
  const user = req.body;

  try {
    const existing = await db.user.findUnique({ where: { sub: user.sub } });

    if (existing) {
      return res.json(existing);
    }

    const newUser = await db.user.create({ data: user });
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User save failed' });
  }
};
