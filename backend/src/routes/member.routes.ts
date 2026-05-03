import { Router } from "express";
import {
  addMember,
  deleteMember,
  getMemberById,
  getMemberByName,
  listMembersOfGym,
  updateMember,
} from "../controllers/MemberController";

const memberRouter = Router({ mergeParams: true });
memberRouter.post("/", addMember);
memberRouter.delete("/:id", deleteMember);
memberRouter.put("/:id", updateMember);
memberRouter.get("/:id", getMemberById);
memberRouter.get("/filter", getMemberByName);
memberRouter.get("/", listMembersOfGym);

export default memberRouter;
