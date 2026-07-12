import { readFile } from 'node:fs/promises';
import { evaluateOrderRemedy } from '../order-remedy.mjs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npm run drill:remedy -- <private-case.json>');
  process.exit(1);
}

try {
  const input = JSON.parse(await readFile(inputPath, 'utf8'));
  console.log(JSON.stringify(evaluateOrderRemedy(input), null, 2));
} catch (error) {
  console.error(`Remedy drill failed: ${error.message}`);
  process.exit(1);
}

