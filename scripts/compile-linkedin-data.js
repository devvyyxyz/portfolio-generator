#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the data file
const dataDir = path.join(__dirname, '../data');
let userData;

try {
  userData = JSON.parse(fs.readFileSync(path.join(dataDir, 'linkedin-user.json'), 'utf8'));
} catch (e) {
  console.warn('LinkedIn user data not found, creating placeholder');
  userData = {
    username: 'devvyyxyz',
    profile_url: 'https://www.linkedin.com/in/devvyyxyz',
    connections: 0,
    posts: 0,
    followers: 0
  };
}

// Combine into summary
const summary = {
  success: true,
  data: {
    user: {
      username: userData.username || 'devvyyxyz',
      profile_url: userData.profile_url || 'https://www.linkedin.com/in/devvyyxyz',
      name: userData.name || ''
    },
    stats: {
      connections: userData.connections || 0,
      followers: userData.followers || 0,
      posts: userData.posts || 0
    },
    note: 'LinkedIn API access is limited. This data may require manual updates.',
    fetched_at: new Date().toISOString()
  }
};

fs.writeFileSync(path.join(dataDir, 'linkedin-data.json'), JSON.stringify(summary, null, 2));
console.log('✓ LinkedIn data compiled successfully');
