import { Router } from "express";
import {
  addMember,
  deleteMember,
  getMemberById,
  getMemberByName,
  listMembersOfGym,
  updateMember,
} from "../controllers/MemberController";

const memberRouter = Router({ mergeParams: true });
/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     tags: [Members]
 *     summary: Add a new member
 *     description: Add a new member to the gym
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - months
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "0111222333"
 *               months:
 *                 type: integer
 *                 example: 12
 *               price:
 *                 type: number
 *                 example: 1200
 *               notes:
 *                 type: string
 *                 example: "Prefers evening sessions"
 *               offer_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member added successfully"
 *       400:
 *         description: Bad request or gym not found
 *       500:
 *         description: Internal server error
 */
memberRouter.post("/", addMember);

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     tags: [Members]
 *     summary: List all members of the gym
 *     description: Get a list of all members belonging to the gym
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Members listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       400:
 *         description: Bad request or gym not found
 *       500:
 *         description: Internal server error
 */
memberRouter.get("/", listMembersOfGym);

/**
 * @swagger
 * /api/v1/members/filter:
 *   get:
 *     tags: [Members]
 *     summary: Get member by name
 *     description: Find a member by their name
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found successfully
 *       400:
 *         description: Bad request or gym not found
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal server error
 */
memberRouter.get("/filter", getMemberByName);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     tags: [Members]
 *     summary: Get member by ID
 *     description: Retrieve a single member by their ID
 *     parameters:
 *       - name: id
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
 *         description: Member found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member:
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Bad request or gym not found
 *       500:
 *         description: Internal server error
 */
memberRouter.get("/:id", getMemberById);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   put:
 *     tags: [Members]
 *     summary: Update a member
 *     description: Update a member's subscription details (months and price)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - months
 *               - price
 *             properties:
 *               months:
 *                 type: integer
 *                 example: 6
 *               price:
 *                 type: number
 *                 example: 600
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Bad request or gym/member not found
 *       500:
 *         description: Internal server error
 */
memberRouter.put("/:id", updateMember);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   delete:
 *     tags: [Members]
 *     summary: Delete a member
 *     description: Delete a member from the gym
 *     parameters:
 *       - name: id
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
 *         description: Member deleted successfully
 *       400:
 *         description: Bad request or gym/member not found
 *       500:
 *         description: Internal server error
 */
memberRouter.delete("/:id", deleteMember);

export default memberRouter;
