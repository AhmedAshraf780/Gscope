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
 * get:
 * summary: Get company by ID
 * description: Get company by ID
 * parameters:
 * - name: company_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved company
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             company_id:
 *               type: integer
 *               example: 123
 *             name:
 *               type: string
 *               example: "Gym"
 *             address:
 *               type: string
 *               example: "123 Main St"
 *   401:
 *     description: Company not found
 */
router.get("/:company_id", getCompanyById);
/**
 * @swagger
 * /api/v1/companies:
 * get:
 * summary: Get all companies
 * description: Get all companies
 * parameters:
 * - name: gym_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully retrieved companies
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Company'
 *   401:
 *     description: Companies not found
 */
router.get("/", getAllCompanies);
/**
 * @swagger
 * /api/v1/companies/{company_id}:
 * put:
 * summary: Update company by ID
 * description: Update company by ID
 * parameters:
 * - name: company_id
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
 *           name:
 *             type: string
 *             example: "Gym"
 *           address:
 *             type: string
 *             example: "123 Main St"
 * responses:
 *   200:
 *     description: Successfully updated company
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Company updated successfully"
 *             company_id:
 *               type: integer
 *               example: 123
 *   401:
 *     description: Company not found
 */
router.put("/:company_id", updateCompany);
/**
 * @swagger
 * /api/v1/companies/{company_id}:
 * delete:
 * summary: Delete company by ID
 * description: Delete company by ID
 * parameters:
 * - name: company_id
 *   in: header
 *   required: true
 *   schema:
 *     type: integer
 * responses:
 *   200:
 *     description: Successfully deleted company
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Company deleted successfully"
 *             company_id:
 *               type: integer
 *               example: 123
 *   401:
 *     description: Company not found
 */
router.delete("/:company_id", deleteCompanyById);
export default router;
