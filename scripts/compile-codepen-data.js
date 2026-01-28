#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the data file
const dataDir = path.join(__dirname, '../data');
const userData = JSON.parse(fs.readFileSync(path.join(dataDir, 'codepen-user.json'), 'utf8'));

// Extract user info
const user = userData.data || {};

// Get top pens by views or loves
const topPens = (userData.data?.pens || [])
  .sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 6)
  .map(pen => ({
    title: pen.title,
    url: pen.link,
    views: pen.views || 0,
    loves: pen.loves || 0,
    comments: pen.comments || 0,
    id: pen.id
  }));

// Combine into summary
const summary = {
  success: true,
  data: {
    user: {
      username: user.username || 'devvyyxyz',
      name: user.name || '',
      avatar: user.avatar || '',
      profile_url: `https://codepen.io/${user.username || 'devvyyxyz'}`,
      bio: user.bio || '',
      location: user.location || ''
    },
    stats: {
      followers: user.followers || 0,
      following: user.following || 0,
      total_pens: userData.data?.pens?.length || 0,
      total_views: topPens.reduce((sum, pen) => sum + pen.views, 0),
      total_loves: topPens.reduce((sum, pen) => sum + pen.loves, 0)
    },
    top_pens: topPens,
    fetched_at: new Date().toISOString()
  }
};

fs.writeFileSync(path.join(dataDir, 'codepen-data.json'), JSON.stringify(summary, null, 2));
console.log('✓ CodePen data compiled successfully');
