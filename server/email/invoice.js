'use strict';

/**
 * Format cents to a USD string (e.g. 5200 → "$52.00")
 */
function formatMoney(cents) {
    if (typeof cents !== 'number' || isNaN(cents)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

/**
 * Build an HTML invoice email for a completed guest order.
 *
 * @param {object} params
 * @param {string} params.orderId
 * @param {string} params.name        Customer full name
 * @param {object} params.cart        { items: [...], total: { subtotal, shipping, tax, grandTotal } }
 * @returns {string} Full HTML string safe for email clients
 */
function buildInvoiceEmail({ orderId, name, cart }) {
    const items = (cart && cart.items) || [];
    const total = (cart && cart.total) || {};

    const lineItemRows = items
        .map(
            (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-family:Georgia,serif;font-size:15px;color:#2c1a0e;">
            ${escapeHtml(item.name || 'Wine')}
            ${item.caption ? `<div style="font-size:12px;color:#7a6652;margin-top:2px;">${escapeHtml(item.caption)}</div>` : ''}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;text-align:center;font-size:14px;color:#5a4032;white-space:nowrap;">×${item.quantity || 1}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;text-align:right;font-family:Georgia,serif;font-size:15px;color:#2c1a0e;white-space:nowrap;">${formatMoney(item.lineTotal)}</td>
        </tr>`,
        )
        .join('');

    const shippingLabel =
        total.shipping === 0 ? 'Shipping <span style="font-size:11px;color:#8a7060;">(complimentary)</span>' : 'Shipping';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>VineSecret Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#1a0f07;padding:36px 40px 28px;">
              <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a96e;">Estate Wines</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#f5efe6;font-weight:normal;letter-spacing:0.5px;">VineSecret</h1>
              <p style="margin:16px 0 0;font-size:13px;color:#9a8070;letter-spacing:0.3px;">California Estate Selections</p>
            </td>
          </tr>

          <!-- Confirmation badge -->
          <tr>
            <td style="background:#2c1a0e;padding:16px 40px;">
              <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9a96e;">Order Confirmed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 0;">

              <p style="margin:0 0 8px;font-size:16px;color:#3a2510;">Dear ${escapeHtml(name || 'Valued Guest')},</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5a4032;">
                Thank you for your order. We have received your selection and our team is preparing your shipment with temperature-controlled care.
              </p>

              <!-- Order ID box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;border-radius:6px;margin-bottom:32px;">
                <tr>
                  <td style="padding:18px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8070;">Order Reference</p>
                    <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#2c1a0e;letter-spacing:1px;">${escapeHtml(orderId || '')}</p>
                  </td>
                </tr>
              </table>

              <!-- Line items -->
              <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:16px;font-weight:normal;color:#2c1a0e;letter-spacing:0.3px;border-bottom:2px solid #e8ddd0;padding-bottom:10px;">Your Selection</h2>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <thead>
                  <tr>
                    <th style="text-align:left;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a8070;padding-bottom:8px;font-weight:normal;">Wine</th>
                    <th style="text-align:center;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a8070;padding-bottom:8px;font-weight:normal;">Qty</th>
                    <th style="text-align:right;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a8070;padding-bottom:8px;font-weight:normal;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a4032;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;font-size:14px;color:#5a4032;">${formatMoney(total.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a4032;">${shippingLabel}</td>
                  <td style="padding:6px 0;text-align:right;font-size:14px;color:#5a4032;">${formatMoney(total.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a4032;">Estimated Tax</td>
                  <td style="padding:6px 0;text-align:right;font-size:14px;color:#5a4032;">${formatMoney(total.tax)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 6px;border-top:2px solid #e8ddd0;font-family:Georgia,serif;font-size:17px;color:#1a0f07;font-weight:bold;">Total</td>
                  <td style="padding:14px 0 6px;border-top:2px solid #e8ddd0;text-align:right;font-family:Georgia,serif;font-size:17px;color:#1a0f07;font-weight:bold;">${formatMoney(total.grandTotal)}</td>
                </tr>
              </table>

              <!-- Shipping note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;border-left:3px solid #c9a96e;margin-bottom:32px;border-radius:0 4px 4px 0;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9a8070;">Shipping</p>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:#3a2510;">Your wines will ship in temperature-controlled packaging within 1–2 business days. You will receive a tracking number by email once your order has been picked up by the carrier.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a0f07;padding:28px 40px;margin-top:16px;">
              <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:14px;color:#c9a96e;">VineSecret Estate</p>
              <p style="margin:0 0 4px;font-size:12px;color:#7a6652;">Questions? Reply to this email or contact office@vinesecret.com</p>
              <p style="margin:16px 0 0;font-size:11px;color:#4a3828;">This email was sent to confirm your guest order. No account was created.</p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Minimal HTML escape to prevent injection in the email body.
 */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

module.exports = { buildInvoiceEmail };
