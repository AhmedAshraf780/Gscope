import { Router } from "express";
import { createLog, getLogsByMemberId, getLastAttendanceWithDuration, getAllLogsByGym } from "../controllers/logsController";

const router = Router();

router.post("/create", createLog);
router.get("/get", getLogsByMemberId);
router.get("/get-last-attendance", getLastAttendanceWithDuration);
router.get("/get-all-by-gym", getAllLogsByGym);



export default router;