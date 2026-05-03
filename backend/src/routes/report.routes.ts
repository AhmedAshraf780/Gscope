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
        const Membersbyday = await db.getMembersbyday(gym_id, "");
        const Membersbymonth = await db.getMembersbymonth(gym_id, "");
        const Revenuebymonth = await db.getRevenuebymonth(gym_id, "");
        const revenuebyday = await db.getRevenuebyday(gym_id, "")
        const Sessionsbyday = await db.getSessionsbyday(gym_id, "");
        const daySessionByType = await db.getSessionsdayByType(gym_id, "", "");
        const monthlySessions = await db.getSessionsbymonth(gym_id, "");
        const monthlySessionsByType = await db.getSessionsMonthByType(
            gym_id,
            "",
            "",
        );

        const todayrevenue = await db.getTodayRevenue(gym_id)
        const mothrevenue = await db.getmonthRevenue(gym_id);
        const todaysessions = await db.getTodaySessions(gym_id);
        const todayMembers = await db.getTodaymembers(gym_id);
        const activeMembers = await db.getActiveMembers(gym_id);

        const analytics = {
            Membersbyday,
            Membersbymonth,
            Revenuebymonth,
            revenuebyday,
            Sessionsbyday,
            daySessionByType,
            monthlySessions,
            monthlySessionsByType,
            todayrevenue,
            mothrevenue,
            todaysessions,
            todayMembers,
            activeMembers,
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
