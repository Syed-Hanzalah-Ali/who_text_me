import {z} from "zod"

// use this for validation when user send code to verify himself
export const verifyCodeSchema=z.object({
    verifyCode:z.string().length(6,{message:"verification code must be of 6 digits"})
})
