const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
require("dotenv").config();

const { PDFParse } = require("pdf-parse");

const User = require("./models/User");

const {
    parseResumeWithAI,
    improveCareerDataWithAI
} = require("./ai_parser");


// ======================================================
// APP SETUP
// ======================================================
const app = express();
const PORT = process.env.PORT || 3000;


// ======================================================
// MIDDLEWARE
// ======================================================
app.use(cors());
app.use(express.json({ limit: "2mb" }));


// ======================================================
// ENVIRONMENT CHECK
// ======================================================
console.log(
    "🔐 Groq API key loaded:",
    Boolean(process.env.GROQ_API_KEY)
);

console.log(
    "🍃 MongoDB URI loaded:",
    Boolean(process.env.MONGO_URI)
);


// ======================================================
// RESUME UPLOAD SETUP
// ======================================================
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF files are allowed."
                )
            );
        }
    }
});


// ======================================================
// MONGODB CONNECTION
// ======================================================
if (!process.env.MONGO_URI) {
    console.error(
        "❌ MONGO_URI is missing from .env"
    );
} else {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log(
                "✅ Connected to MongoDB ✦"
            );
        })
        .catch((error) => {
            console.error(
                "❌ MongoDB connection failed:",
                error.message
            );
        });
}


// ======================================================
// TEST ROUTE
// ======================================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PortfolioAI backend is working! ✦"
    });
});


// ======================================================
// SIGNUP API
// ======================================================
app.post("/api/signup", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();
        const password = String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long."
            });
        }

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message:
                "Account created successfully!"
        });
    } catch (error) {
        console.error(
            "❌ Signup error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                message:
                    "An account with this email already exists."
            });
        }

        return res.status(500).json({
            message:
                "Something went wrong while creating the account."
        });
    }
});


// ======================================================
// LOGIN API
// ======================================================
app.post("/api/login", async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Please enter your email and password."
            });
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message:
                    "Invalid email or password."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(
            "❌ Login error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong while logging in."
        });
    }
});


// ======================================================
// RESUME UPLOAD + PDF EXTRACTION + AI PARSING
// ======================================================
app.post(
    "/api/upload-resume",
    upload.single("resume"),
    async (req, res) => {
        let parser = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    message:
                        "Please upload a PDF resume."
                });
            }

            console.log(
                "📄 Resume received:",
                req.file.originalname
            );

            console.log(
                "📖 Extracting PDF text..."
            );

            parser = new PDFParse({
                data: req.file.buffer
            });

            const result = await parser.getText();
            const extractedText = result?.text || "";

            console.log(
                "✅ PDF text extracted successfully!"
            );

            console.log(
                "Characters extracted:",
                extractedText.length
            );

            if (!extractedText.trim()) {
                return res.status(400).json({
                    message:
                        "Could not extract readable text from this PDF."
                });
            }

            console.log(
                "🤖 Sending resume to Groq..."
            );

            const parsedResume =
                await parseResumeWithAI(
                    extractedText
                );

            console.log(
                "✅ Resume parsed by AI!"
            );

            return res.status(200).json({
                success: true,
                message:
                    "Resume uploaded and parsed successfully!",
                fileName:
                    req.file.originalname,
                text: extractedText,
                parsedData: parsedResume
            });
        } catch (error) {
            console.error(
                "❌ Resume processing error:",
                error.message || error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Could not read or analyze the resume."
            });
        } finally {
            if (parser) {
                try {
                    await parser.destroy();
                } catch (destroyError) {
                    console.error(
                        "PDF parser cleanup error:",
                        destroyError.message || destroyError
                    );
                }
            }
        }
    }
);


// ======================================================
// AI CAREER DATA IMPROVEMENT
// ======================================================
app.post(
    "/api/improve-career",
    async (req, res) => {
        try {
            const careerData = req.body;

            if (
                !careerData ||
                typeof careerData !== "object"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Career data is required."
                });
            }

            console.log(
                "✨ Improving career data with AI..."
            );

            const improvedData =
                await improveCareerDataWithAI(
                    careerData
                );

            return res.status(200).json({
                success: true,
                improvedData
            });
        } catch (error) {
            console.error(
                "❌ Career improvement error:",
                error.message || error
            );

            return res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "AI improvement failed."
            });
        }
    }
);


// ======================================================
// MULTER / GENERAL ERROR HANDLER
// ======================================================
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message:
                    "PDF must be smaller than 10 MB."
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            message: error.message ||
                "Something went wrong."
        });
    }

    next();
});


// ======================================================
// START SERVER
// ======================================================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `🚀 PortfolioAI server running on http://localhost:${PORT}`
        );
    });
}

module.exports = app;