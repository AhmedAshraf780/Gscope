export interface Company {
    id?: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    created_at: string;
    updated_at: string;
}
export interface CompanyDao {
    createCompany(company: Company): Promise<number | undefined>;
    getCompanyById(id: number): Promise<Company | null>;
    getCompanyByEmail(email: string): Promise<Company | null>;
    getAllCompanies(): Promise<Company[]>;
    updateCompany(id: number, company: Company): Promise<void>;
    deleteCompanyById(id: number): Promise<void>;
    updateCompanyPassword(email: string, password: string): Promise<boolean>;
}

