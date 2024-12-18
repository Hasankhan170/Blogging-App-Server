import express from "express"
import { registerUser,loginUser,logoutUser,refreshToken } from "../controllers/user.controllers.js"
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router()

router.post("/register", upload.single("image"), registerUser);
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.post("/refreshToken",refreshToken)
// router.get("/image", allImage);




export default router


