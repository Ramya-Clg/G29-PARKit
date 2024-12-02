import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SecurityVerification() {
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a booking ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parking/verify-entry`,
        { bookingId },
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.msg,
        });
        setBookingId("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Verification failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("securityToken");
    navigate("/security/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--text-light)]">
      <div className="w-full p-4 flex justify-end absolute right-[26vw] top-[33vh]">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="max-w-fit bg-[var(--text-secondary)] text-[var(--text-light)] mr-60"
        >
          Logout
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center ">
        <Card className="w-[400px] border-[var(--text-secondary)]">
          <CardHeader>
            <CardTitle>Security Verification</CardTitle>
            <CardDescription>
              Enter booking ID to verify entry/exit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerification} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter Booking ID"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="border-[var(--text-secondary)]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--text-secondary)] text-[var(--text-light)]"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
