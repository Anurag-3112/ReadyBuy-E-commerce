import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString(),
    });
});

export default router;