import { Router, Request, Response } from "express";
import { db } from "../database";

const offerRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/offers:
 * get:
 * summary: Get all offers
 * description: Get all offers for a specific gym
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved offers
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Offer'
 *   401:
 *     description: Gym not found
 */
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
    res.errorMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/v1/offers:
 * post:
 * summary: Add a new offer
 * description: Add a new offer for a specific gym
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             example: "Summer Offer"
 *           months:
 *             type: integer
 *             example: 6
 *           price:
 *             type: number
 *             example: 500
 *           end_date:
 *             type: string
 *             format: date
 *             example: "2026-12-31"
 * responses:
 *   201:
 *     description: Offer added successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Offer added successfully"
 *             offerId:
 *               type: integer
 *               example: 1
 *   401:
 *     description: Gym not found
 */
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
    res.errorMsg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/v1/offers/available:
 * get:
 * summary: Get available offers
 * description: Get available offers for a specific gym
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved offers
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Offer'
 *   401:
 *     description: Gym not found
 */
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
    res.errorMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default offerRouter;
