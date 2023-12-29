const {Router}=require("express");
const multer =require("multer")

const uploadConfig=require("../config/uploads")
const UsersController=require("../controllers/UserController")
const ensureAuthenticated=require("../middlewares/ensureAuthenticated");
const UserAvatarController=require("../controllers/UserAvatarController")

const usersController = new UsersController()
const userAvatarController= new UserAvatarController()

const userRoutes=Router();
const upload=multer(uploadConfig.MULTER)


userRoutes.post("/",usersController.create)
userRoutes.put("/",ensureAuthenticated,usersController.update)

userRoutes.delete("/",ensureAuthenticated,usersController.delete)

userRoutes.patch("/avatar",ensureAuthenticated,upload.single("avatar"),userAvatarController.update)

module.exports=userRoutes