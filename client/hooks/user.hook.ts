import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/user.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useRegisterUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Register failed");
    },
  });
};

export const useLoginUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Invalid Credentials");
    },
  });
};

export const useLogoutUser = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/auth");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message ?? "Invalid Credentials");
    },
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};
