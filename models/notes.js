const {Schema , model} = require("mongoose")
const notesSchema = new Schema({
    note:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
const Note = model("Note",notesSchema)
module.exports = Note;