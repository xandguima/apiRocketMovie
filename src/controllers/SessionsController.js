const{compare}=require("bcryptjs");
const {sign}= require("jsonwebtoken");
const knex =require('../database/knex');
const authConfig=require("../config/auth");
const AppError= require("../utils/AppError");

class SessionsController {
  async create(request,response){
    const {email, password}= request.body


    const user= await knex("users").where({email}).first()
   
    
    if(!user){
      throw new AppError("Email não cadastrado",401)
    }
    
    
    const checkPassword= await compare(password,user.password)
    if(!checkPassword){
      throw new AppError("Email e/ou senha incorreta",401)
       
    }
    const {secret, expiresIn}=authConfig.jwt
    const token=sign({},secret,{
      subject: String(user.id),
      expiresIn
    })

    return response.status(200).json({user,token});
   
  }

}

module.exports= SessionsController;