import { Request, Response } from "express";
import { db } from "../database";

/**
 * @swagger
 * /api/v1/reports/members/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get members by day
 *     description: Get the count of members who joined on a specific date
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
 *     responses:
 *       200:
 *         description: Members count for the day
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getMembersbyday = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { date } = req.query;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "date is required" });
    }

    if (date.length !== 10) {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    if (date[4] !== "-" || date[7] !== "-") {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    for (let c of year + month + day) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "date must be only numbers" });
      }
    }

    const monthnum = Number(month);
    const daynum = Number(day);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    if (daynum < 1 || daynum > 31) {
      return res.status(400).json({ message: "invalid day" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const todayMembers = await db.getMembersbyday(Number(gym_id), date);
    return res
      .status(200)
      .json({
        members: todayMembers?.members,
        total: todayMembers?.total,
        message: "Members retrieved successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/members/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get members by month
 *     description: Get the count of members who joined in a specific month
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
 *           example: "2026-05"
 *     responses:
 *       200:
 *         description: Members count for the month
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getMembersbymonth = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { month } = req.query;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "month is required" });
    }

    if (month.length !== 7 || month[4] !== "-") {
      return res
        .status(400)
        .json({ message: "month must be in format YYYY-MM" });
    }

    const yearstr = month.substring(0, 4);
    const monthstr = month.substring(5, 7);

    for (let c of yearstr + monthstr) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "month must be only numbers" });
      }
    }

    const monthnum = Number(monthstr);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const monthlyMembers = await db.getMembersbymonth(Number(gym_id), month);
    return res.status(200).json(monthlyMembers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/revenue/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue by month
 *     description: Get total revenue for a specific month
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
 *           example: "2026-05"
 *     responses:
 *       200:
 *         description: Monthly revenue
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getRevenuebymonth = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { month } = req.query;

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "month is required" });
    }

    if (month.length !== 7 || month[4] !== "-") {
      return res
        .status(400)
        .json({ message: "month must be in format YYYY-MM" });
    }

    const yearstr = month.substring(0, 4);
    const monthstr = month.substring(5, 7);

    for (let c of yearstr + monthstr) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "month must be only numbers" });
      }
    }

    const monthnum = Number(monthstr);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const monthlyRevenue = await db.getRevenuebymonth(Number(gym_id), month);
    return res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/revenue/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue by day
 *     description: Get total revenue for a specific day
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
 *     responses:
 *       200:
 *         description: Daily revenue
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getRevenuebyday = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { date } = req.query;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "date is required" });
    }

    if (date.length !== 10) {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    if (date[4] !== "-" || date[7] !== "-") {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    for (let c of year + month + day) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "date must be only numbers" });
      }
    }

    const monthnum = Number(month);
    const daynum = Number(day);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    if (daynum < 1 || daynum > 31) {
      return res.status(400).json({ message: "invalid day" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const dayrevenue = await db.getRevenuebyday(Number(gym_id), date);
    return res.status(200).json(dayrevenue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/sessions/day:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by day
 *     description: Get the count of sessions for a specific day
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
 *     responses:
 *       200:
 *         description: Sessions count for the day
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getSessionsbyday = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { date } = req.query;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "date is required" });
    }

    if (date.length !== 10) {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    if (date[4] !== "-" || date[7] !== "-") {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    for (let c of year + month + day) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "date must be only numbers" });
      }
    }

    const monthnum = Number(month);
    const daynum = Number(day);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    if (daynum < 1 || daynum > 31) {
      return res.status(400).json({ message: "invalid day" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const todaySessions = await db.getSessionsbyday(Number(gym_id), date);
    return res.status(200).json(todaySessions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/sessions/day/type:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by day and type
 *     description: Get session count for a specific day filtered by session type
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
 *       - in: query
 *         name: session_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gym, football, else]
 *     responses:
 *       200:
 *         description: Sessions by type for the day
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getSessionsdayByType = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { date, session_type } = req.query;

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!session_type || typeof session_type !== "string") {
      return res.status(400).json({ message: "session_type is required" });
    }
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "month is required" });
    }

    if (!["gym", "football", "else"].includes(session_type.toLowerCase())) {
      return res.status(400).json({ message: "invalid session type" });
    }
    if (date.length !== 10) {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    if (date[4] !== "-" || date[7] !== "-") {
      return res
        .status(400)
        .json({ message: "date must be in format YYYY-MM-DD" });
    }

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    for (let c of year + month + day) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "date must be only numbers" });
      }
    }

    const monthnum = Number(month);
    const daynum = Number(day);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    if (daynum < 1 || daynum > 31) {
      return res.status(400).json({ message: "invalid day" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const DaySessionByType = await db.getSessionsdayByType(
      Number(gym_id),
      session_type.toLocaleLowerCase(),
      date,
    );
    return res.status(200).json(DaySessionByType);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/sessions/month:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by month
 *     description: Get total sessions for a specific month
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
 *           example: "2026-05"
 *     responses:
 *       200:
 *         description: Monthly sessions count
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getSessionsbymonth = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { month } = req.query;

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "month is required" });
    }

    if (month.length !== 7 || month[4] !== "-") {
      return res
        .status(400)
        .json({ message: "month must be in format YYYY-MM" });
    }

    const yearstr = month.substring(0, 4);
    const monthstr = month.substring(5, 7);

    for (let c of yearstr + monthstr) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "month must be only numbers" });
      }
    }

    const monthnum = Number(monthstr);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const MonthlySessions = await db.getSessionsbymonth(Number(gym_id), month);
    return res.status(200).json(MonthlySessions);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/sessions/month/type:
 *   get:
 *     tags: [Reports]
 *     summary: Get sessions by month and type
 *     description: Get total sessions for a specific month filtered by session type
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
 *           example: "2026-05"
 *       - in: query
 *         name: session_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gym, football, else]
 *     responses:
 *       200:
 *         description: Monthly sessions by type
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export const getSessionsMonthByType = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { month, session_type } = req.body;

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    if (!session_type || typeof session_type !== "string") {
      return res.status(400).json({ message: "session_type is required" });
    }
    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "month is required" });
    }

    if (!["gym", "football", "else"].includes(session_type.toLowerCase())) {
      return res.status(400).json({ message: "invalid session type" });
    }
    if (month.length !== 7 || month[4] !== "-") {
      return res
        .status(400)
        .json({ message: "month must be in format YYYY-MM" });
    }

    const yearstr = month.substring(0, 4);
    const monthstr = month.substring(5, 7);

    for (let c of yearstr + monthstr) {
      if (c < "0" || c > "9") {
        return res.status(400).json({ message: "month must be only numbers" });
      }
    }

    const monthnum = Number(monthstr);

    if (monthnum < 1 || monthnum > 12) {
      return res.status(400).json({ message: "invalid month" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const MonthlySessionsByType = await db.getSessionsMonthByType(
      Number(gym_id),
      session_type.toLocaleLowerCase(),
      month,
    );
    return res.status(200).json(MonthlySessionsByType);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/today/sessions:
 *   get:
 *     tags: [Reports]
 *     summary: Get today's sessions count
 *     description: Get the number of sessions for today
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Today's sessions count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getTodaySessions = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const todaysessions = await db.getTodaySessions(Number(gym_id));
    return res.status(200).json(todaysessions);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/today/revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Get today's revenue
 *     description: Get total revenue for today
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Today's revenue
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getTodayRevenue = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const todayrevenue = await db.getTodayRevenue(Number(gym_id));
    return res.status(200).json(todayrevenue);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/month/revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Get month revenue
 *     description: Get total revenue for the current month
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Month revenue
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getmonthRevenue = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const monthrevenue = await db.getmonthRevenue(Number(gym_id));
    return res.status(200).json(monthrevenue);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/today/members:
 *   get:
 *     tags: [Reports]
 *     summary: Get today's members count
 *     description: Get the number of members who joined today
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Today's members count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getTodaymembers = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const todayMembers = await db.getTodaymembers(Number(gym_id));
    return res.status(200).json(todayMembers);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/today/logged-members:
 *   get:
 *     tags: [Reports]
 *     summary: Get members logged today
 *     description: Get the count of members who checked in today
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Members logged today count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getmemberslogedtoday = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const memberslogedtoday = await db.getmemberslogedtoday(Number(gym_id));
    return res.status(200).json(memberslogedtoday);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/members/total:
 *   get:
 *     tags: [Reports]
 *     summary: Get total members in the gym
 *     description: Get the total number of members in the gym
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total members count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getMembersOfTheGym = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const MembersOfTheGym = await db.getMembersOfTheGym(Number(gym_id));
    return res.status(200).json(MembersOfTheGym);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/members/expiring-soon:
 *   get:
 *     tags: [Reports]
 *     summary: Get members expiring soon
 *     description: Get the count of members whose subscriptions are expiring soon
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Members expiring soon count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getMembersExpiringSoon = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const membersExpiringSoon = await db.getMembersExpiringSoon(Number(gym_id));
    return res.status(200).json(membersExpiringSoon);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/reports/members/active:
 *   get:
 *     tags: [Reports]
 *     summary: Get active members
 *     description: Get the count of currently active members
 *     parameters:
 *       - in: header
 *         name: gym_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active members count
 *       400:
 *         description: Invalid gym ID
 *       500:
 *         description: Internal server error
 */
export const getActiveMembers = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const activeMembers = await db.getActiveMembers(Number(gym_id));
    return res.status(200).json(activeMembers);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
