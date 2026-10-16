import { execSync } from 'child_process';
import fs from 'fs';

console.log('=== Running Verification Script ===');

try {
  console.log('1. Checking TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log(' TypeScript compilation passed!');

  console.log('2. Running Vitest unit tests...');
  const testOutput = execSync('npx vitest run', { encoding: 'utf8' });
  console.log(testOutput);
  console.log(' Vitest tests passed!');

  if (!fs.existsSync('evidence')) {
    fs.mkdirSync('evidence');
  }

  fs.writeFileSync('evidence/FEAT-001-setup.txt', `TypeScript Strict Mode: PASS\nVitest Suite: PASS\nOutput:\n${testOutput}`);
  console.log('=== All Initial Verification Passed! ===');
} catch (err) {
  console.error('Verification failed:', err);
  process.exit(1);
}
