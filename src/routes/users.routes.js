const {Router}=require("express");
const UsersController=require("../controllers/userController")

const usersController = new UsersController()

const userRoutes=Router();


userRoutes.post("/",usersController.create)
userRoutes.delete("/:id",usersController.delete)
userRoutes.put("/:id",usersController.update)


module.exports=userRoutes