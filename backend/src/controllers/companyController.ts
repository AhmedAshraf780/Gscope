import { Request, Response } from 'express';
import { db } from '../database';

// WARNING: Unused controller
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    const companyId = await db.createCompany({
      name,
      email,
      phone,
      password,
      created_at: '',
      updated_at: '',
    });
    if (companyId) {
      res.status(201).json({ company_id: companyId });
    } else {
      res.status(500).json({ error: "Company not created" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { company_id } = req.params;
    const company = await db.getCompanyById(Number(company_id));
    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getAllCompanies = async (_req: Request, res: Response) => {
  try {
    const companies = await db.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { company_id } = req.params;
    const { name, email, phone, password } = req.body;
    await db.updateCompany(Number(company_id), {
      id: undefined,
      name,
      email,
      phone,
      password,
      created_at: '',
      updated_at: '',
    });
    res.status(200).json({ message: "Company updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const deleteCompanyById = async (_req: Request, res: Response) => {
  try {
    const { company_id } = _req.params;
    await db.deleteCompanyById(Number(company_id));
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

