import { DBconnect } from "@/lib/db.connect"
import { UserModel } from "@/models/user.model"
import bcrypt from "bcryptjs"
import NextAuth,{NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",

            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials:any):Promise<any>{
                await DBconnect()

                try {
                    const existingUser=await UserModel.findOne({
                        $or:[
                            {username:credentials.identifier},
                            {email:credentials.identifier}
                        ]
                    })
                    if(!existingUser){
                        throw new Error("No user found with this username or email")
                    }
    
                    const isAuthenticate=await bcrypt.compare(credentials.password,existingUser.password)
                    if(!isAuthenticate){
                        throw new Error("Wrong credentials")
                    }

                    if(!existingUser.isVerified){
                        throw new Error("please verify your account before login")
                    }

                    return existingUser
                    
                } 
                catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    pages:{
        signIn:'/sign-in'
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id.toString()
                token.username=user.username
                token.isVerified=user.isVerified
                token.isAcceptingMessage=user.isAcceptingMessage
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id
                session.user.username=token.username
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessage=token.isAcceptingMessage
            }
            return session
        }
    }
}
