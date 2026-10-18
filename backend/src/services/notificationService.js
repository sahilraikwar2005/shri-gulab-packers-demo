const nodemailer = require('nodemailer');

async function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

async function notifyNewInquiry(inquiry) {
  const db = require('../storage/jsonDb');
  const settingsDoc = await db.findOne('siteSettings', { key: 'global' });
  const settings = settingsDoc;
  const recipients = settings?.notifications?.emailEnabled ? (settings.notifications.emailRecipients || []) : [];
  if (!recipients.length) return;
  const transport = await getTransport();
  if (!transport) return;
  await transport.sendMail({
    from: process.env.MAIL_FROM || 'MoveEasy <no-reply@moveeasy.com>',
    to: recipients.join(','),
    subject: `New Inquiry ${inquiry.referenceId}`,
    text: `New inquiry from ${inquiry.customer?.name} (${inquiry.customer?.mobile})\n${inquiry.movingType} ${inquiry.shipmentType}\n${inquiry.pickup?.city} -> ${inquiry.destination?.city}`,
  });
}

async function sendQuotationEmail(to, quotation) {
  const transport = await getTransport();
  if (!transport || !to) return false;
  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Your MoveEasy quotation`,
    text: `Estimated amount: ${quotation.estimateAmount} ${quotation.currency || 'INR'}\n${quotation.notes || ''}`,
  });
  return true;
}

module.exports = { notifyNewInquiry, sendQuotationEmail, getTransport };