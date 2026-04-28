import { Request, Response } from 'express';
import { db } from '../database';
//import { attendance_logs, LastAttendance } from '../database/DAOs/logsDao';


export const createLog = (req: Request, res: Response) => {
  try {
    const { member_id, gym_id } = req.body;
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" })
    }
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" })
    }
    db.createLog(member_id, gym_id);
    return res.status(200).json({ message: "Log created successfully" });
  } catch (error) {
    console.log(error);
    // WARNING: the user or frontend expects to return the response 
    // so where is it ??
  }
}

export const getLogsByMemberId = (req: Request, res: Response) => {
  try {
    const { member_id } = req.body;
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" })
    }
    const logs = db.getLogsByMemberId(member_id);
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    // WARNING: the user or frontend expects to return the response 
    // so where is it ??
  }
}

export const getLastCheckIn = (req: Request, res: Response) => {
  try {
    const { member_id } = req.body;
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" })
    }
    const logs = db.getLastCheckIn(member_id);
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    // WARNING: the user or frontend expects to return the response 
    // so where is it ??
  }
}

export const getLastAttendanceWithDuration = (req: Request, res: Response) => {
  try {
    const { member_id } = req.body;
    if (!member_id || isNaN(member_id)) {
      return res.status(400).json({ message: "invalide member id" })
    }
    const logs = db.getLastAttendanceWithDuration(member_id);
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    // WARNING: the user or frontend expects to return the response 
    // so where is it ??
  }
}

export const getAllLogsByGym = (req: Request, res: Response) => {
  try {
    const { gym_id } = req.body;
    if (!gym_id || isNaN(gym_id)) {
      return res.status(400).json({ message: "invalide gym id" })
    }
    const logs = db.getAllLogsByGym(gym_id);
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    // WARNING: the user or frontend expects to return the response 
    // so where is it ??
  }
}
