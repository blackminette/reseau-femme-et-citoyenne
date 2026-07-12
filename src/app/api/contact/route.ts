import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, email, subject, message } = body;   

        // Validation basique des champs reçus
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Tous les champs sont requis." },
                { status: 400 }
            );
        }

        // 2. Configuration du transporteur d'e-mail (Nodemailer)
        {/* const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            secure: process.env.EMAIL_SERVER_PORT === '465', // true pour 465, false pour les autres ports
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            }, */}


        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com', 
            port: 465,
            secure: true, // True pour le port 465, false pour les autres (587)
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
    
        });
    


    // 3. Contenu de l'e-mail que VOUS allez recevoir
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_SERVER_USER}>`, 
        replyTo: email, 
        to: process.env.CONTACT_RECEIVER_EMAIL, 
        subject: `[Réseau Femme et Citoyenne] Contact: ${subject}`,
        text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`,
        html: `
            <h3>Nouveau message depuis le site web</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject}</p>
            <br/>
            <p><strong>Message :</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
        `,
    };

    // 4. Envoi de l'e-mail
    await transporter.sendMail(mailOptions);    


    // 5. Réponse de succès renvoyée à ton composant React
    return NextResponse.json(
        { message: "Message envoyé avec succès !" },
        { status: 200 }
    );

    } catch (error: any) {
        console.error("Erreur backend lors de l'envoi de l'email:", error);
        return NextResponse.json(
            { error: "Une erreur interne est survenue lors de l'envoi." },
            { status: 500 }
        );
    }
}