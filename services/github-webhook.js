// // services/github-webhook.js
// import crypto from 'crypto';
// import { GITHUB_WEBHOOK_SECRET } from '../lib/constants';

// /**
//  * Verifies GitHub webhook signature for security.
//  * @param {Object} payload - The webhook payload.
//  * @param {string} signature - The X-Hub-Signature-256 header.
//  * @returns {boolean} - True if valid, false otherwise.
//  */
// export function verifyWebhook(payload, signature) {
//   try {
//     const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
//     const calculated = `sha256=${hmac.update(JSON.stringify(payload)).digest('hex')}`;
//     return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(signature));
//   } catch (error) {
//     console.error('Webhook verification error:', error);
//     return false;
//   }
// }

// /**
//  * Parses a GitHub push event into a Telegram-friendly message.
//  * @param {Object} payload - The webhook payload.
//  * @returns {string} - Formatted message.
//  */
// export function handlePushEvent(payload) {
//   try {
//     const { pusher, ref, repository, commits } = payload;
//     if (!pusher || !ref || !repository) {
//       throw new Error('Invalid push payload');
//     }
//     const branch = ref.replace('refs/heads/', '');
//     const commitCount = commits ? commits.length : 1;
//     const repoName = repository.name;
//     const commitMessage = commits && commits[0] ? commits[0].message.split('\n')[0] : 'No message';
//     return `@${pusher.name} pushed *${commitCount} commit(s)* to *${repoName}/${branch}*\n> ${commitMessage}`;
//   } catch (error) {
//     console.error('Error parsing push event:', error);
//     return 'Error processing GitHub push event';
//   }
// }

// services/github-webhook.js
import crypto from 'crypto';
import { GITHUB_WEBHOOK_SECRET } from '../lib/constants';

/**
 * Verifies GitHub webhook signature for security.
 * @param {Object} payload - The webhook payload.
 * @param {string} signature - The X-Hub-Signature-256 header.
 * @returns {boolean} - True if valid, false otherwise.
 */
export function verifyWebhook(payload, signature) {
  try {
    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    const calculated = `sha256=${hmac.update(JSON.stringify(payload)).digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(signature));
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

/**
 * Parses a GitHub push event into a beautiful, icon-rich Telegram message.
 * @param {Object} payload - The webhook payload.
 * @returns {string} - Formatted message.
 */
export function handlePushEvent(payload) {
  try {
    // Default values for edge cases
    const pusher = payload.pusher || { name: 'Unknown' };
    const ref = payload.ref || 'refs/heads/unknown';
    const repository = payload.repository || { name: 'unknown-repo' };
    const commits = Array.isArray(payload.commits) ? payload.commits : [];

    const branch = ref.replace('refs/heads/', '') || 'unknown';
    const commitCount = commits.length || 1;
    const repoName = repository.name || 'unknown-repo';
    const commitMessage = commits[0] && commits[0].message ? commits[0].message.split('\n')[0] : 'No message provided';

    // Beautiful message with icons and Markdown
    return (
      `🚀 *New Push Alert* 🚀\n` +
      `👤 *Pusher*: @${pusher.name}\n` +
      `📦 *Repo*: ${repoName}\n` +
      `🌿 *Branch*: ${branch}\n` +
      `🔢 *Commits*: ${commitCount}\n` +
      `📝 *Message*: ${commitMessage}`
    );
  } catch (error) {
    console.error('Error parsing push event:', error);
    return '⚠️ Failed to process GitHub push event';
  }
}