import fs from 'fs';
import path from 'path';

const workflowPath = path.resolve(process.cwd(), '.github/workflows/auto-sync.yml');
if (!fs.existsSync(workflowPath)) {
  console.error('Workflow file not found at:', workflowPath);
  process.exit(1);
}

const content = fs.readFileSync(workflowPath, 'utf8');

const checks = {
  hasCronSchedule: content.includes("cron: '0 0 * * *'"),
  hasWorkflowDispatch: content.includes('workflow_dispatch:'),
  hasSyncCommand: content.includes('npm run sync:wiki'),
  hasTestCommand: content.includes('npm test -- --run'),
  hasBuildCommand: content.includes('npm run build'),
  hasAutoCommit: content.includes('git commit') && content.includes('public/icons/accessories/'),
  workflowPath: '.github/workflows/auto-sync.yml',
  timestamp: Date.now()
};

const allPassed = Object.values(checks).every(v => v === true || typeof v !== 'boolean');

if (!allPassed) {
  console.error('Some workflow validation checks failed:', checks);
  process.exit(1);
}

const evidencePath = path.resolve(process.cwd(), 'tmp/evidence_feat_028_github_workflow.json');
if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
fs.writeFileSync(evidencePath, JSON.stringify(checks, null, 2));

console.log('✅ FEAT-028 verified. Evidence written to:', evidencePath);
