import emailjs from '@emailjs/browser';

/**
 * Sends an email notification with stock alerts.
 * 
 * @param alerts The alerts object containing lowStock and expiringSoon arrays
 * @param username The username of the user who logged in
 */
export const sendAlertEmail = async (alerts: any, username: string) => {
    console.log('Attempting to send alert email for user:', username);
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        console.log('Environment variables present:', {
            serviceId: !!serviceId,
            templateId: !!templateId,
            publicKey: !!publicKey
        });

        if (!serviceId || !templateId || !publicKey) {
            console.warn('EmailJS credentials missing. Email not sent.');
            return;
        }

        // Format the message
        let message = `Bonjour ${username},\n\nVoici le rapport d'alertes de stock suite à votre connexion :\n\n`;

        const lowStock = alerts?.lowStock || [];
        const expiringSoon = alerts?.expiringSoon || [];

        console.log(`Alerts data received - Low Stock: ${lowStock.length}, Expiring Soon: ${expiringSoon.length}`);

        if (lowStock.length === 0 && expiringSoon.length === 0) {
            message += "Aucune alerte à signaler.\n";
            console.log('No alerts to report, but sending email anyway with "No alerts" message.');
        } else {
            if (lowStock.length > 0) {
                message += `⚠️ RUPTURE DE STOCK (${lowStock.length} produits) :\n`;
                lowStock.forEach((item: any) => {
                    message += `- ${item.product.name} (Lot: ${item.batchNumber}) : ${item.quantity} unités (Seuil: ${item.product.minThreshold})\n`;
                });
                message += "\n";
            }

            if (expiringSoon.length > 0) {
                message += `⏰ EXPIRATION PROCHE (${expiringSoon.length} lots) :\n`;
                expiringSoon.forEach((item: any) => {
                    const daysLeft = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    message += `- ${item.product.name} (Lot: ${item.batchNumber}) : Expire le ${new Date(item.expirationDate).toLocaleDateString()} (J-${daysLeft})\n`;
                });
            }
        }

        message += "\nCordialement,\nVotre système StockCare";

        const templateParams = {
            to_name: username,
            message: message,
            // Assuming the template has a 'message' variable. 
            // We can also pass raw data if the template is designed to handle it, but simple text is safer for now.
        };

        console.log('Sending email via EmailJS...');
        const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log('Alert email sent successfully. Status:', response.status, 'Text:', response.text);

    } catch (error: any) {
        console.error('Failed to send alert email. Raw error:', error);
        if (error?.text) console.error('Error text:', error.text);
    }
};
