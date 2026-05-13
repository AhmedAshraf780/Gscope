import { Router } from "express";
import {
  createLog,
  getLogsByMemberId,
  getLastAttendanceWithDuration,
  getAllLogsByGym,
} from "../controllers/logsController";

const router = Router({ mergeParams: true });
/**
 * @swagger
 * /api/v1/logs:
 * post:
 * summary: Create a new log
 * description: Create a new log for a specific member
 * parameters:
 * - name: member_id
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
 *           member_id:
 *             type: integer
 *             example: 123
 *           log_type:
 *             type: string
 *             enum: ["entry", "exit"]
 *             example: "entry"
 * responses:
 *   201:
 *     description: Log created successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Log created successfully"
 *             log_id:
 *               type: integer
 *               example: 1
 *   401:
 *     description: Member not found
 */
router.post("/:member_id", createLog);

/**
 * @swagger
 * /api/v1/logs/{member_id}:
 * get:
 * summary: Get logs by member ID
 * description: Get logs for a specific member
 * parameters:
 * - name: member_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved logs
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Log'
 *   401:
 *     description: Member not found
 */
router.get("/:member_id", getLogsByMemberId);

/**
 * @swagger
 * /api/v1/logs/get-last-attendance/{member_id}:
 * get:
 * summary: Get last attendance with duration
 * description: Get last attendance with duration for a specific member
 * parameters:
 * - name: member_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved last attendance
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Last attendance retrieved successfully"
 *             last_attendance:
 *               type: object
 *               properties:
 *                 member_id:
 *                   type: integer
 *                   example: 123
 *                 entry_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-14T10:00:00Z"
 *                 exit_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-14T12:00:00Z"
 *                 duration:
 *                   type: string
 *                   example: "2 hours"
 *   401:
 *     description: Member not found
 */
router.get("/get-last-attendance/:member_id", getLastAttendanceWithDuration);

/**
 * @swagger
 * /api/v1/logs:
 * get:
 * summary: Get all logs
 * description: Get all logs for a specific gym
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved logs
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Log'
 *   401:
 *     description: Gym not found
 */
router.get("/", getAllLogsByGym);
export default router;
