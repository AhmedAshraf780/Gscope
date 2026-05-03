import { Request, Response } from "express";
import { db } from "../database";
//import { attendance_logs, LastAttendance } from '../database/DAOs/logsDao';

export const createLog = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    const member_id = Number(req.params.member_id);
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" });
    }
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    const member = await db.getMemberById(member_id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const new_log = await db.createLog(member_id, gym_id);
    if (!new_log) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Log created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLogsByMemberId = async (req: Request, res: Response) => {
  try {
    const member_id = Number(req.params.member_id);
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" });
    }
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    const member = await db.getMemberById(member_id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const logs = await db.getLogsByMemberId(member_id);
    if (!logs) {
      return res.status(404).json({ message: "Logs not found" });
    }
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLastCheckIn = async (req: Request, res: Response) => {
  try {
    const member_id = Number(req.params.member_id);
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" });
    }
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    const member = await db.getMemberById(member_id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const logs = db.getLastCheckIn(member_id);
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLastAttendanceWithDuration = async (
  req: Request,
  res: Response,
) => {
  try {
    const member_id = Number(req.params.member_id);
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" });
    }
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    const member = await db.getMemberById(member_id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const logs = await db.getLastAttendanceWithDuration(member_id);
    if (!logs) {
      return res.status(404).json({ message: "Logs not found" });
    }
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLogsByGym = async (req: Request, res: Response) => {
  try {
    const gym_id = req.gym_id;
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" });
    }
    const gym = await db.getCompanyById(gym_id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    const logs = await db.getAllLogsByGym(gym_id);
    if (!logs) {
      return res.status(404).json({ message: "Logs not found" });
    }
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
