import db from "../models/db.js";

export const buyAsset = async (req, res) => {
  const { userId, asset, amount, price } = req.body;

  try {
    const tx = await db.transaction.create({
      data: {
        userId,
        type: "buy",
        asset,
        amount,
        price,
      },
    });

    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: "Buy transaction failed" });
  }
};
