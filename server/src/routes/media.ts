import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadServiceMedia } from "../controllers/media";

const mediaRouter = Router();

mediaRouter.post(
  "/services/:serviceId/media",
  upload.array("images", 10),
  uploadServiceMedia,
);

export default mediaRouter;
