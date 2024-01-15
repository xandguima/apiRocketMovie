require("express-async-errors");
const express =require("express");
const AppError=require("./utils/AppError.js")
const uploadConfig = require ("./config/uploads.js")
const cors = require("cors")


const app = express();
app.use(cors())
app.use(express.json());



const routes=require("./routes")

app.use("/files",express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes);

app.use((error,request,response, next)=>{
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status:"error",
      message:error.message
    })
  };

  return response.status(500).json({
    status:"error",
    message:" internal server error"
  })
});

const PORT = 3333;

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});