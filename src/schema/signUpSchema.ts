import {z} from "zod"

// use this for validation when user try to signUp 
export const signUpSchema=z.object({
    username:z.string().trim()
                .min(6,{message:"username must be of atleast 6 characters"})
                .max(20,{message:"username must be no more than 20 characters"})
                .regex(/^[a-zA-Z0-9_]$/),

    email:z.email({message:"Invalid email address"}).trim().toLowerCase(),

    password:z.string().
            min(8,{message:"password length must be of atleast 8 characters"})
})
