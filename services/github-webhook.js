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
 * Parses a GitHub push event into a clear, detailed, icon-rich Telegram message with timestamp.
 * @param {Object} payload - The webhook payload.
 * @returns {string} - Formatted message.
 */
export function handlePushEvent(payload) {
  try {
    // Default values for edge cases
    const pusher = payload.pusher || { name: 'Unknown' };
    const ref = payload.ref || 'refs/heads/unknown';
    const repository = payload.repository || { name: 'unknown-repo', full_name: 'unknown/unknown-repo' };
    const commits = Array.isArray(payload.commits) ? payload.commits : [];

    // Extract details
    const branch = ref.replace('refs/heads/', '') || 'unknown';
    const commitCount = commits.length || 0;
    const repoFullName = repository.full_name || repository.name || 'unknown/unknown-repo';
    const commitMessage = commits[0] && commits[0].message ? commits[0].message.split('\n')[0] : 'No commit message provided';

    // Generate timestamp (e.g., 2025-04-13 15:30:45 UTC)
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    // Detailed, icon-rich message
    return (
      `🚀 *DevConnect Team Push Update* 🚀\n` +
      `──────────────────\n` +
      `👤 *Pusher*: @${pusher.name}\n` +
      `📦 *Repository*: ${repoFullName}\n` +
      `🌿 *Branch*: ${branch}\n` +
      `🔢 *Commits*: ${commitCount}${commitCount === 0 ? ' (No commits found)' : ''}\n` +
      `📝 *Top Commit*: ${commitMessage}\n` +
      `🕒 *Pushed At*: ${timestamp}\n` +
      `──────────────────`
    );
  } catch (error) {
    console.error('Error parsing push event:', error);
    // Include timestamp in error message
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    return `⚠️ *Push processing failed* ⚠️\n🕒 *At*: ${timestamp}`;
  }
}