import { Router } from "express";
import {
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompanyById,
} from "../controllers/companyController";

const router = Router();
/**
 * @swagger
 * /api/v1/companies/{company_id}:
 *   get:
 *     tags: [Company]
 *     summary: Get company by ID
 *     description: Retrieve a company by its ID
 *     parameters:
 *       - name: company_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "My Gym"
 *                 email:
 *                   type: string
 *                   example: "owner@gym.com"
 *                 phone:
 *                   type: string
 *                   example: "0111222333"
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.get("/:company_id", getCompanyById);
/**
 * @swagger
 * /api/v1/companies:
 *   get:
 *     tags: [Company]
 *     summary: Get all companies
 *     description: Retrieve a list of all companies
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllCompanies);
/**
 * @swagger
 * /api/v1/companies/{company_id}:
 *   put:
 *     tags: [Company]
 *     summary: Update company by ID
 *     description: Update an existing company's details
 *     parameters:
 *       - name: company_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Gym"
 *               email:
 *                 type: string
 *                 example: "owner@gym.com"
 *               phone:
 *                 type: string
 *                 example: "0111222333"
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully"
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.put("/:company_id", updateCompany);
/**
 * @swagger
 * /api/v1/companies/{company_id}:
 *   delete:
 *     tags: [Company]
 *     summary: Delete company by ID
 *     description: Delete a company by its ID
 *     parameters:
 *       - name: company_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company deleted successfully"
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:company_id", deleteCompanyById);
export default router;
