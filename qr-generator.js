const QRCode = require("qrcode");
const sharp = require("sharp");

/**
 * QR Code Generate
 * @param {Object} options
 * @param {string} options.data
 * @param {string} options.format (png|jpg|svg)
 * @param {string} options.color
 * @param {string} options.bg
 * @param {number} options.width
 * @returns {Promise<Buffer|string>}
 */

async function generateQR({
    data,
    format = "png",
    color = "000000",
    bg = "FFFFFF",
    width = 300
}) {

    format = format.toLowerCase();

    const qrOptions = {
        width,
        margin: 2,
        color: {
            dark: `#${color}`,
            light: `#${bg}`
        }
    };

    // SVG Output
    if (format === "svg") {
        return await QRCode.toString(data, {
            ...qrOptions,
            type: "svg"
        });
    }

    // PNG তৈরি
    const pngBuffer = await QRCode.toBuffer(data, {
        ...qrOptions,
        type: "png"
    });

    // JPG Output
    if (format === "jpg" || format === "jpeg") {
        return await sharp(pngBuffer)
            .jpeg({
                quality: 95
            })
            .toBuffer();
    }

    // Default PNG
    return pngBuffer;
}

module.exports = generateQR;
