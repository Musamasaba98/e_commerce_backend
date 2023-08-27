import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'

export const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // async..await is not allowed in global scope, must use a wrapper
    (async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Hey boo 👻" <abc@gmail.com>', // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.html, // html body
        });

        console.log("Message sent: %s", info.messageId);
    })()
}
)