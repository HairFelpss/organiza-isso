module.exports = {
  // Mapping of directories/files to commit types
  typeMapping: {
    'src/': 'feat',
    'test/': 'test',
    'docs/': 'docs',
    'package.json': 'chore',
    '.github/': 'ci',
    // Add more mappings as needed
  },
  
  // Default messages per type
  messageTemplates: {
    feat: 'adds new feature',
    fix: 'fixes bug',
    docs: 'updates documentation',
    style: 'adjusts style',
    refactor: 'refactors code',
    test: 'adds/updates tests',
    chore: 'updates dependencies/configurations',
  }
};