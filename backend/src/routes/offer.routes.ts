import { Router, Request, Response } from "express";
import { db } from "../database";

const offerRouter = Router({ mergeParams: true });

offerRouter.get("/", async (req: Request, res: Response) => {
  const gym_id = req.gym_id;
  try {
    if (!gym_id) {
      return res.status(400).json({ message: "Gym ID is required" });
    }

    // check if gym_id exists
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    // return all the offers
    const offers = await db.getOffers(gym_id);
    return res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

offerRouter.post("/", async (req: Request, res: Response) => {
  const gym_id = req.gym_id;
  const { name, months, price, end_date } = req.body;
  try {
    if (!gym_id) {
      return res.status(400).json({ message: "Gym ID is required" });
    }

    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    const offerId = await db.addOffer(gym_id, {
      gym_id,
      name,
      months,
      price,
      offer_end_date: end_date,
    });
    return res
      .status(201)
      .json({ message: "Offer added successfully", offerId });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

offerRouter.get("/available", async (req: Request, res: Response) => {
  const gym_id = req.gym_id;
  try {
    if (!gym_id) {
      return res.status(400).json({ message: "Gym ID is required" });
    }

    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    const offers = await db.getAvailableOffers(gym_id);
    return res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default offerRouter;
