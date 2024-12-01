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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSlotAvailable, setIsSlotAvailable] = useState(false);
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

  const checkAvailability = async (date, time, duration) => {
    if (!date || !time || !duration) return;

    setIsChecking(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parking/check-availability`,
        {
          reservationDate: formattedDate,
          reservationTime: time,
          Duration: parseInt(duration),
        },
      );

      setIsSlotAvailable(response.data.available);

      if (response.data.available) {
        toast({
          title: "Available",
          description: "Parking slot is available for selected time",
        });
      } else {
        toast({
          title: "Not Available",
          description: "No slots available for selected time",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Availability check error:", error);
      setIsSlotAvailable(false);
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (value.date && value.time && value.duration) {
        checkAvailability(value.date, value.time, value.duration);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Please login to book a parking slot",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const formattedDate = format(values.date, "yyyy-MM-dd");

      const requestData = {
        reservationDate: formattedDate,
        reservationTime: values.time,
        Duration: parseInt(values.duration),
        vehicleNumberPlate: values.numberPlate.toUpperCase(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/parking/reserve`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        },
      );

      toast({
        title: "Success",
        description: `Slot ${response.data.data.slotNumber} has been assigned to you!`,
        duration: 3000,
      });

      navigate("/profile");
      form.reset();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast({
          title: "Session Expired",
          description: "Please login again to continue",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

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
    <div className="booking">
      <Card className="card w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-8 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-lg">
        <CardHeader>
          <CardTitle style={{ color: "var(--text-primary)" }}>
            Book Parking Slot
          </CardTitle>
          <CardDescription
            style={{ color: "var(--text-primary)", opacity: 0.8 }}
          >
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
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-[var(--text-secondary)]",
                              !field.value && "text-muted-foreground",
                            )}
                            style={{
                              backgroundColor: "var(--text-light)",
                              color: field.value
                                ? "var(--text-primary)"
                                : undefined,
                            }}
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
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Select Time
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className="border-[var(--text-secondary)]"
                          style={{
                            backgroundColor: "var(--text-light)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem
                            key={i}
                            value={`${String(i).padStart(2, "0")}:00`}
                          >
                            {`${String(i).padStart(2, "0")}:00`}
                          </SelectItem>
                        ))}
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
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Duration (Hours)
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className="border-[var(--text-secondary)]"
                          style={{
                            backgroundColor: "var(--text-light)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((hours) => (
                          <SelectItem key={hours} value={hours.toString()}>
                            {hours} {hours === 1 ? "hour" : "hours"}
                          </SelectItem>
                        ))}
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
                    <FormLabel style={{ color: "var(--text-primary)" }}>
                      Vehicle Number Plate
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter vehicle number plate"
                        {...field}
                        className="border-[var(--text-secondary)]"
                        style={{
                          backgroundColor: "var(--text-light)",
                          color: "var(--text-primary)",
                        }}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("date") &&
                form.watch("time") &&
                form.watch("duration") && (
                  <div
                    className={cn(
                      "rounded-lg border p-3 text-sm",
                      isChecking
                        ? "bg-[var(--text-light)] border-[var(--text-secondary)]"
                        : isSlotAvailable
                          ? "bg-[var(--background-secondary)] border-[var(--text-secondary)]"
                          : "bg-red-50 border-red-500",
                    )}
                  >
                    <div className="font-medium">
                      {isChecking
                        ? "Checking Availability..."
                        : isSlotAvailable
                          ? "Slot Available"
                          : "No Slots Available"}
                    </div>
                    <div
                      className={cn(
                        isChecking
                          ? "text-gray-600"
                          : isSlotAvailable
                            ? "text-green-600"
                            : "text-red-600",
                      )}
                    >
                      {isChecking
                        ? "Please wait while we check slot availability."
                        : isSlotAvailable
                          ? "You can proceed with the booking."
                          : "Please select a different time or date."}
                    </div>
                  </div>
                )}

              <Button
                type="submit"
                className="w-full hover:opacity-90"
                style={{
                  backgroundColor: "var(--text-secondary)",
                  color: "var(--text-light)",
                }}
                disabled={isSubmitting || isChecking || !isSlotAvailable}
              >
                {isSubmitting
                  ? "Booking..."
                  : isChecking
                    ? "Checking Availability..."
                    : "Book Parking Slot"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
