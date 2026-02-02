"use client";

import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../assets/expense-logo.png";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { IAuthForm } from "@/types/auth";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useLoginUser, useRegisterUser } from "@/hooks/user.hook";
import { Loader2 } from "lucide-react";

export default function AuthForm() {
  const [authForm, setAuthForm] = useState<IAuthForm>({
    username: "",
    email: "",
    password: "",
  });
  const [form, setForm] = useState<"login" | "register">("login");
  const { mutate: registerUser, isPending: isRegisterPending } =
    useRegisterUser();
  const { mutate: loginUser, isPending: isLoginPending } = useLoginUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form === "login") {
      loginUser(authForm);
    } else {
      registerUser(authForm);
    }

  };

  return (
    <div className="w-full flex flex-col items-center lg:items-start p-2 lg:py-12 lg:px-20 gap-8">
      {/* logo */}
      <Image src={Logo} alt="logo" width={120} height={20}></Image>

      {/* Form Section */}
      <form onSubmit={handleSubmitForm} className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center lg:items-start gap-2">
          <h1 className="text-2xl lg:text-5xl font-semibold">
            Holla, Welcome Back
          </h1>
          <p className="text-muted-foreground/80 text-xs sm:text-sm">
            Hey, Welcome back to your special place
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <FieldSet className="w-full max-w-sm">
            <FieldGroup className="gap-2">
              {form === "register" && (
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={authForm.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="h-10 placeholder:text-muted-foreground/80"
                  required
                />
              )}
              <Input
                type="email"
                id="email"
                name="email"
                value={authForm.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="h-10 placeholder:text-muted-foreground/80"
                required
              />
              <Input
                type="password"
                id="password"
                name="password"
                value={authForm.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="h-10 placeholder:text-muted-foreground/80"
                required
              />

              <div className="w-full flex items-center justify-between mt-2">
                <Field orientation="horizontal">
                  <Checkbox
                    id="remember-me"
                    name="remember-me"
                    className="data-[state=checked]:bg-violet-800 data-[state=checked]:border-violet-800"
                  />
                  <FieldLabel
                    htmlFor="remember-me"
                    className="text-muted-foreground text-xs font-medium"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
                <p className="text-muted-foreground text-xs cursor-pointer font-medium inline-block text-nowrap">
                  Forgot Password?
                </p>
              </div>
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Action Button */}
        <div className="flex justify-center lg:justify-start">
          <Button
            type="submit"
            className="py-5 px-8 w-full lg:w-[30%] bg-violet-800 hover:bg-violet-900 cursor-pointer"
          >
            {isRegisterPending || isLoginPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : form === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </form>

      {/* Action Section */}
      {form === "login" ? (
        <p
          className="text-muted-foreground text-sm"
          onClick={() => setForm("register")}
        >
          don&apos;t have an account?{" "}
          <span className="text-violet-800 hover:underline cursor-pointer">
            Sign Up
          </span>{" "}
        </p>
      ) : (
        <p
          className="text-muted-foreground text-sm"
          onClick={() => setForm("login")}
        >
          already have an account?{" "}
          <span className="text-violet-800 hover:underline cursor-pointer">
            Sign In
          </span>{" "}
        </p>
      )}
    </div>
  );
}
