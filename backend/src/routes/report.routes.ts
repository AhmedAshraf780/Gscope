import { Router } from "express";
// import {
//   getTodayMembers,
//   getMonthlyMembers,
//   getMonthlyRevenue,
//   getActiveMembers,
//   getTodaySessions,
//   getMonthlySessions,
//   getMonthlySessionsByType,
// } from "../controllers/ReportController";
import { db } from "../database";

const reportRouter = Router({ mergeParams: true });

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

    // get bunch of analytics
    const todayMembers = await db.getTodayMembers(gym_id, "");
    const monthlyMembers = await db.getMonthlyMembers(gym_id, "");
    const monthlyRevenue = await db.getMonthlyRevenue(gym_id, "");
    const activeMembers = await db.getActiveMembers(gym_id);
    const todaySessions = await db.getTodaySessions(gym_id, "");
    const monthlySessions = await db.getMonthlySessions(gym_id, "");
    const monthlySessionsByType = await db.getMonthlySessionsByType(
      gym_id,
      "",
      "",
    );
    const analytics = {
      todayMembers,
      monthlyMembers,
      monthlyRevenue,
      activeMembers,
      todaySessions,
      monthlySessions,
      monthlySessionsByType,
    };
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// reportRouter.get('/', getTodayMembers);
// reportRouter.get('/', getMonthlyMembers);
// reportRouter.get('/', getMonthlyRevenue);
// reportRouter.get('/', getActiveMembers);
// reportRouter.get('/', getTodaySessions);
// reportRouter.get('/', getMonthlySessions);
// reportRouter.get('/', getMonthlySessionsByType);

export default reportRouter;
