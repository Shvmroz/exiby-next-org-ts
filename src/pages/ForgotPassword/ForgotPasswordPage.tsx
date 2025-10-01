'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "notistack";
import { 
  _forgot_password_api, 
  _verify_forgot_password_code_api, 
  _reset_password_api 
} from "@/DAL/authAPI";
import Button from "@/components/ui/custom-button";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      enqueueSnackbar("Please enter your email address", { variant: "error" });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await _forgot_password_api({ email });

      if (result.code === 200) {
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
      const result = await _verify_forgot_password_code_api({
        email: email,
        code: verificationCode,
      });

      if (result.code === 200) {
        setStep(3);
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

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    if (newPassword.length < 5) {
      enqueueSnackbar("Password must be at least 5 characters", { variant: "error" });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await _reset_password_api({
        email: email,
        new_password: newPassword,
      });

      if (result.code === 200) {
        enqueueSnackbar(result.message, { variant: "success" });
        router.push("/login");
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
      const result = await _forgot_password_api({ email });

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

  const isPasswordValid = newPassword && confirmPassword && 
                         newPassword === confirmPassword && 
                         newPassword.length >= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-[#0077ED] via-[#4A9AFF] to-[#0077ED] bg-clip-text text-transparent">
                Reset Password
              </span>
              <span className="block text-lg lg:text-xl font-medium mt-2 bg-gradient-to-r from-[#0077ED] via-[#4A9AFF] to-[#0077ED] bg-clip-text text-transparent">
                ExiBy Platform
              </span>
            </h1>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Secure Account Recovery
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Don't worry, we'll help you regain access to your account safely and securely.
            </p>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              
              {step === 1 ? (
                <>
                  {/* Email Form */}
                  <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-[#0077ED]" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Forgot Password?
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Enter your email address and we'll send you a verification code
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                          Sending Code...
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => router.push("/login")}
                      className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </button>
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  {/* Verification Code Form */}
                  <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Check Your Email
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
                        "Verify Code"
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
                        Back to Email
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* New Password Form */}
                  <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Create New Password
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-10 pr-12 py-3"
                          placeholder="Enter new password"
                        />
                        <span
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          )}
                        </span>
                      </div>
                      {newPassword && newPassword.length < 5 && (
                        <p className="text-red-600 text-xs mt-1">Password must be at least 5 characters</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-12 py-3"
                          placeholder="Confirm new password"
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
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !isPasswordValid}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}