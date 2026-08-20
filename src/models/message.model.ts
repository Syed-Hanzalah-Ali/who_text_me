import mongoose,{Schema,Document} from "mongoose"

export interface IMsg{
    content:string,
    to:mongoose.Types.ObjectId
}

const messageSchema:Schema<IMsg>=new Schema({
    content:{
        type:String,
        required:true
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

export const msgModel=mongoose.models.Message as mongoose.Model<IMsg> || mongoose.model("Message",messageSchema)