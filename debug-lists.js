const fs = require('fs');

// Read the TypeScript file and extract the convertLists function
const tsContent = fs.readFileSync('./src/lib/html-to-text.ts', 'utf8');

// Simple eval approach - extract just the convertLists function
const html = `
  <ul>
    <li>Item 1</li>
    <li>Item 2
      <ul>
        <li>Sub item 1</li>
        <li>Sub item 2</li>
      </ul>
    </li>
    <li>Item 3</li>
  </ul>
`;

console.log('Input HTML:');
console.log(html);

// Let's manually trace through what should happen
console.log('\nExpected output should contain:');
console.log('• Item 1');
console.log('• Item 2');
console.log('  • Sub item 1');
console.log('  • Sub item 2');
console.log('• Item 3');