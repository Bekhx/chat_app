// Environment Variable Validation Configuration

const dotenv = require('dotenv');
dotenv.config();

const validateEnvVars = () => {
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'JWT_SECRET'];
    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    });
};

validateEnvVars();

module.exports = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    jwtSecret: process.env.JWT_SECRET,
};