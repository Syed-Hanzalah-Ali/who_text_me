import mongoose,{Schema,Document} from "mongoose"

// console.log(Document);

interface IUser{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean
    isAcceptingMessage:boolean
}

const userSchema:Schema<IUser>=new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        match:/.+\@.+\..+/
    },
    password:{
        type:String,
        required:true,
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
// console.log(typeof(userSchema));

export const UserModel=mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User",userSchema)
