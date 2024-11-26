import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/login`,
        values,
      );

      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem("adminToken", token);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--text-light)" }}
    >
      <Card
        className="w-[400px]"
        style={{
          backgroundColor: "var(--text-light)",
          borderColor: "var(--text-secondary)",
          borderWidth: "2px",
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>
            Admin Login
          </CardTitle>
          <CardDescription
            style={{ color: "var(--text-primary)", opacity: 0.8 }}
          >
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        {...field}
                        className="border-[var(--text-secondary)] focus:border-[var(--text-secondary)] focus:ring-[var(--text-secondary)]"
                        style={{
                          backgroundColor: "var(--text-light)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="border-[var(--text-secondary)] focus:border-[var(--text-secondary)] focus:ring-[var(--text-secondary)]"
                        style={{
                          backgroundColor: "var(--text-light)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full hover:opacity-90"
                style={{
                  backgroundColor: "var(--text-secondary)",
                  color: "var(--text-light)",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
