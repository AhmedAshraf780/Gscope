import { Router } from "express";
import { createCompany, getCompanyById, getCompanyByEmail, getAllCompanies, updateCompany, deleteCompanyById, updateCompanyPassword } from "../controllers/companyController";

const router = Router();
router.post("/create", createCompany);
router.get("/get/:company_id", getCompanyById);
router.get("/get-by-email/:email", getCompanyByEmail);
router.get("/get-all", getAllCompanies);
router.put("/update/:company_id", updateCompany);
router.delete("/delete/:company_id", deleteCompanyById);

router.put("/update-password/:email", updateCompanyPassword);

export default router;