import { Router } from "express";
import {
  createLog,
  getLogsByMemberId,
  getLastAttendanceWithDuration,
  getAllLogsByGym,
} from "../controllers/logsController";

const router = Router({ mergeParams: true });
router.post("/:member_id", createLog);
router.get("/:member_id", getLogsByMemberId);
router.get("/get-last-attendance/:member_id", getLastAttendanceWithDuration);
router.get("/", getAllLogsByGym);
export default router;
