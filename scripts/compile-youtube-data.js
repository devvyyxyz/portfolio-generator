#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the data file
const dataDir = path.join(__dirname, '../data');
let channelData;

try {
  channelData = JSON.parse(fs.readFileSync(path.join(dataDir, 'youtube-channel.json'), 'utf8'));
} catch (e) {
  console.warn('YouTube channel data not found');
  const fallback = {
    success: false,
    error: 'YouTube API key required or channel not found',
    data: null
  };
  fs.writeFileSync(path.join(dataDir, 'youtube-data.json'), JSON.stringify(fallback, null, 2));
  process.exit(0);
}

// Extract channel info
const channel = channelData.items && channelData.items[0] ? channelData.items[0] : null;

if (!channel) {
  const fallback = {
    success: false,
    error: 'No YouTube channel found',
    data: null
  };
  fs.writeFileSync(path.join(dataDir, 'youtube-data.json'), JSON.stringify(fallback, null, 2));
  console.log('✓ YouTube data compiled (no channel found)');
  process.exit(0);
}

const snippet = channel.snippet || {};
const statistics = channel.statistics || {};

// Combine into summary
const summary = {
  success: true,
  data: {
    channel: {
      id: channel.id,
      title: snippet.title || '',
      description: snippet.description || '',
      custom_url: snippet.customUrl || '',
      thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
      profile_url: `https://www.youtube.com/channel/${channel.id}`,
      published_at: snippet.publishedAt || ''
    },
    stats: {
      subscribers: parseInt(statistics.subscriberCount || 0),
      total_views: parseInt(statistics.viewCount || 0),
      total_videos: parseInt(statistics.videoCount || 0)
    },
    fetched_at: new Date().toISOString()
  }
};

fs.writeFileSync(path.join(dataDir, 'youtube-data.json'), JSON.stringify(summary, null, 2));
console.log('✓ YouTube data compiled successfully');
