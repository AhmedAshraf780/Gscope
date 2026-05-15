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
 * /api/v1/logs/{member_id}:
 *   post:
 *     tags: [Logs]
 *     summary: Create a new log
 *     description: Create a new attendance log for a specific member
 *     parameters:
 *       - name: member_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Log created successfully"
 *       400:
 *         description: Invalid member ID or gym ID
 *       404:
 *         description: Member or gym not found
 *       500:
 *         description: Internal server error
 */
router.post("/:member_id", createLog);

/**
 * @swagger
 * /api/v1/logs/{member_id}:
 *   get:
 *     tags: [Logs]
 *     summary: Get logs by member ID
 *     description: Get all attendance logs for a specific member
 *     parameters:
 *       - name: member_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       400:
 *         description: Invalid member ID or gym ID
 *       404:
 *         description: Member, gym, or logs not found
 *       500:
 *         description: Internal server error
 */
router.get("/:member_id", getLogsByMemberId);

/**
 * @swagger
 * /api/v1/logs/{member_id}/last-attendance:
 *   get:
 *     tags: [Logs]
 *     summary: Get last attendance with duration
 *     description: Get the last attendance record with duration for a specific member
 *     parameters:
 *       - name: member_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved last attendance
 *         content:
 *           application/json:
 *             schema:
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
 *       400:
 *         description: Invalid member ID or gym ID
 *       404:
 *         description: Member, gym, or logs not found
 *       500:
 *         description: Internal server error
 */
router.get("/:member_id/last-attendance", getLastAttendanceWithDuration);

/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     tags: [Logs]
 *     summary: Get all logs
 *     description: Get all attendance logs for the gym
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       400:
 *         description: Invalid gym ID
 *       404:
 *         description: Gym or logs not found
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllLogsByGym);
export default router;
