import { Router } from "express";
import { createLog, getLogsByMemberId, getLastAttendanceWithDuration, getAllLogsByGym } from "../controllers/logsController";

const router = Router();
// NOTE: app.use("/api/v1/logs", logsRouter);
// Same issue in endpoints naming 
// 
router.post("/create", createLog);

// WARNING: Wrong API_DESIGN -> in GET apis we don't put anything in body and the reason why 
// is because we use body when we need to make a change in the server 
// so the question is, is that api make a change in the server ? or it's just get the logs of member_id
// so we when we do need to give a server our id or anything in GET api we put them in params or query 
router.get("/get", getLogsByMemberId);
router.get("/get-last-attendance", getLastAttendanceWithDuration);
router.get("/get-all-by-gym", getAllLogsByGym);



export default router;
