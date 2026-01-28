#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all the data files
const dataDir = path.join(__dirname, '../data');
const user = JSON.parse(fs.readFileSync(path.join(dataDir, 'stackoverflow-user.json'), 'utf8'));
const answers = JSON.parse(fs.readFileSync(path.join(dataDir, 'stackoverflow-answers.json'), 'utf8'));
const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'stackoverflow-questions.json'), 'utf8'));

// Extract user data
const userData = user.items && user.items[0] ? user.items[0] : {};

// Get top answers
const topAnswers = (answers.items || [])
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
  .map(a => ({
    score: a.score,
    title: a.title,
    link: a.link,
    question_id: a.question_id
  }));

// Get recent questions
const recentQuestions = (questions.items || [])
  .slice(0, 3)
  .map(q => ({
    score: q.score,
    title: q.title,
    link: q.link,
    answer_count: q.answer_count,
    creation_date: q.creation_date
  }));

// Calculate total badge count
const totalBadges = (userData.badge_counts || {});
const badgeTotal = (totalBadges.gold || 0) * 3 + (totalBadges.silver || 0) * 2 + (totalBadges.bronze || 0);

// Combine into summary
const summary = {
  success: true,
  data: {
    user: {
      display_name: userData.display_name || 'devvyyxyz',
      user_id: userData.user_id || 15807152,
      reputation: userData.reputation || 0,
      link: userData.link || 'https://stackoverflow.com/users/15807152/devvyyxyz',
      profile_image: userData.profile_image || '',
      location: userData.location || 'Unknown',
      about_me: userData.about_me || ''
    },
    stats: {
      reputation: userData.reputation || 0,
      badge_counts: userData.badge_counts || { gold: 0, silver: 0, bronze: 0 },
      badge_total: badgeTotal,
      answer_count: userData.answer_count || 0,
      question_count: userData.question_count || 0,
      total_answers_available: answers.total || 0,
      total_questions_available: questions.total || 0
    },
    top_answers: topAnswers,
    recent_questions: recentQuestions,
    fetched_at: new Date().toISOString()
  }
};

fs.writeFileSync(path.join(dataDir, 'stackoverflow-data.json'), JSON.stringify(summary, null, 2));
console.log('✓ Stack Overflow data compiled successfully');
