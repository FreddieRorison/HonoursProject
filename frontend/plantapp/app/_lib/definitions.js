import { z } from "zod";

export const LoginFormSchema=z.object({
    email: z.string()
    .email(),
    password: z.string()
})

export const PlantSchema=z.object({
    
})

export const DeviceSchema=z.object({
    
})

export const RegisterFormSchema=z.object({
    email: z.string()
    .email(),
    password: z.string()
    .min(8, "Password must be 8 characters in length")
    .regex(/[A-Z]/, "Password must contain atleast 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain atleast one number"),
})