import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  recorder,
} from "../controllers/videoController";
import {
  publicOnlyMiddleware,
  protectorMiddleware,
  videoUpload,
} from "../middleware";
const videoRouter = express.Router();

const id = "/:id([a-f0-9]{24})";

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );
videoRouter.get("/recorder", recorder);
videoRouter.get(id, watch);
videoRouter
  .route(`${id}/edit`)
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get(`${id}/delete`, deleteVideo);

export default videoRouter;
