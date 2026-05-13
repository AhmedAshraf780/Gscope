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
 * post:
 * summary: add new member
 * description: add new member to the gym
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         items:
 *           $ref: '#/components/schemas/Member'
 *         example:
 *           name: "John Doe"
 *           phone: "0111222333"
 *           months: 12
 *           price: 1200
 *           notes: ""
 *           offer_id: 12
 * responses:
 *   200:
 *     description: Member added successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Member added successfully"
 *           ok: true
 *           member_id: 1234567890
 *     401:
 *       description: Invalid credentials, bad request, or user already exists
 */
memberRouter.post("/", addMember);

/**
 * @swagger
 * /api/v1/members/{id}:
 * delete:
 * summary: delete member
 * description: delete member from the gym
 * parameters:
 * - name: id
 *   in: path
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Member deleted successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Member deleted successfully"
 *           ok: true
 *     401:
 *       description: Invalid credentials, bad request, or user not found
 */
memberRouter.delete("/:id", deleteMember);

/**
 * @swagger
 * /api/v1/members/{id}:
 * put:
 * summary: update member
 * description: update member in the gym
 * parameters:
 * - name: id
 *   in: path
 *   required: true
 *   schema:
 *     type: integer
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         items:
 *           $ref: '#/components/schemas/Member'
 *         example:
 *           months: 12
 *           price: 1200
 * responses:
 *   200:
 *     description: Member updated successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Member updated successfully"
 *           ok: true
 *     401:
 *       description: Invalid credentials, bad request, or user not found
 */
memberRouter.put("/:id", updateMember);

/**
 * @swagger
 * /api/v1/members/{id}:
 * get:
 * summary: get member by id
 * description: get member by id from the gym
 * parameters:
 * - name: id
 *   in: path
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Member found successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Member found successfully"
 *           ok: true
 *           member: ["member1"]
 *     401:
 *       description: Invalid credentials, bad request, or user not found
 */
memberRouter.get("/:id", getMemberById);

/**
 * @swagger
 * /api/v1/members/filter:
 * get:
 * summary: get member by name
 * description: get member by name from the gym
 * parameters:
 * - name: name
 *   in: query
 *   required: true
 *   schema:
 *     type: string
 * responses:
 *   200:
 *     description: Member found successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Member found successfully"
 *           ok: true
 *           members: ["member1"]
 *     401:
 *       description: Invalid credentials, bad request, or user not found
 */
memberRouter.get("/filter", getMemberByName);

/**
 * @swagger
 * /api/v1/members:
 * get:
 * summary: list members of gym
 * description: list members of gym from the gym
 * responses:
 *   200:
 *     description: Members listed successfully
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/components/schemas/Member'
 *         example:
 *           message: "Members listed successfully"
 *           ok: true
 *           members: ["member1", "member2", "member3"]
 *     401:
 *       description: Invalid credentials, bad request, or no members found
 */
memberRouter.get("/", listMembersOfGym);

export default memberRouter;
