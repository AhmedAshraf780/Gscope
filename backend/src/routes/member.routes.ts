import { Router } from "express";
import {
  addMember,
  addSession,
  deleteMember,
  getMemberById,
  getMemberByName,
  listMembersOfGym,
  listSessions,
  updateMember,
} from "../controllers/MemberController";

const memberRouter = Router({ mergeParams: true });
memberRouter.post("/", addMember);
memberRouter.delete("/:id", deleteMember);
memberRouter.put("/:id", updateMember);
memberRouter.get("/:id", getMemberById);
memberRouter.get("/filter", getMemberByName);
memberRouter.get("/", listMembersOfGym);
memberRouter.post("/sessions", addSession);
memberRouter.get("/sessions", listSessions);

export default memberRouter;
