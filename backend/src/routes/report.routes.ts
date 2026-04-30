import { Router } from "express";
import { getTodayMembers, getMonthlyMembers, getMonthlyRevenue, getActiveMembers, getTodaySessions, getMonthlySessions, getMonthlySessionsByType } from "../controllers/ReportController";

const reportRouter = Router({ mergeParams: true });

reportRouter.get('/', getTodayMembers);
reportRouter.get('/', getMonthlyMembers);
reportRouter.get('/', getMonthlyRevenue);
reportRouter.get('/', getActiveMembers);
reportRouter.get('/', getTodaySessions);
reportRouter.get('/', getMonthlySessions);
reportRouter.get('/', getMonthlySessionsByType);



export default reportRouter;