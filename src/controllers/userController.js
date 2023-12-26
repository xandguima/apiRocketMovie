const knex=require("../database/knex")
const{hash, compare}=require("bcryptjs")
const AppError = require("../utils/AppError");

class UsersController{
  async create(request,response){
    const {name, email, password}=request.body;

   const checkExistUser= await knex("users").where({email})

    if(checkExistUser.length!=0){
     throw new AppError("Este email já esta em uso")
    }
    const cryptPassword=await hash(password,8)
   
    await knex("users").insert({
      name,
      email,
      password:cryptPassword
    })

    return response.status(201).json();
  }

  async update(request,response){
    const{name,email,oldPassword,newPassword}=request.body
    const{id}=request.params

    const user= await knex("users").where({id})

    if(user.length==0){
      throw new AppError("Usuário não encontrado")
    }
  
    if(email){
     const checkEmail = await knex("users").where({email})
      if(checkEmail.length!==0 && checkEmail[0].id!==user[0].id){
        throw new AppError("Este e-mail já está em uso")
      }
    }
    
    user[0].name = name ?? user[0].name
    user[0].email = email ?? user[0].email
    

    if(newPassword && !oldPassword){
      throw new AppError("Para redefinir a senha é necessario informar a senha antiga")
    }
    if(!newPassword && oldPassword){
     throw new AppError("Para redefinir a senha é necessario informar a nova senha")
    }
    
    if(newPassword && oldPassword){
      const checkPassword= await compare(oldPassword,user[0].password)
      if(!checkPassword){
        throw new AppError("A senha antiga não confere")
      }
      user[0].password= await hash(newPassword,8)
    }
    

    await knex("users").where({id}).update({
      name:user[0].name,
      email:user[0].email,
      password:user[0].password,
      updated_at:knex.fn.now()
    })

    return response.status(200).json();

  }

  async delete(request,response){
    const {id}=request.params

    const checkUser=await knex("users").where({id})

    if(checkUser.length==0){
      throw new AppError("Usuário não encontrado")
    }
    await knex("users").where({id}).delete()
  

    return response.json()
    
  }


  
}
module.exports=UsersController