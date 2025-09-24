"use client"
import { Suspense } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import LoginSearchParams from "@/components/LoginSearchParams";

function AuthContent() {
  const { mode, toggleMode } = LoginSearchParams();

  const handleSignin = async () => {
    await signIn('google');
  };

  const isLoginMode = mode === "login";

  return (
    <AuthLayout>
      <Card className="hover:scale-[1.01]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLoginMode ? "Welcome Back!" : "Create Account"}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {isLoginMode 
              ? "Sign in to your account" 
              : "Sign up for a new account"
            }
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md  -gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            onClick={handleSignin}
          >
            <FcGoogle className="h-5 w-5" />
            {isLoginMode ? "Sign in with Google" : "Sign up with Google"}
          </Button>

          {/* Toggle Mode Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLoginMode ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => toggleMode("register")}
                  className="text-blue-600 hover:underline font-medium cursor-pointer bg-transparent -none"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => toggleMode("login")}
                  className="text-blue-600 hover:underline font-medium cursor-pointer bg-transparent -none"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
