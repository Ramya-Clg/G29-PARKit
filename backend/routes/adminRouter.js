import { Router } from "express";
import {
  Admin,
  Reservation,
  ParkingSlot,
  AdminStats,
  Payment,
} from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminRouter = Router();

const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Access denied. Admin only route.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error checking admin status",
      error: error.message,
    });
  }
};

adminRouter.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" },
    );
    console.log("here");

    res.json({
      success: true,
      msg: "Login successful",
      data: {
        token,
        admin: {
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      msg: "Login failed",
      error: error.message,
    });
  }
});

adminRouter.get(
  "/dashboard",
  authorizationMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const payments = await Payment.find({ status: "completed" });
      const totalIncome = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      );
      const totalPayments = payments.length;
      const averageAmount = totalPayments > 0 ? totalIncome / totalPayments : 0;

      const recentPayments = await Payment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "name");

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailyIncome = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: "completed",
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            income: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const monthlyDistribution = await Payment.aggregate([
        {
          $match: { status: "completed" },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            value: { $sum: "$amount" },
          },
        },
        {
          $project: {
            name: {
              $let: {
                vars: {
                  monthsInString: [
                    "",
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ],
                },
                in: { $arrayElemAt: ["$$monthsInString", "$_id"] },
              },
            },
            value: 1,
          },
        },
      ]);

      const parkingStats = await ParkingSlot.aggregate([
        {
          $group: {
            _id: null,
            totalSlots: { $sum: 1 },
            occupiedSlots: {
              $sum: { $cond: ["$isOccupied", 1, 0] },
            },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          totalIncome,
          dailyIncome: dailyIncome.map((day) => ({
            day: day._id,
            income: day.income,
          })),
          monthlyDistribution,
          parkingStats: parkingStats[0] || { totalSlots: 0, occupiedSlots: 0 },
          paymentStats: {
            totalPayments,
            averageAmount,
            recentPayments: recentPayments.map((payment) => ({
              amount: payment.amount,
              duration: payment.duration,
              createdAt: payment.createdAt,
              userName: payment.user?.name || "Unknown User",
              status: payment.status,
            })),
          },
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({
        success: false,
        msg: "Error fetching dashboard data",
        error: error.message,
      });
    }
  },
);

adminRouter.get(
  "/reservations",
  authorizationMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const reservations = await Reservation.find()
        .populate("user", "name email")
        .populate("parkingSlot", "slotNumber")
        .sort({ reservationTime: -1 });

      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      console.error("Reservations fetch error:", error);
      res.status(500).json({
        success: false,
        msg: "Error fetching reservations",
        error: error.message,
      });
    }
  },
);

adminRouter.get(
  "/slots/stats",
  authorizationMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const stats = await ParkingSlot.aggregate([
        {
          $lookup: {
            from: "reservations",
            localField: "reservations",
            foreignField: "_id",
            as: "reservationDetails",
          },
        },
        {
          $project: {
            slotNumber: 1,
            isOccupied: 1,
            totalReservations: { $size: "$reservationDetails" },
            revenue: {
              $sum: {
                $map: {
                  input: "$reservationDetails",
                  as: "reservation",
                  in: { $multiply: ["$$reservation.duration", 100] },
                },
              },
            },
          },
        },
      ]);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Slots stats error:", error);
      res.status(500).json({
        success: false,
        msg: "Error fetching slot statistics",
        error: error.message,
      });
    }
  },
);

adminRouter.get(
  "/profile",
  authorizationMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const admin = await Admin.findById(req.user._id).select("-password");
      res.json({
        success: true,
        data: admin,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({
        success: false,
        msg: "Error fetching admin profile",
        error: error.message,
      });
    }
  },
);

adminRouter.get("/stats", authorizationMiddleware, async (req, res) => {
  try {
    const stats = (await AdminStats.findOne()) || new AdminStats();

    res.json({
      success: true,
      data: {
        totalIncome: stats.totalIncome,
        totalBookings: stats.totalBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to fetch admin stats",
      error: error.message,
    });
  }
});

export default adminRouter;
