// scripts/test-webhook.js
const fetch = require('node-fetch');
const crypto = require('crypto');
const { GITHUB_WEBHOOK_SECRET } = require('../lib/constants');
const { testGroupConfig } = require('../services/telegram');

/**
 * Simulates a GitHub push webhook with configurable commits.
 * Usage: node scripts/test-webhook.js [commitCount]
 */
async function testWebhook(commitCount = 2) {
  const commits = Array.from({ length: commitCount }, (_, i) => ({
    message: `Test commit ${i + 1}`,
    added: i === 0 ? ['src/components/Test.js'] : i === 1 ? ['src/styles/test.css'] : [],
    modified: i === 1 ? ['src/pages/test.js'] : [],
    removed: i === 0 ? ['src/oldtest.js'] : [],
  }));

  const payload = {
    ref: 'refs/heads/main',
    pusher: { name: 'TestUser' },
    repository: { name: 'devconnection-frontend', full_name: 'your-team/devconnection-frontend' },
    commits,
  };

  const body = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
  const signature = `sha256=${hmac.update(body).digest('hex')}`;

  try {
    const response = await fetch('http://localhost:3000/api/webhook/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': signature,
        'X-GitHub-Event': 'push',
      },
      body,
    });
    console.log('Webhook test response:', response.status, await response.text());
  } catch (error) {
    console.error('Webhook test failed:', error);
  }
}

/**
 * Tests group notification setup.
 */
async function testGroup() {
  try {
    const result = await testGroupConfig();
    console.log('Group test result:', result);
  } catch (error) {
    console.error('Group test failed:', error);
  }
}

/**
 * Tests notification for Dara Sambath.
 */
async function testDara() {
  try {
    const result = await require('../services/telegram').sendMessage(
      '🔔 *Test Message for Dara*: @SambathTB, please confirm you see this! (Privacy mode should be disabled.)'
    );
    console.log('Dara test result:', result);
  } catch (error) {
    console.error('Dara test failed:', error);
  }
}

// Run based on command-line arg
const arg = process.argv[2];
if (arg === 'group') {
  testGroup();
} else if (arg === 'dara') {
  testDara();
} else {
  const commitCount = parseInt(arg, 10) || 2;
  testWebhook(commitCount);
}