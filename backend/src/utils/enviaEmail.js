import nodemailer from 'nodemailer';

export async function enviarCodigoVerificacao(destinatarioEmail, codigo) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'heitorpinto.oficial@gmail.com',
            pass: process.env.EMAIL_PASS || 'bnlvruvxhserutrt'
        },
    });

    const corpoEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px; max-width: 600px; margin: auto;">
            <h2 style="color: #4CAF50;">Seu Código de Verificação</h2>
            <p>Olá,</p>
            <p>Use o código abaixo:</p>
            <div style="background-color: #f2f2f2; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; color: #333; letter-spacing: 5px;">${codigo}</span>
            </div>
            <p>Este código é válido por 15 minutos. Não o compartilhe com ninguém.</p>
            <p>Atenciosamente,<br>Equipe Central ti</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
        </div>
    `;

    const mailOptions = {
        from: `"Central TI" <${process.env.EMAIL_USER}>`,
        to: destinatarioEmail,
        subject: 'Código de Verificação',
        html: corpoEmailHtml
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail enviado com sucesso! ID: ${info.messageId} || Email: ${destinatarioEmail}`);
        return true;
    } catch (error) {
        console.error(`❌ Erro ao enviar o e-mail: ${error.message}`);
        return false;
    };

}