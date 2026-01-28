#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all the data files
const dataDir = path.join(__dirname, '../data');
const user = JSON.parse(fs.readFileSync(path.join(dataDir, 'github-user.json'), 'utf8'));
const repos = JSON.parse(fs.readFileSync(path.join(dataDir, 'github-repos.json'), 'utf8'));
const events = JSON.parse(fs.readFileSync(path.join(dataDir, 'github-events.json'), 'utf8'));

// Read issues and PRs count
let issuesCount = 0;
let prsCount = 0;

try {
  const issuesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'github-issues.json'), 'utf8'));
  issuesCount = issuesData.total_count || 0;
} catch (e) {
  console.warn('Issues data not found, using 0');
}

try {
  const prsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'github-prs.json'), 'utf8'));
  prsCount = prsData.total_count || 0;
} catch (e) {
  console.warn('PRs data not found, using 0');
}

// Count event types
const eventTypes = {};
events.forEach(event => {
  eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
});

// Get top repos by stars
const topRepos = repos
  .sort((a, b) => b.stargazers_count - a.stargazers_count)
  .slice(0, 5)
  .map(r => ({
    name: r.name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    updated_at: r.updated_at
  }));

// Get languages used
const languages = {};
repos.forEach(repo => {
  if (repo.language) {
    languages[repo.language] = (languages[repo.language] || 0) + 1;
  }
});

// Combine into summary
const summary = {
  success: true,
  data: {
    user: {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      location: user.location,
      blog: user.blog,
      twitter: user.twitter_username,
      company: user.company,
      html_url: user.html_url,
      followers: user.followers,
      following: user.following
    },
    stats: {
      public_repos: user.public_repos,
      public_gists: user.public_gists,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
      issues_created: issuesCount,
      pull_requests: prsCount
    },
    recent_activity: {
      total_events: events.length,
      event_types: eventTypes
    },
    repositories: {
      total: user.public_repos,
      top_repos: topRepos
    },
    languages: languages,
    fetched_at: new Date().toISOString()
  }
};

fs.writeFileSync(path.join(dataDir, 'github-data.json'), JSON.stringify(summary, null, 2));
console.log('✓ GitHub data compiled successfully');
