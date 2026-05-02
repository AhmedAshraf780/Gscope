import { Router, Request, Response } from "express";
import { db } from "../database";

const bankRouter = Router({ mergeParams: true });
bankRouter.get("/", async (req: Request, res: Response) => {
  const gym_id = req.gym_id;
  try {
    if (!gym_id) {
      return res.status(400).json({ message: "Gym ID is required" });
    }

    // check if gym exists
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      res.status(404).json({ message: "Gym not found" });
      return;
    }

    const money = await db.getBankMoney(gym_id);
    res.status(200).json({ money });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bankRouter;
