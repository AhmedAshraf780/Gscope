import { Router } from "express";
import { createCompany, getCompanyById, getCompanyByEmail, getAllCompanies, updateCompany, deleteCompanyById, updateCompanyPassword } from "../controllers/companyController";

const router = Router();

// FIX: API_DESIGN issue 
// /members [POST]  -> means addMember
// /members [GET]  -> means listALLMembers 
// /members/:id [GET]  -> means give me this member with this id 
// /members/?name [GET]  -> means give me this member with this name but name now will be in query 
// /members/:id [DELETE]  -> means delete this member with this id
// /members/:id [PUT OR PATCH]  -> means update this member with this id

// NOTE: SO you don't need actually to specify the functionality in endpoint 
// so don't tell me to add a members call me in endpoint /addMember ???

// TODO: ReWrite the endpoint after you understood the REST DESIGN

// WARNING: this endpoint will not be used, it's part of authRoutes that i already did (SIGNGUP is creating a company indeed)
router.post("/create", createCompany);

router.get("/get/:company_id", getCompanyById);
router.get("/get-by-email/:email", getCompanyByEmail);
router.get("/get-all", getAllCompanies);
router.put("/update/:company_id", updateCompany);
router.delete("/delete/:company_id", deleteCompanyById);

// WARNING: this endpoint will not be used, it's part of authRoutes that i already did
router.put("/update-password/:email", updateCompanyPassword);

export default router;
