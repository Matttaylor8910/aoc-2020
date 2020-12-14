import * as fs from 'fs';

/**
 * Assuming the second argument when calling this from the commandline is the
 * filename like: /path/dayXX.js, return the lines of the file as a sting[]
 */
export function readFile(filename?: string): string[] {
  if (!filename) {
    filename = process.argv[1].replace('.js', '.txt');
  }
  return fs.readFileSync(filename, 'utf8').split('\n');
}