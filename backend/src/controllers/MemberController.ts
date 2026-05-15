import { Request, Response } from "express";
import { db } from "../database";
import { Member, Session } from "../database/DAOs/memberDao";

export const addMember = async (req: Request, res: Response) => {
  try {
    const { name, phone, months, price, notes, offer_id } = req.body;
    const gym_id = req.gym_id;

    if (!name || !phone || !months || !price || !gym_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0 || months < 0) {
      return res
        .status(400)
        .json({ message: "Price and months must be positive" });
    }

    if (name.length > 15 || name.length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be between 2 and 15 characters" });
    }

    const member: Member = {
      name: name,
      phone: phone,
      months: months,
      price: price,
      start_date: "",
      end_date: "",
      notes: notes,
    };

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    await db.addMember(member, Number(gym_id));

    if (offer_id) {
      const ok = await db.updateOfferCount(Number(offer_id));
      if (!ok) {
        return res.status(500).json({ message: "Error updating offer count" });
      }
    }

    const ok = await db.updateBank(Number(gym_id), price);
    if (!ok) {
      return res.status(500).json({ message: "Error updating bank account" });
    }

    return res.status(201).json({ message: "Member added successfully" });
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gym_id = req.gym_id;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = db.getMemberById(Number(id));
    if (!member) {
      return res
        .status(400)
        .json({ message: "There is no member with this id to be deleted" });
    }
    await db.deleteMember(Number(id));

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { months, price } = req.body;
    const { id } = req.params;
    const gym_id = req.gym_id;
    if (!id || !months || !price) {
      return res
        .status(400)
        .json({ message: "Member ID, months, and price are required" });
    }
    if (months <= 0) {
      return res.status(400).json({ message: "invalid number of months" });
    }
    if (price <= 0 || isNaN(price)) {
      return res.status(400).json({ message: "invalid price" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = db.getMemberById(Number(id));
    if (!member) {
      return res
        .status(400)
        .json({ message: "There is no member with this id to be updated" });
    }

    const ok = await db.updateMember(Number(id), months, price);
    if (!ok) {
      return res.status(500).json({ message: "Error updating member" });
    }
    const bankOk = await db.updateBank(Number(gym_id), price);
    if (!bankOk) {
      return res.status(500).json({ message: "Error updating bank account" });
    }

    return res.status(200).json({ message: "Member updated successfully" });
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gym_id = req.gym_id;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "member id is required" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const member = await db.getMemberById(Number(id));
    if (!member) {
      return res
        .status(400)
        .json({ message: "There is no member with this id" });
    }
    return res.status(200).json({ member });
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMemberByName = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "member name is required" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }
    const member = await db.getMemberByName(name);
    if (!member) {
      return res
        .status(404)
        .json({ message: "There is no member with this name" });
    }
    return res.status(200).json(member);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listMembersOfGym = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "gym id is required" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const members = await db.listMembersOfGym(Number(gym_id));
    return res.status(200).json(members);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/members/sessions:
 *   post:
 *     tags: [Sessions]
 *     summary: Add a new session
 *     description: Record a new session for a member
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_date
 *               - session_type
 *               - price
 *               - member_name
 *             properties:
 *               session_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-15"
 *               session_type:
 *                 type: string
 *                 enum: [gym, football, swimming]
 *                 example: "gym"
 *               price:
 *                 type: number
 *                 example: 50
 *               member_name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Session added successfully
 *       400:
 *         description: Invalid input or gym not found
 *       500:
 *         description: Internal server error
 */
export const addSession = async (req: Request, res: Response) => {
  try {
    const { session_date, session_type, price, member_name } = req.body;
    const gym_id = req.gym_id;

    const session: Session = {
      session_date: session_date,
      session_type: session_type.toLowerCase(),
      price: price,
      member_name: member_name,
    };

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    if (!session_date) {
      return res.status(400).json({ message: "session date is required" });
    }
    if (!session_type || typeof session_type !== "string") {
      return res.status(400).json({ message: "session type is required" });
    }
    if (!["gym", "football", "swimming"].includes(session_type.toLowerCase())) {
      return res.status(400).json({ message: "invalid session type" });
    }
    if (!price || isNaN(price)) {
      return res.status(400).json({ message: "price is required" });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "invalid price" });
    }
    if (!member_name || typeof member_name !== "string") {
      return res.status(400).json({ message: "member name is required" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    await db.addSession(session, Number(gym_id));

    const ok = await db.updateBank(Number(gym_id), price);
    if (!ok) {
      return res.status(500).json({ message: "Error updating bank account" });
    }

    return res.status(200).json({ message: "Session added successfully" });
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/v1/members/sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: List all sessions
 *     description: Retrieve all sessions for the gym
 *     parameters:
 *       - name: gym_id
 *         in: header
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       400:
 *         description: Invalid gym ID or gym not found
 *       500:
 *         description: Internal server error
 */
export const listSessions = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;

    if (!gym_id || isNaN(Number(gym_id))) {
      return res.status(400).json({ message: "invalide gym id" });
    }

    const gym = db.getCompanyById(Number(gym_id));
    if (!gym) {
      return res.status(400).json({ message: "Gym not found" });
    }

    const sessions = await db.listSessions(Number(gym_id));
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    res.errorMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
