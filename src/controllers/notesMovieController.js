const { application } = require("express");
const knex=require("../database/knex")
const AppError = require("../utils/AppError");

class notesMovie{
  async create(request,response){
    const {user_id}=request.params
    const {title,description,score,tags}=request.body

    const checkExistUser= await knex("users").where({id:user_id})

    
    if(checkExistUser.length==0){
      throw new AppError("Usuário não encontrado")
    }
    
    const [note_id] = await knex("notesMovie").insert({
      title,
      description,
      score,
      user_id
    })
  
    const tagsInsert= tags.map(name=>{
      return{
        name,
        note_id,
        user_id,
      }
    })
    await knex("tags").insert(tagsInsert)
    
    
    return response.status(201).json();
  }
  async delete(request,response){
    const {id}=request.params
    await knex("notesMovie").where({id}).delete()

    return response.status(201).json()
  }
  async show(request,response){
    const {id}=request.params


    const note=await knex("notesMovie").where({id}).first()
    const tags=await knex("tags").where({note_id:id}).orderBy("name")

    if(!note){
      throw new AppError("Nota não encontrada")
    }
    
    return response.json({
      ...note,
      tags
    })
  }
  async index(request,response){
    const {title,user_id,tags}=request.query

    let notes

    if(tags){
      const filterTags=tags.split(",").map(tag=>tag.trim())

      notes=await knex("tags")
        .select([
          "notesMovie.id",
          "notesMovie.title",
          "notesMovie.user_id"
        ])
        .where("notesMovie.user_id",user_id)
        .whereLike("notesMovie.title",`%${title}%`)
        .whereIn("name",filterTags)
        .innerJoin("notesMovie","notesMovie.id","tags.note_id")
        .orderBy("notesMovie.title")
    }else{
      notes=await knex("notesMovie")
        .where({user_id})
        .whereLike("title",`%${title}%`)
        .orderBy("title")
    }
    const userTags=await knex("tags").where({user_id})
    const notesWithTags= notes.map((note=>{
      const noteTags=userTags.filter(tag=>tag.note_id===note.id)
      return{
        ...note,
        tags:noteTags
      }
    }))
    return response.json(notesWithTags)
  }
}

module.exports=notesMovie