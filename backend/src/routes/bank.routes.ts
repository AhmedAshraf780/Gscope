import { Router, Request, Response } from "express";
import { db } from "../database";

const bankRouter = Router({ mergeParams: true });
bankRouter.get("/", async (req: Request, res: Response) => {
  const gym_id = Number(req.params.gym_id);
  try {

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
})

export default bankRouter;
