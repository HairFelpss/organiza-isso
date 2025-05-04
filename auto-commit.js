#!/usr/bin/env node

const { execSync } = require('child_process');

// Tipos padrão do Conventional Commits
const DEFAULT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert'
];

class AutoCommit {
  constructor() {
    this.allowedTypes = DEFAULT_TYPES;
  }

  getChangedFiles() {
    try {
      return execSync('git diff --cached --name-only')
        .toString()
        .trim()
        .split('\n')
        .filter(Boolean);
    } catch (error) {
      console.error('Error getting changed files:', error.message);
      return [];
    }
  }

  determineCommitType(files) {
    // Simplified logic to determine commit type
    if (!files.length) return 'chore';
    
    const fileTypes = {
      'package.json': 'chore',
      'yarn.lock': 'chore',
      'pnpm-lock.yaml': 'chore',
      '.github/': 'ci',
      'docs/': 'docs',
      'README': 'docs',
      'test': 'test',
      '__tests__': 'test',
      '.env': 'chore',
      'src/': 'feat'
    };

    for (const [pattern, type] of Object.entries(fileTypes)) {
      if (files.some(file => file.includes(pattern))) {
        return type;
      }
    }

    return 'feat';
  }

  generateCommitMessage(type, files) {
    const messageTemplates = {
      feat: 'adds new feature',
      fix: 'fixes issue',
      docs: 'updates documentation',
      style: 'improves code style',
      refactor: 'refactors code',
      perf: 'improves performance',
      test: 'updates tests',
      build: 'updates build system',
      ci: 'updates CI configuration',
      chore: 'updates dependencies',
      revert: 'reverts changes'
    };

    const template = messageTemplates[type] || 'updates code';
    const filesStr = files.join(', ');
    const timestamp = new Date().toISOString();
    return `${type}: ${template} [${filesStr}] at ${timestamp}`;
  }

  async execute() {
    try {
      // Add all changes
      execSync('git add .');

      const files = this.getChangedFiles();
      
      if (!files.length) {
        console.log('No changes to commit');
        process.exit(0);
      }

      const type = this.determineCommitType(files);

      if (!this.allowedTypes.includes(type)) {
        throw new Error(`Commit type '${type}' not allowed`);
      }

      const message = this.generateCommitMessage(type, files);
      
      console.log('Committing with message:', message);
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      
      console.log('✅ Commit successful!');

    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
}

new AutoCommit().execute();