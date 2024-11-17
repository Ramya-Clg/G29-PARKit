import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import "./Booking.css";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  duration: z.string({
    required_error: "Please select duration.",
  }),
  numberPlate: z
    .string()
    .min(1, "Number plate is required")
    .max(10, "Number plate cannot exceed 10 characters")
    .regex(
      /^[A-Z0-9 ]+$/,
      "Only uppercase letters, numbers and spaces are allowed",
    ),
});

export default function Component() {
  const [slotsAvailable, setSlotsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: undefined,
      duration: undefined,
      numberPlate: "",
    },
  });

  // Check slot availability when date, time, or duration changes
  const watchFields = form.watch(["date", "time", "duration"]);
  
  useEffect(() => {
    const [date, time, duration] = watchFields;
    if (date && time && duration) {
      console.log('Checking availability with:', { date, time, duration });
      checkSlotAvailability(date, time, duration);
    }
  }, [watchFields]);

  const checkSlotAvailability = async (date, time, duration) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log('Frontend: Sending availability check request:', {
        date: formattedDate,
        time,
        duration
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/parking/available`,
        {
          params: {
            reservationDate: formattedDate,
            reservationTime: time,
            duration: duration,
          },
        }
      );

      console.log('Frontend: Received response:', response.data);

      if (response.data.available) {
        setSlotsAvailable(true);
        toast({
          title: "Slot Available",
          description: `Parking slot ${response.data.slotNumber} is available`,
        });
      } else {
        setSlotsAvailable(false);
        toast({
          title: "No Slots Available",
          description: response.data.message || "No parking slots available for the selected time period.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Frontend: Availability check error:', error);
      console.error('Frontend: Error response:', error.response?.data);
      setSlotsAvailable(false);
      toast({
        title: "No Slots Available",
        description: error.response?.data?.message || "No parking slots available for the selected time period.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values) {
    if (!slotsAvailable) {
      toast({
        title: "Error",
        description: "No slots available for the selected time period.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to book a parking slot",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const formattedDate = format(values.date, "yyyy-MM-dd");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parking/reserve`,
        {
          reservationDate: formattedDate,
          reservationTime: values.time,
          Duration: parseInt(values.duration),
          vehicleNumberPlate: values.numberPlate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: `Parking slot ${response.data.slotNumber} booked successfully!`,
      });

      navigate('/dashboard');
      form.reset();
      
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to book parking slot",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="main_container_booking">
      <div className="card">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Book Parking Slot</CardTitle>
            <CardDescription>
              Select your preferred date and time for parking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">01:00 PM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                          <SelectItem value="17:00">05:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Hours)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="5">5 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberPlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number Plate</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter vehicle number plate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {slotsAvailable ? (
                  <div className="rounded-lg border bg-green-50 p-3 text-sm">
                    <div className="font-medium">Slots Available</div>
                    <div className="text-green-600">
                      Parking slots are currently available for the selected
                      date and time.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-red-50 p-3 text-sm">
                    <div className="font-medium">No Slots Available</div>
                    <div className="text-red-600">
                      Sorry, no parking slots are available for the selected
                      date and time.
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !slotsAvailable}
                >
                  {isSubmitting ? "Booking..." : "Book Parking Slot"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
