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
 * /reports/members/day:
 *   get:
 *     summary: Get members by specific day
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *       400:
 *         description: Invalid input
 */
reportRouter.get("/day", getMembersbyday);
/**
 * @swagger
 * /reports/members/month:
 *   get:
 *     summary: Get members by month
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly members retrieved
 */
reportRouter.get("/month", getMembersbymonth);
/**
 * @swagger
 * /reports/revenue/month:
 *   get:
 *     summary: Get revenue by month
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly revenue retrieved
 */
reportRouter.get("/month", getRevenuebymonth);
/**
 * @swagger
 * /reports/revenue/day:
 *   get:
 *     summary: Get revenue by day
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Daily revenue retrieved
 */
reportRouter.get("/day", getRevenuebyday);
/**
 * @swagger
 * /reports/sessions/day:
 *   get:
 *     summary: Get sessions by day
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-15
 *     responses:
 *       200:
 *         description: Sessions retrieved
 */
reportRouter.get("/day", getSessionsbyday);
/**
 * @swagger
 * /reports/sessions/day/type:
 *   get:
 *     summary: Get sessions by day and type
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
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
 */
reportRouter.get("/sessions/day/type", getSessionsdayByType);
/**
 * @swagger
 * /reports/sessions/month:
 *   get:
 *     summary: Get sessions by month
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05
 *     responses:
 *       200:
 *         description: Monthly sessions retrieved
 */
reportRouter.get("/month", getSessionsbymonth);
/**
 * @swagger
 * /reports/sessions/month/type:
 *   get:
 *     summary: Get sessions by month and type
 *     tags: [Reports]
 *     parameters:
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
 */
reportRouter.get("/sessions/month/type", getSessionsMonthByType);


/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Get gym analytics report
 *     description: Returns key analytics data for a specific gym.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the gym
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
 *       401:
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

    // // get bunch of analytics
    // const Membersbyday = await db.getMembersbyday(gym_id, "");
    // const Membersbymonth = await db.getMembersbymonth(gym_id, "");
    // const Revenuebymonth = await db.getRevenuebymonth(gym_id, "");
    // const revenuebyday = await db.getRevenuebyday(gym_id, "")
    // const Sessionsbyday = await db.getSessionsbyday(gym_id, "");
    // const daySessionByType = await db.getSessionsdayByType(gym_id, "", "");
    // const monthlySessions = await db.getSessionsbymonth(gym_id, "");
    // const monthlySessionsByType = await db.getSessionsMonthByType(
    //     gym_id,
    //     "",
    //     "",
    // );

    const todayrevenue = await db.getTodayRevenue(gym_id);
    const mothrevenue = await db.getmonthRevenue(gym_id);
    const todaysessions = await db.getTodaySessions(gym_id);
    const todayMembers = await db.getTodaymembers(gym_id);
    const memberslogedtoday = await db.getmemberslogedtoday(gym_id);
    const membersOfTheGym = await db.getMembersOfTheGym(gym_id);
    const membersExpiringSoon = await db.getMembersExpiringSoon(gym_id);
    const activeMembers = await db.getActiveMembers(gym_id);

    const analytics = {
      // Membersbyday,
      // Membersbymonth,
      // Revenuebymonth,
      // revenuebyday,
      // Sessionsbyday,
      // daySessionByType,
      // monthlySessions,
      // monthlySessionsByType,
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
