import { Request, Response } from 'express';
import { db } from '../database';
import { Member, Session } from '../database/DAOs/memberDao';


export const addMember = async (req: Request, res: Response) => {
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

    // NOTE: as a backend we are the guards who protect the system from failing
    // so it's not an option to handle all the cases 

    // WARNING: this code will lead to errors and the user will get 500 even the server is running
    // you should handle all the cases and i am not talking about validation of the input


    const member: Member = {

      name: name,
      phone: phone,
      months: months,
      price: price,
      start_date: start_date,
      end_date: end_date,
      notes: notes,
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    await db.addMember(member, Number(gym_id));


    return res.status(201).json({ message: "Member added successfully" });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteMember = async (req: Request, res: Response) => {
  try {

    const { gym_id, id } = req.params;


    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    // WARNING: this code will lead to errors and the user will get 500 even the server is running
    // you should handle all the cases and i am not talking about validation of the input
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = db.getMemberById(Number(id));
    if (!member) {
      return res.status(400).json({ message: "There is no member with this id to be deleted" });
    }
    await db.deleteMember(Number(id));

    return res.status(200).json({ message: "Member deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { months, price } = req.body;
    const { gym_id, id } = req.params;
    if (!id || !months || !price) {
      return res.status(400).json({ message: "Member ID, months, and price are required" });
    }
    if (months <= 0) {
      return res.status(400).json({ message: "invalid number of months" });
    }
    if (price <= 0 || isNaN(price)) {
      return res.status(400).json({ message: "invalid price" });
    }

    // WARNING: this code will lead to errors and the user will get 500 even the server is running
    // you should handle all the cases and i am not talking about validation of the input

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = db.getMemberById(Number(id));
    if (!member) {
      return res.status(400).json({ message: "There is no member with this id to be updated" });
    }

    await db.updateMember(Number(id), months, price);
    return res.status(200).json({ message: "Member updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { gym_id, id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "member id is required" })
    }

    // WARNING: this code will lead to errors and the user will get 500 even the server is running
    // you should handle all the cases and i am not talking about validation of the input

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const member = await db.getMemberById(Number(id));
    if (!member) {
      return res.status(400).json({ message: "There is no member with this id" });
    }
    return res.status(200).json({ member });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMemberByName = async (req: Request, res: Response) => {
  try {
    const { gym_id } = req.params;
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: "member name is required" })
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = await db.getMemberByName(name);
    if (!member) {
      return res.status(404).json({ message: "There is no member with this name" });
    }
    return res.status(200).json(member);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const listMembersOfGym = async (req: Request, res: Response) => {
  try {
    const { gym_id } = req.params;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" })
    }

    // WARNING: this code will lead to errors and the user will get 500 even the server is running
    // you should handle all the cases and i am not talking about validation of the input
    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const members = await db.listMembersOfGym(Number(gym_id));
    return res.status(200).json(members);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addSession = async (req: Request, res: Response) => {
  try {
    const { session_date, session_type, price, member_name } = req.body;
    const { gym_id } = req.params;

    const session: Session = {
      session_date: session_date,
      session_type: session_type,
      price: price,
      member_name: member_name,
    }

    if (!gym_id || isNaN(Number(gym_id))) {
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

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }



    await db.addSession(session, Number(gym_id));
    return res.status(200).json({ message: "Session added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const listSessions = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    const { gym_id } = req.params;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "invalide gym id" })
    }
    if (!type || typeof type !== 'string') {
      return res.status(400).json({ message: "session type is required" })
    }
    if (!['gym', 'football', 'swimming'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "invalid session type" })
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }


    const sessions = await db.listSessions(type, Number(gym_id));
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



