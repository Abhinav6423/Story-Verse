import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",      // 🔥 hard-code (no env confusion)
            port: 587,
            secure: false,               // true only for 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000,    // ⏱️ prevent hanging
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        await transporter.sendMail({
            from: `"StoryFlix" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent to:", to);
    } catch (error) {
        console.error("❌ Email failed:", error.message);
        // ⚠️ IMPORTANT: do NOT throw
    }
};

export default sendEmail;
