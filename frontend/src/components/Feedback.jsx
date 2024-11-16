import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import "./Feedback.css";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating.",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: undefined,
      message: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log(values);
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    form.reset();
  }

  return (
    <div class="feedback">
      <div class="card">
        <Card className="w-full max-w-[calc(100%-2rem)] sm:max-w-md mx-auto mt-[50px] mb-[10px]">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center">
              Feedback Form
            </CardTitle>
            <CardDescription className="text-center">
              We value your feedback. Please fill out the form below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Name
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="w-full"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="w-full"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Rating</Label>
                <RadioGroup
                  onValueChange={(value) => form.setValue("rating", value)}
                  className="flex flex-wrap gap-4 sm:gap-6"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-6">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`rating-${value}`}
                      />
                      <Label
                        htmlFor={`rating-${value}`}
                        className="text-xl sm:text-base"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.formState.errors.rating && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm sm:text-base">
                  Feedback Message
                </Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  className="w-full min-h-[100px]"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
