import { Router } from "express";
import {
    getMembersbyday,
    getMembersbymonth,
    getRevenuebymonth,
    getRevenuebyday,
    getSessionsbyday,
    getSessionsdayByType,
    getSessionsbymonth,
    getSessionsMonthByType,
} from "../controllers/ReportController";
import { db } from "../database";

const reportRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/reports/members/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get members by specific day
 *     description: Retrieve members who joined on a specific date
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/members/day", getMembersbyday);
/**
 * @swagger
 * /api/v1/reports/members/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get members by month
 *     description: Retrieve members who joined in a specific month
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly members retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/members/month", getMembersbymonth);
/**
 * @swagger
 * /api/v1/reports/revenue/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue by month
 *     description: Retrieve total revenue for a specific month
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly revenue retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/revenue/month", getRevenuebymonth);
/**
 * @swagger
 * /api/v1/reports/revenue/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue by day
 *     description: Retrieve total revenue for a specific day
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Daily revenue retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/revenue/day", getRevenuebyday);
/**
 * @swagger
 * /api/v1/reports/sessions/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by day
 *     description: Retrieve session count for a specific day
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Sessions retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/sessions/day", getSessionsbyday);
/**
 * @swagger
 * /api/v1/reports/sessions/day/type:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by day and type
 *     description: Retrieve session count for a specific day filtered by session type
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-05-15
 *       - in: query
 *         name: session_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gym, football, else]
 *     responses:
 *       200:
 *         description: Sessions by type retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/sessions/day/type", getSessionsdayByType);
/**
 * @swagger
 * /api/v1/reports/sessions/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by month
 *     description: Retrieve total sessions for a specific month
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly sessions retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/sessions/month", getSessionsbymonth);
/**
 * @swagger
 * /api/v1/reports/sessions/month/type:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by month and type
 *     description: Retrieve total sessions for a specific month filtered by session type
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *       - in: query
 *         name: session_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gym, football, else]
 *     responses:
 *       200:
 *         description: Monthly sessions by type retrieved
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
reportRouter.get("/sessions/month/type", getSessionsMonthByType);


/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     tags: [Reports]
 *     summary: Get gym analytics report
 *     description: Returns key analytics data for a specific gym
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayrevenue:
 *                   type: number
 *                   example: 1500
 *                 mothrevenue:
 *                   type: number
 *                   example: 32000
 *                 todaysessions:
 *                   type: integer
 *                   example: 25
 *                 todayMembers:
 *                   type: integer
 *                   example: 5
 *                 memberslogedtoday:
 *                   type: integer
 *                   example: 40
 *                 membersOfTheGym:
 *                   type: integer
 *                   example: 200
 *                 membersExpiringSoon:
 *                   type: integer
 *                   example: 12
 *                 activeMembers:
 *                   type: integer
 *                   example: 180
 *       400:
 *         description: Gym ID is required
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */


reportRouter.get("/", async (req, res) => {
  const gym_id = req.gym_id;
  try {
    if (!gym_id) {
      return res.status(400).json({ message: "gym_id is required" });
    }

    // check if gym exists
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    const todayrevenue = await db.getTodayRevenue(gym_id);
    const mothrevenue = await db.getmonthRevenue(gym_id);
    const todaysessions = await db.getTodaySessions(gym_id);
    const todayMembers = await db.getTodaymembers(gym_id);
    const memberslogedtoday = await db.getmemberslogedtoday(gym_id);
    const membersOfTheGym = await db.getMembersOfTheGym(gym_id);
    const membersExpiringSoon = await db.getMembersExpiringSoon(gym_id);
    const activeMembers = await db.getActiveMembers(gym_id);

    const analytics = {
      todayrevenue,
      mothrevenue,
      todaysessions,
      todayMembers,
      memberslogedtoday,
      membersOfTheGym,
      membersExpiringSoon,
      activeMembers,
    };
    res.status(200).json(analytics);
  } catch (error) {
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default reportRouter;
