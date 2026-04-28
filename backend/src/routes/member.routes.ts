import { Router } from "express";
import { addMember, addSession, deleteMember, getMemberById, getMemberByName, listMembersOfGym, listSessions, updateMember } from "../controllers/MemberController";


const memberRouter = Router({ mergeParams: true });
// FIX: API_DESIGN issue 
// /members [POST]  -> means addMember
// /members [GET]  -> means listALLMembers 
// /members/:id [GET]  -> means give me this member with this id 
// /members/?name [GET]  -> means give me this member with this name but name now will be in query 
// /members/:id [DELETE]  -> means delete this member with this id
// /members/:id [PUT OR PATCH]  -> means update this member with this id

// NOTE: SO you don't need actually to specify the functionality in endpoint 
// so don't tell me to add a members call me in endpoint /addMember ???

// TODO: ReWrite the endpoint after you understood the REST DESIGN
memberRouter.post("/add", addMember)
memberRouter.delete("/delete/:id", deleteMember)
memberRouter.put("/update/:id", updateMember)
memberRouter.get("/get/:id", getMemberById)
memberRouter.get("/getname", getMemberByName)
memberRouter.get("/getall", listMembersOfGym)
memberRouter.post("/addsession", addSession)
memberRouter.get("/listsessions", listSessions)

export default memberRouter;

