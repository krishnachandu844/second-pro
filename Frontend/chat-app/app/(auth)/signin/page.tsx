"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
        {
          username: formData.username,
          password: formData.password,
        },
      );
      Cookies.set("token", res.data.token);
      router.push("/chat");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='dark min-h-screen w-full bg-background flex items-center justify-center px-4'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20'></div>
        <div className='absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20'></div>
      </div>

      <Card className='relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl'>
        <div className='p-8'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>✧</span>
              </div>
            </div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Welcome Back
            </h1>
            <p className='text-muted-foreground text-sm'>
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Username */}
            <div className='space-y-2'>
              <Label
                htmlFor='username'
                className='text-foreground text-sm font-medium'
              >
                Username
              </Label>
              <Input
                id='username'
                name='username'
                type='text'
                placeholder='Enter your username'
                value={formData.username}
                onChange={handleChange}
                required
                className='bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary/50'
              />
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='text-foreground text-sm font-medium'
                >
                  Password
                </Label>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                required
                className='bg-input border-border/50 text-foreground placeholder:text-muted-foreground focus:ring-primary/50'
              />
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full mt-6 bg-linear-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-2 h-10 rounded-lg transition-all duration-200'
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center gap-3'>
            <div className='flex-1 h-px bg-border/30'></div>
            <span className='text-xs text-muted-foreground uppercase'>Or</span>
            <div className='flex-1 h-px bg-border/30'></div>
          </div>

          {/* Sign Up Link */}
          <p className='text-center text-muted-foreground text-sm'>
            Don't have an account?{" "}
            <Link
              href='/signup'
              className='font-semibold text-primary hover:text-accent transition-colors'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
