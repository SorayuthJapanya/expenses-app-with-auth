import { axiosInstance } from "@/lib/axios";
import { IAuthForm, IUser } from "@/types/auth";


export const registerUser = async (payload: IAuthForm) =>{
    const res = await axiosInstance.post("/api/auth/register", payload)
    return res.data
}

export const loginUser = async (payload: IAuthForm) =>{
    const res = await axiosInstance.post("/api/auth/login", payload)
    return res.data
}

export const logoutUser = async () =>{
    const res = await axiosInstance.post("/api/auth/logout")
    return res.data   
}

export const getUser = async (): Promise<IUser> =>{
    const res = await axiosInstance.get("/api/auth/me")
    return res.data   
}