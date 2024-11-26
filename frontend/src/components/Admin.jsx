import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const COLORS = [
  "var(--text-secondary)", // Teal accent
  "var(--background-primary)", // Orange/Gold
  "var(--background-secondary)", // Lime green
  "var(--text-primary)", // Navy blue
];

export function Admin() {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    dailyIncome: [],
    monthlyDistribution: [],
    parkingStats: {
      totalSlots: 0,
      occupiedSlots: 0,
    },
    paymentStats: {
      totalPayments: 0,
      averageAmount: 0,
      recentPayments: [],
    },
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          navigate("/admin/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          toast({
            title: "Session Expired",
            description: "Please login again",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch dashboard data",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-[-10px]">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-8 px-4"
      style={{ backgroundColor: "var(--text-light)" }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="max-w-fit"
            style={{
              backgroundColor: "var(--text-secondary)",
              color: "var(--text-light)",
            }}
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="border-[var(--text-secondary)]">
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
              <CardDescription>Overall earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₹{dashboardData.totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--text-secondary)]">
            <CardHeader>
              <CardTitle>Parking Stats</CardTitle>
              <CardDescription>Current occupancy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Slots: {dashboardData.parkingStats.totalSlots}</p>
                <p>Occupied: {dashboardData.parkingStats.occupiedSlots}</p>
                <p>
                  Available:{" "}
                  {dashboardData.parkingStats.totalSlots -
                    dashboardData.parkingStats.occupiedSlots}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--text-secondary)]">
            <CardHeader>
              <CardTitle>Payment Statistics</CardTitle>
              <CardDescription>Payment overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Total Payments: {dashboardData.paymentStats.totalPayments}
                </p>
                <p>
                  Average Amount: ₹
                  {dashboardData.paymentStats.averageAmount.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="bg-[var(--background-secondary)]">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-[var(--text-secondary)] data-[state=active]:text-[var(--text-light)]"
            >
              Daily Income
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-[var(--text-secondary)] data-[state=active]:text-[var(--text-light)]"
            >
              Monthly Distribution
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-[var(--text-secondary)] data-[state=active]:text-[var(--text-light)]"
            >
              Recent Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Daily Income</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.dailyIncome}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="income"
                      fill="var(--text-secondary)"
                      name="Income"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Distribution</CardTitle>
                <CardDescription>Income by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.monthlyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="var(--text-secondary)"
                      dataKey="value"
                    >
                      {dashboardData.monthlyDistribution.map((entry, index) => (
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

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Last 10 payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.paymentStats.recentPayments.map(
                    (payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            Amount: ₹{payment.amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {payment.duration} hours
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p>User: {payment.userName}</p>
                          <p>Status: {payment.status}</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>Payment trends and statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.paymentStats.recentPayments.slice(0, 7)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    fill="var(--background-secondary)"
                    name="Payment Amount"
                  />
                  <Bar
                    dataKey="duration"
                    fill="var(--text-secondary)"
                    name="Duration (hours)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
