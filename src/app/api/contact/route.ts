import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        // 1. Récupérer les données envoyées par ton formulaire React
        const { name, email, subject, message } = await request.json();   

        // Validation basique des champs reçus
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Tous les champs sont requis." },
                { status: 400 }
            );
        }

        // 2. Configuration du transporteur d'e-mail (Nodemailer)
        // Remplis ces informations avec les variables d'environnement (voir Étape 3)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
            secure: process.env.EMAIL_SERVER_PORT === '465', // true pour 465, false pour les autres ports
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
    });

    // 3. Contenu de l'e-mail que VOUS allez recevoir
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_SERVER_USER}>`, // L'expéditeur technique doit souvent être votre propre adresse pour éviter le spam
        replyTo: email, // Permet de répondre directement à l'utilisateur en cliquant sur "Répondre"
        to: process.env.CONTACT_RECEIVER_EMAIL, // L'adresse de l'association ou de l'entreprise qui reçoit les messages
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