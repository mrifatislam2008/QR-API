const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * QR Code-এর উপর Logo Overlay করে নতুন PNG Buffer রিটার্ন করবে
 * @param {Buffer} qrBuffer - QR Code PNG Buffer
 * @param {string|null} logoUrl - Logo URL (ঐচ্ছিক)
 * @returns {Promise<Buffer>}
 */
async function addLogo(qrBuffer, logoUrl = null) {
    try {
        let logoBuffer;

        // Logo URL দেওয়া থাকলে URL থেকে ডাউনলোড করবে
        if (logoUrl) {
            const response = await axios.get(logoUrl, {
                responseType: "arraybuffer",
                timeout: 10000
            });

            logoBuffer = Buffer.from(response.data);
        } else {
            // Default Logo ব্যবহার করবে
            const defaultLogo = path.join(process.cwd(), "default-logo.png");

            if (!fs.existsSync(defaultLogo)) {
                return qrBuffer;
            }

            logoBuffer = fs.readFileSync(defaultLogo);
        }

        // QR Code-এর সাইজ বের করা
        const qrMeta = await sharp(qrBuffer).metadata();

        // Logo QR-এর প্রায় ২০% সাইজ হবে
        const logoSize = Math.floor(
            Math.min(qrMeta.width, qrMeta.height) * 0.20
        );

        // Logo Resize
        const resizedLogo = await sharp(logoBuffer)
            .resize(logoSize, logoSize)
            .png()
            .toBuffer();

        // QR-এর মাঝখানে Logo বসানো
        return await sharp(qrBuffer)
            .composite([
                {
                    input: resizedLogo,
                    gravity: "center"
                }
            ])
            .png()
            .toBuffer();

    } catch (error) {
        console.error("Logo Overlay Error:", error.message);

        // সমস্যা হলে মূল QR ফিরিয়ে দিবে
        return qrBuffer;
    }
}

module.exports = addLogo;
