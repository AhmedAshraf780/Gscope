import { Router } from "express";
import {
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompanyById,
} from "../controllers/companyController";

const router = Router();
router.get("/:company_id", getCompanyById);
router.get("/", getAllCompanies);
router.put("/:company_id", updateCompany);
router.delete("/:company_id", deleteCompanyById);

export default router;
