import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          toast({
            title: "Error",
            description: "Please login to view profile",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/details`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        
        console.log('User details response:', response.data);
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data || error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        toast({
          title: "Error",
          description: error.response?.data?.msg || "Failed to fetch user details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [toast, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return <div>No user details available.</div>;
  }

  const { name, phone, email, parkingSlots } = userDetails;

  return (
    <div className="main_container_profile flex items-center justify-center min-h-screen">
      <div className="card">
        <div className="container mx-auto p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value="********"
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Parking Slots</Label>
                  {parkingSlots && parkingSlots.length > 0 ? (
                    <div className="space-y-3">
                      {parkingSlots.map((slot) => (
                        <div key={slot._id} className="bg-muted p-3 rounded-lg">
                          <div className="text-sm font-medium">
                            Slot Number: {slot.slotNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Vehicle: {slot.vehicleNumberPlate}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Time:{" "}
                            {new Date(slot.reservationTime).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Duration: {slot.duration} hours
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Status: {slot.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No parking slots booked
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
