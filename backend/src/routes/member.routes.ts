import { Router } from "express";
import { addMember, addSession, deleteMember, getMemberById, getMemberByName, listMembersOfGym, listSessions, updateMember } from "../controllers/MemberController";


const memberRouter = Router({ mergeParams: true });
memberRouter.post("/add", addMember)
memberRouter.delete("/delete/:id", deleteMember)
memberRouter.put("/update/:id", updateMember)
memberRouter.get("/get/:id", getMemberById)
memberRouter.get("/getname", getMemberByName)
memberRouter.get("/getall", listMembersOfGym)
memberRouter.post("/addsession", addSession)
memberRouter.get("/listsessions", listSessions)

export default memberRouter;

