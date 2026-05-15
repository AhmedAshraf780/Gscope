import { Router, Request, Response } from "express";
import { db } from "../database";

const bankRouter = Router({ mergeParams: true });
/**
 * @swagger
 * /api/v1/bank:
 * get:
 * summary: Get bank money
 * description: Get bank money
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved bank money
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             money:
 *               type: number
 *               example: 1000
 *   401:
 *     description: Gym not found
 */
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
    res.errorMsg = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bankRouter;
