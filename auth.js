const fs = require("fs");
const path = require("path");

/**
 * API Key যাচাই করে
 * @param {string} apiKey
 * @returns {boolean}
 */
function isValidApiKey(apiKey) {
    try {
        // API Key না থাকলে
        if (!apiKey) {
            return false;
        }

        // api-keys.json ফাইলের পথ
        const filePath = path.join(process.cwd(), "api-keys.json");

        // ফাইল না থাকলে
        if (!fs.existsSync(filePath)) {
            console.error("api-keys.json file not found");
            return false;
        }

        // JSON পড়া
        const data = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        // keys অ্যারে আছে কিনা
        if (!Array.isArray(data.keys)) {
            return false;
        }

        // Key মিলিয়ে দেখা
        return data.keys.includes(apiKey);

    } catch (error) {
        console.error("Auth Error:", error.message);
        return false;
    }
}

module.exports = isValidApiKey;
