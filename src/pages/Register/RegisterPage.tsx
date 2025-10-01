'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "notistack";
import { _register_api, _verify_registration_code_api } from "@/DAL/authAPI";
import Button from "@/components/ui/custom-button";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Registration Form, 2: Verification Code
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    if (formData.password.length < 5) {
      enqueueSnackbar("Password must be at least 5 characters", { variant: "error" });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await _register_api({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      if (result.code === 200) {
        setEmail(formData.email);
        setStep(2);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      enqueueSnackbar("Please enter a valid 6-digit code", { variant: "error" });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await _verify_registration_code_api({
        email: email,
        code: verificationCode,
      });

      if (result.code === 200) {
        // Auto login after successful registration
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(result.admin));
        
        enqueueSnackbar(result.message, { variant: "success" });
        router.push("/dashboard");
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      const result = await _register_api({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      if (result.code === 200) {
        enqueueSnackbar("Verification code resent successfully", { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to resend code", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.first_name && formData.last_name && formData.email && 
                     formData.password && formData.confirmPassword && 
                     formData.password === formData.confirmPassword &&
                     formData.password.length >= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-[#0077ED] via-[#4A9AFF] to-[#0077ED] bg-clip-text text-transparent">
                Join ExiBy
              </span>
              <span className="block text-lg lg:text-xl font-medium mt-2 bg-gradient-to-r from-[#0077ED] via-[#4A9AFF] to-[#0077ED] bg-clip-text text-transparent">
                Organizations | Companies
              </span>
            </h1>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Start Managing Events
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Create your account and start organizing amazing events, connecting with companies, and managing attendees.
            </p>
          </div>
        </div>

        {/* Right Column - Registration Form */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              
              {step === 1 ? (
                <>
                  {/* Registration Form Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Create Account
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Fill in your details to get started
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="block w-full pl-10 pr-3 py-3"
                            placeholder="First name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="last_name"
                            name="last_name"
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="block w-full pl-10 pr-3 py-3"
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full pl-10 pr-3 py-3"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="block w-full pl-10 pr-12 py-3"
                          placeholder="Enter your password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          )}
                        </span>
                      </div>
                      {formData.password && formData.password.length < 5 && (
                        <p className="text-red-600 text-xs mt-1">Password must be at least 5 characters</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="block w-full pl-10 pr-12 py-3"
                          placeholder="Confirm your password"
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          )}
                        </span>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <button
                        onClick={() => router.push("/login")}
                        className="font-medium text-[#0077ED] hover:text-[#0066CC]"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Verification Code Form */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Verify Your Email
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit code to
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {email}
                    </p>
                  </div>

                  <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Code
                      </label>
                      <Input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        maxLength={6}
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="block w-full text-center text-2xl tracking-widest py-4"
                        placeholder="000000"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || verificationCode.length !== 6}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify & Create Account"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center space-y-4">
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm font-medium text-[#0077ED] hover:text-[#0066CC] disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                    
                    <div>
                      <button
                        onClick={() => setStep(1)}
                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Registration
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}