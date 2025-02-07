"use client";

import { useState, FC } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { sup } from "@/_sdk/supabase";

type AdminLoginProps = {
  refetch: () => Promise<void>;
};

export const AdminLogin: FC<AdminLoginProps> = ({ refetch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please provide email and password.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await sup.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Please provide valid email and password");
      setIsLoading(false);
      return;
    }

    const userId = data.user.id;

    const { data: roles, error: roleError } = await sup
      .from("roles")
      .select("id, role")
      .eq("id", userId);

    if (roleError) {
      setError(roleError.message);
      setIsLoading(false);
      return;
    }

    const role = roles?.[0];

    if (!role || role.role !== "admin") {
      setError("You are not authorised to view this page.");
      setIsLoading(false);
      return;
    }

    await refetch();
    setIsLoading(false);
  };

  return (
    <section className="flex flex-col justify-center items-center select-none h-[90vh]">
      <h1 className="mb-10 font-semibold text-xl"> Tandoori Grills </h1>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to Dashboard</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            onClick={handleLogin}
            className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};
