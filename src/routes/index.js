const {Router}=require("express")

const routes=Router();

const userRoutes=require("./users.routes")
const notesRoutes=require("./notes.routes")
const sessionRoutes=require("./sessions.routes")
const tagsRoutes=require("./tags.routes")

routes.use("/users",userRoutes)
routes.use("/notes",notesRoutes)
routes.use("/sessions",sessionRoutes)
routes.use("/tags",tagsRoutes)

module.exports=routes