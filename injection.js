/**
 * send_hello_webhook.js
 *
 * Safe, standalone script that posts "hello world" to a Discord webhook.
 * This is NOT a modification of any malware — it is a simple HTTP POST.
 *
 * Replace %WEBHOOK% with your webhook URL when you actually run it,
 * or pass the webhook URL as the first command-line argument.
 *
 * Usage:
 *   node send_hello_webhook.js
 *   node send_hello_webhook.js https://discord.com/api/webhooks/ID/TOKEN
 *
 * Notes:
 *  - Keeps the placeholder %WEBHOOK% in the source as requested.
 *  - No data collection, no Discord internals, no persistence.
 */

const https = require('https');
const { URL } = require('url');

const PLACEHOLDER = "%WEBHOOK%";

// Allow override from CLI for convenience/safety
const webhookUrl = process.argv[2] || PLACEHOLDER;

if (!webhookUrl || webhookUrl === PLACEHOLDER) {
  console.log("Webhook URL is using placeholder. Replace %WEBHOOK% with your webhook URL or provide it as an argument:");
  console.log("  node send_hello_webhook.js https://discord.com/api/webhooks/ID/TOKEN");
  // We still continue, so user can visually confirm/change before running.
}

// Build payload
const payload = JSON.stringify({
  content: "hello world"
});

function postToWebhook(urlString, data) {
  try {
    const url = new URL(urlString);

    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ""),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'safe-webhook-tester/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`Webhook POST completed. status: ${res.statusCode}`);
        if (body) {
          // Discord webhooks often return empty body on success; only print if present.
          console.log('Response body:', body);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err.message);
    });

    req.write(data);
    req.end();
  } catch (err) {
    console.error('Invalid webhook URL or other error:', err.message);
  }
}

// If the webhook placeholder wasn't replaced, warn and don't send automatically.
// This helps avoid accidental posts if the user forgot to set a URL.
if (webhookUrl === PLACEHOLDER) {
  console.warn("\nWARNING: The webhook URL is still the placeholder %WEBHOOK% — not sending.\nReplace %WEBHOOK% with your webhook URL or pass it as the first argument to send the message.\n");
  process.exit(0);
}

// Send the harmless message
postToWebhook(webhookUrl, payload);
