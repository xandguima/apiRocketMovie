const knex=require("../database/knex")
const{hash}=require("bcryptjs")
const AppError = require("../utils/AppError");

class UsersController{
  async create(request,response){
    const {name, email, password}=request.body;

   const checkExistUser= await knex("users").where({email})
    console.log(checkExistUser)
   if(checkExistUser){
    throw new AppError("Este e-mail já está em uso");
   }

    const cryptPassword=await hash(password,8)
   
    await knex("users").insert({
      name,
      email,
      password:cryptPassword
    })

    return response.status(201).json();
  }

  async delete(request,response){
    const {id}=request.params
  
    await knex("users").where({id}).delete()

    return response.status(201).json()
    
  }

  
}
module.exports=UsersController