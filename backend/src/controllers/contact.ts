import { Request, Response } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function contact(req: Request, res: Response) {
    try {
        let { first_name, last_name, email, message } = req.body;

        const data = await resend.emails.send({
            from: "contact@thevelox.co",
            to: "contact@thevelox.co",
            subject: "New message from the website",
            text: message,
            html: `
                <h1>New message from the website</h1>
                <p><span class="font-bold">First Name:</span> ${first_name}</p>
                <p><span class="font-bold">Last Name:</span> ${last_name}</p>
                <p><span class="font-bold">Email:</span> ${email}</p>
                <p><span class="font-bold">Message:</span> ${message}</p>
            `,
        });

        return res.json(data);
    } catch (error) {
        return res.json()
    }
}
