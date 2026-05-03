import { Request, Response } from 'express';
import { db } from '../database';

export const getMembersbyday = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        const { date } = req.body;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "date is required" })
        }

        if (date.length !== 10) {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        if (date[4] !== '-' || date[7] !== '-') {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);

        for (let c of year + month + day) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "date must be only numbers" })
            }
        }

        const monthnum = Number(month);
        const daynum = Number(day);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        if (daynum < 1 || daynum > 31) {
            return res.status(400).json({ message: "invalid day" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const todayMembers = await db.getMembersbyday(Number(gym_id), date);
        return res.status(200).json(todayMembers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMembersbymonth = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        const { month } = req.body;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!month || typeof month !== 'string') {
            return res.status(400).json({ message: "month is required" })
        }

        if (month.length !== 7 || month[4] !== '-') {
            return res.status(400).json({ message: "month must be in format YYYY-MM" })
        }

        const yearstr = month.substring(0, 4);
        const monthstr = month.substring(5, 7);

        for (let c of yearstr + monthstr) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "month must be only numbers" })
            }
        }

        const monthnum = Number(monthstr);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }


        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }

        const monthlyMembers = await db.getMembersbymonth(Number(gym_id), month);
        return res.status(200).json(monthlyMembers);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getRevenuebymonth = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        const { month } = req.body;

        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!month || typeof month !== 'string') {
            return res.status(400).json({ message: "month is required" })
        }

        if (month.length !== 7 || month[4] !== '-') {
            return res.status(400).json({ message: "month must be in format YYYY-MM" })
        }

        const yearstr = month.substring(0, 4);
        const monthstr = month.substring(5, 7);

        for (let c of yearstr + monthstr) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "month must be only numbers" })
            }
        }

        const monthnum = Number(monthstr);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const monthlyRevenue = await db.getRevenuebymonth(Number(gym_id), month);
        return res.status(200).json(monthlyRevenue);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getRevenuebyday = async (req: Request, res: Response) => {
    try {

        const gym_id = req.gym_id;
        const { date } = req.body;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }


        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "date is required" })
        }

        if (date.length !== 10) {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        if (date[4] !== '-' || date[7] !== '-') {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);

        for (let c of year + month + day) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "date must be only numbers" })
            }
        }

        const monthnum = Number(month);
        const daynum = Number(day);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        if (daynum < 1 || daynum > 31) {
            return res.status(400).json({ message: "invalid day" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }

        const dayrevenue = await db.getRevenuebyday(Number(gym_id), date);
        return res.status(200).json(dayrevenue);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




export const getSessionsbyday = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        const { date } = req.body;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }


        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "date is required" })
        }

        if (date.length !== 10) {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        if (date[4] !== '-' || date[7] !== '-') {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);

        for (let c of year + month + day) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "date must be only numbers" })
            }
        }

        const monthnum = Number(month);
        const daynum = Number(day);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        if (daynum < 1 || daynum > 31) {
            return res.status(400).json({ message: "invalid day" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const todaySessions = await db.getSessionsbyday(Number(gym_id), date);
        return res.status(200).json(todaySessions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSessionsdayByType = async (req: Request, res: Response) => {
    try {

        const gym_id = req.gym_id;
        const { date, session_type } = req.body;

        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!session_type || typeof session_type !== 'string') {
            return res.status(400).json({ message: "session_type is required" })
        }
        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "month is required" })
        }

        if (!["gym", "football", "else"].includes(session_type.toLowerCase())) {
            return res.status(400).json({ message: "invalid session type" });
        }
        if (date.length !== 10) {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        if (date[4] !== '-' || date[7] !== '-') {
            return res.status(400).json({ message: "date must be in format YYYY-MM-DD" })
        }

        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);

        for (let c of year + month + day) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "date must be only numbers" })
            }
        }

        const monthnum = Number(month);
        const daynum = Number(day);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        if (daynum < 1 || daynum > 31) {
            return res.status(400).json({ message: "invalid day" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const DaySessionByType = await db.getSessionsdayByType(Number(gym_id), session_type.toLocaleLowerCase(), date);
        return res.status(200).json(DaySessionByType);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getSessionsbymonth = async (req: Request, res: Response) => {
    try {

        const gym_id = req.gym_id;
        const { month } = req.body;

        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!month || typeof month !== 'string') {
            return res.status(400).json({ message: "month is required" })
        }

        if (month.length !== 7 || month[4] !== '-') {
            return res.status(400).json({ message: "month must be in format YYYY-MM" })
        }

        const yearstr = month.substring(0, 4);
        const monthstr = month.substring(5, 7);

        for (let c of yearstr + monthstr) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "month must be only numbers" })
            }
        }

        const monthnum = Number(monthstr);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const MonthlySessions = await db.getSessionsbymonth(Number(gym_id), month);
        return res.status(200).json(MonthlySessions);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSessionsMonthByType = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        const { month, session_type } = req.body;

        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        if (!session_type || typeof session_type !== 'string') {
            return res.status(400).json({ message: "session_type is required" })
        }
        if (!month || typeof month !== 'string') {
            return res.status(400).json({ message: "month is required" })
        }

        if (!["gym", "football", "else"].includes(session_type.toLowerCase())) {
            return res.status(400).json({ message: "invalid session type" });
        }
        if (month.length !== 7 || month[4] !== '-') {
            return res.status(400).json({ message: "month must be in format YYYY-MM" })
        }

        const yearstr = month.substring(0, 4);
        const monthstr = month.substring(5, 7);

        for (let c of yearstr + monthstr) {
            if (c < "0" || c > "9") {
                return res.status(400).json({ message: "month must be only numbers" })
            }
        }

        const monthnum = Number(monthstr);

        if (monthnum < 1 || monthnum > 12) {
            return res.status(400).json({ message: "invalid month" })
        }

        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }


        const MonthlySessionsByType = await db.getSessionsMonthByType(Number(gym_id), session_type.toLocaleLowerCase(), month)
        return res.status(200).json(MonthlySessionsByType)

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




export const getTodaySessions = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const todaysessions = await db.getTodaySessions(Number(gym_id));
        return res.status(200).json(todaysessions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getTodayRevenue = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const todayrevenue = await db.getTodayRevenue(Number(gym_id));
        return res.status(200).json(todayrevenue);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getmonthRevenue = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const monthrevenue = await db.getmonthRevenue(Number(gym_id));
        return res.status(200).json(monthrevenue);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getTodaymembers = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const todayMembers = await db.getTodaymembers(Number(gym_id));
        return res.status(200).json(todayMembers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const getActiveMembers = async (req: Request, res: Response) => {
    try {
        const gym_id = req.gym_id;
        if (!gym_id || isNaN(Number(gym_id))) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const gym = db.getCompanyById(Number(gym_id));
        if (!gym) {
            return res.status(400).json({ message: "Gym not found" });
        }
        const activeMembers = await db.getActiveMembers(Number(gym_id));
        return res.status(200).json(activeMembers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}