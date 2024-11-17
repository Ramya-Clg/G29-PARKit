import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; // Verify these exist

// Mock data for the charts
const dailyIncomeData = [
  { day: "Mon", income: 1000 },
  { day: "Tue", income: 1200 },
  { day: "Wed", income: 1100 },
  { day: "Thu", income: 1300 },
  { day: "Fri", income: 1500 },
  { day: "Sat", income: 1800 },
  { day: "Sun", income: 1600 },
];

const monthlyIncomeData = [
  { name: "Hourly", value: 4000 },
  { name: "Daily", value: 3000 },
  { name: "Weekly", value: 2000 },
  { name: "Monthly", value: 1000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function Admin({
  totalIncome = 50000,
  userName = "John Doe",
  userPhone = "123-456-7890",
  userEmail = "john@example.com",
  userParkingSlots = [{ id: "1", location: "Lot A, Spot 23" }],
}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
              <CardDescription>From all parking plots</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userName}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userPhone}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userEmail}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parking Slots</Label>
                  {userParkingSlots && userParkingSlots.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {userParkingSlots.map((slot) => (
                        <li key={slot.id} className="text-sm">
                          {slot.location}
                        </li>
                      ))}
                    </ul>
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
        <Tabs defaultValue="daily" className="mt-6">
          <TabsList>
            <TabsTrigger value="daily">Daily Income</TabsTrigger>
            <TabsTrigger value="monthly">
              Monthly Income Distribution
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Daily Income</CardTitle>
                <CardDescription>
                  Overview of daily parking income
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8884d8" name="Income" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income Distribution</CardTitle>
                <CardDescription>Breakdown of income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={monthlyIncomeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {monthlyIncomeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
