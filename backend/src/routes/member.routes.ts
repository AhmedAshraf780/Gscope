import Router from "express";
import { addMember } from "../controllers/MemberController";


const memberRouter = Router();
memberRouter.post("/", addMember)

export default memberRouter;

