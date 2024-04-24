require('dotenv').config();
const Mailjet = require('node-mailjet');

class MailjetService {
    constructor() {
        this.mailjet = new Mailjet({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE
        });
    }

    async enviarConfirmacion(destinatarioEmail, destinatarioNombre, token) {
        try {
            const request = this.mailjet.post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: { Email: 'borjitabond8@gmail.com', Name: 'RiftResults' },
                            To: [{ Email: destinatarioEmail, Name: destinatarioNombre }],
                            Subject: '¡Activa tu cuenta de RiftResults!',
                            TextPart: `¡Bienvenido a RiftResults! Haz clic en el enlace para activar tu cuenta: ${token}`,
                            HTMLPart: `<h3>¡Bienvenido a <a href="http://localhost:4200">RiftResults</a>!</h3><br />Haz clic en el <a href="http://localhost:4200/Cliente/ActivarCuenta/${token}"> enlace para activar tu cuenta </a>`
                        }
                    ]
                });

            const response = await request;
            console.log('Correo de activación enviado:', response.body);
        } catch (error) {
            console.error('Error al enviar el correo de activación:', error.message);
        }
    }
}

module.exports = MailjetService;
