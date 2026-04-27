import { Request, Response } from 'express';
import { db } from '../database';
import { Member, Session } from '../database/DAOs/memberDao';


export const addMember = (req: Request, res: Response) => {
    try {
        const { name, phone, months, price, start_date, end_date, notes } = req.body;
        const { gym_id } = req.params;

        if (!name || !phone || !months || !price || !start_date || !end_date || !notes || !gym_id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (price < 0 || months < 0) {
            return res.status(400).json({ message: "Price and months must be positive" });
        }

        if (name.length > 15 || name.length < 2) {
            return res.status(400).json({ message: "Name must be between 2 and 15 characters" });
        }
        if (phone.length != 11 || phone[0] !== '0' || phone[1] !== '1' || !["0", "1", "2", "5"].includes(phone[2])) {
            return res.status(400).json({ message: "you must enter a valid phone number" });
        }
        for (let i = 0; i < phone.length; i++) {
            if (phone[i] < "0" || phone[i] > "9") {
                return res.status(400).json({ message: "you must enter a valid phone number" });
            }
        }

        const member: Member = {

            name: name,
            phone: phone,
            months: months,
            price: price,
            start_date: start_date,
            end_date: end_date,
            notes: notes,
        }

        db.addMember(member, Number(gym_id));


        return res.status(201).json({ message: "Member added successfully" });


    } catch (error) {
        console.log(error);
    }
}

export const deleteMember = (req: Request, res: Response) => {
    try {

        const { id } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Member ID is required" });
        }

        db.deleteMember(id);

        return res.status(200).json({ message: "Member deleted successfully" });

    } catch (error) {
        console.log(error);
    }
}

export const updateMember = (req: Request, res: Response) => {
    try {
        const { id, months, price } = req.body;

        if (!id || !months || !price) {
            return res.status(400).json({ message: "Member ID, months, and price are required" });
        }
        if (months <= 0) {
            return res.status(400).json({ message: "invalid number of months" });
        }
        if (price <= 0 || isNaN(price)) {
            return res.status(400).json({ message: "invalid price" });
        }
        db.updateMember(id, months, price);
        return res.status(200).json({ message: "Member updated successfully" });
    } catch (error) {
        console.log(error);
    }
}



export const getMemberById = (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "member id is required" })
        }
        const member = db.getMemberById(id);
        return res.status(200).json(member);
    } catch (error) {
        console.log(error);
    }
}

export const getMemberByName = (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: "member name is required" })
        }
        const member = db.getMemberByName(name);
        return res.status(200).json(member);
    } catch (error) {
        console.log(error);
    }
}

export const listMembersOfGym = (req: Request, res: Response) => {
    try {
        const { gym_id } = req.body;
        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "gym id is required" })
        }
        const members = db.listMembersOfGym(gym_id);
        return res.status(200).json(members);
    } catch (error) {
        console.log(error);
    }
}

export const addSession = (req: Request, res: Response) => {
    try {
        const { gym_id, session_date, session_type, price, member_name } = req.body;

        const session: Session = {
            session_date: session_date,
            session_type: session_type,
            price: price,
            member_name: member_name,
        }

        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        if (!session_date) {
            return res.status(400).json({ message: "session date is required" })
        }
        if (!session_type || typeof session_type !== 'string') {
            return res.status(400).json({ message: "session type is required" })
        }
        if (!['gym', 'football', 'swimming'].includes(session_type.toLowerCase())) {
            return res.status(400).json({ message: "invalid session type" })
        }
        if (!price || isNaN(price)) {
            return res.status(400).json({ message: "price is required" })
        }
        if (price <= 0) {
            return res.status(400).json({ message: "invalid price" })
        }
        if (!member_name || typeof member_name !== 'string') {
            return res.status(400).json({ message: "member name is required" })
        }


        db.addSession(session, gym_id);
        return res.status(200).json({ message: "Session added successfully" });
    } catch (error) {
        console.log(error);
    }
}

export const listSessions = (req: Request, res: Response) => {
    try {
        const { type, gym_id } = req.body;
        if (!gym_id || isNaN(gym_id)) {
            return res.status(400).json({ message: "invalide gym id" })
        }
        if (!type || typeof type !== 'string') {
            return res.status(400).json({ message: "session type is required" })
        }
        if (!['gym', 'football', 'swimming'].includes(type.toLowerCase())) {
            return res.status(400).json({ message: "invalid session type" })
        }
        const sessions = db.listSessions(type, gym_id);
        return res.status(200).json(sessions);
    } catch (error) {
        console.log(error);
    }
}



