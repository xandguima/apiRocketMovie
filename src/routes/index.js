const {Router}=require("express")

const routes=Router();

const useRoutes=require("./users.routes")


routes.use("/users",useRoutes)

module.exports=routes