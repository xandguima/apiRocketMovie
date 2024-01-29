const knex = require("../database/knex");
const AppError =require("../utils/AppError");
const DiskStorage =require("../Providers/DiskStorage");

class UserAvatarController{
  async update(request, response){
    const user_id =request.user.id
    const avatarFilename = request.file.filename;
    
    const diskStorage= new DiskStorage()

    const user =await knex("users").where({id:user_id}).first()
   
    if(!user){
      throw new AppError("Somente Usuários autenticados podem mudar o avatar", 401)
    }

    if(user.avatar_url){
      await diskStorage.deleteFile(user.avatar_url)
    }
    const filename= await diskStorage.saveFile(avatarFilename)
    user.avatar_url=filename

    await knex("users").where({id:user_id}).update(user)

    return response.json(user)

  }

}

module.exports=UserAvatarController