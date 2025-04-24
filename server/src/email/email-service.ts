import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER?.trim(),
          pass: process.env.EMAIL_PASS?.trim(),
        },
      });

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
  const mailOptions = {
    from: `"Energy Optimizer" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
