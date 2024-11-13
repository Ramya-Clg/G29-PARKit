"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function ResponsiveParkingSlotBooking() {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()
  const [duration, setDuration] = useState<string>("1")

  const handleBooking = () => {
    if (!date || !time) {
      toast({
        title: "Booking Failed",
        description: "Please select both date and time for your booking.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking Confirmed",
      description: `Your parking slot is booked for ${format(date, "PPP")} at ${time} for ${duration} hour(s).`,
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Book a Parking Slot</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="date-picker" className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
  
        <div className="space-y-2">
          <label htmlFor="time-picker" className="text-sm font-medium">Select Time</label>
          <Select onValueChange={setTime}>
            <SelectTrigger id="time-picker" className="w-full">
              <SelectValue placeholder="Select time">
                {time ? (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {time}
                  </div>
                ) : (
                  "Select time"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="space-y-2">
          <label htmlFor="duration-picker" className="text-sm font-medium">Duration (hours)</label>
          <Select defaultValue={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration-picker" className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((hours) => (
                <SelectItem key={hours} value={hours.toString()}>
                  {hours} hour{hours > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="md:self-end">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-bold">Slots Available</p>
            <p className="text-sm">Parking slots are currently available for the selected date and time.</p>
          </div>
        </div>
      </div>
  
      <Button className="w-full md:w-auto md:px-8 md:mx-auto" onClick={handleBooking}>
        Book Parking Slot
      </Button>
    </div>
  )  
}
