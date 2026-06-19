const express = require("express");
const validateKey = require("./auth");
const generateQR = require("./qr-generator");
const addLogo = require("./logo");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "QR API",
        version: "1.0.0",
        endpoint: "/qr"
    });
});

app.get("/qr", async (req, res) => {
    try {
        const {
            api_key,
            data,
            format = "png",
            color = "000000",
            bg = "FFFFFF",
            size = "300",
            logo
        } = req.query;

        // API Key যাচাই
        const auth = validateKey(api_key);

        if (!auth.valid) {
            return res.status(401).json({
                success: false,
                message: auth.message
            });
        }

        // Data চেক
        if (!data) {
            return res.status(400).json({
                success: false,
                message: "data parameter is required"
            });
        }

        // QR Generate
        let qr = await generateQR({
            data,
            format,
            color,
            bg,
            width: parseInt(size)
        });

        // SVG হলে Logo যোগ করা হবে না
        if (format.toLowerCase() !== "svg") {
            qr = await addLogo(qr, logo);
        }

        // Content-Type সেট করা
        if (format === "svg") {
            res.setHeader("Content-Type", "image/svg+xml");
        } else if (format === "jpg" || format === "jpeg") {
            res.setHeader("Content-Type", "image/jpeg");
        } else {
            res.setHeader("Content-Type", "image/png");
        }

        return res.send(qr);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`QR API running on port ${PORT}`);
});
