const fs = require('fs');
const path = require('path');

const replacements = [
  // 1. Primary Sage Green / Purple theme colors (#8B5CF6) -> primary
  { regex: /bg-\[#8B5CF6\]\/10/g, replacement: 'bg-primary/10' },
  { regex: /bg-\[#8B5CF6\]\/20/g, replacement: 'bg-primary/20' },
  { regex: /border-\[#8B5CF6\]\/20/g, replacement: 'border-primary/20' },
  { regex: /focus-visible:ring-\[#8B5CF6\]/g, replacement: 'focus-visible:ring-primary' },
  { regex: /focus:ring-\[#8B5CF6\]\/20/g, replacement: 'focus:ring-primary/20' },
  { regex: /focus:border-\[#8B5CF6\]/g, replacement: 'focus:border-primary' },
  { regex: /bg-\[#8B5CF6\]/g, replacement: 'bg-primary' },
  { regex: /text-\[#8B5CF6\]/g, replacement: 'text-primary' },
  { regex: /border-\[#8B5CF6\]/g, replacement: 'border-primary' },
  { regex: /hover:bg-\[#8B5CF6\]\/90/g, replacement: 'hover:bg-primary/90' },
  { regex: /hover:bg-\[#8B5CF6\]/g, replacement: 'hover:bg-primary/90' },
  { regex: /hover:text-\[#8B5CF6\]/g, replacement: 'hover:text-primary' },
  { regex: /hover:border-\[#8B5CF6\]/g, replacement: 'hover:border-primary' },

  // 2. Buttons styling: bg-[#FAFAFA] text-[#09090B] -> primary buttons
  { regex: /bg-\[#FAFAFA\]\/90/g, replacement: 'bg-primary/90' },
  { regex: /bg-\[#FAFAFA\]/g, replacement: 'bg-primary' },
  { regex: /text-\[#09090B\]/g, replacement: 'text-primary-foreground' },
  { regex: /hover:bg-\[#FAFAFA\]\/90/g, replacement: 'hover:bg-primary/90' },
  { regex: /hover:bg-\[#FAFAFA\]/g, replacement: 'hover:bg-primary/90' },

  // 3. Backgrounds and Panels
  { regex: /bg-\[#09090B\]\/50/g, replacement: 'bg-background/50' },
  { regex: /bg-\[#09090B\]/g, replacement: 'bg-background' },
  
  { regex: /bg-\[#111111\]\/30/g, replacement: 'bg-card/30' },
  { regex: /bg-\[#111111\]\/40/g, replacement: 'bg-card/40' },
  { regex: /bg-\[#111111\]\/50/g, replacement: 'bg-card/50' },
  { regex: /bg-\[#111111\]\/80/g, replacement: 'bg-card/80' },
  { regex: /bg-\[#111111\]\/90/g, replacement: 'bg-card/90' },
  { regex: /bg-\[#111111\]/g, replacement: 'bg-card' },

  { regex: /bg-\[#18181B\]\/30/g, replacement: 'bg-secondary/30' },
  { regex: /bg-\[#18181B\]\/40/g, replacement: 'bg-secondary/40' },
  { regex: /bg-\[#18181B\]\/50/g, replacement: 'bg-secondary/50' },
  { regex: /bg-\[#18181B\]/g, replacement: 'bg-secondary' },

  // 4. Borders
  { regex: /border-\[#27272A\]\/50/g, replacement: 'border-border/50' },
  { regex: /border-\[#27272A\]/g, replacement: 'border-border' },
  { regex: /bg-\[#27272A\]/g, replacement: 'bg-muted' },
  { regex: /data-\[state=active\]:bg-\[#27272A\]/g, replacement: 'data-[state=active]:bg-secondary' },
  { regex: /hover:border-\[#3F3F46\]/g, replacement: 'hover:border-border-hover' },

  // 5. Interactive states
  { regex: /hover:bg-\[#18181B\]\/30/g, replacement: 'hover:bg-secondary/30' },
  { regex: /hover:bg-\[#18181B\]/g, replacement: 'hover:bg-secondary' },

  // 6. Text and Muted text
  { regex: /text-\[#FAFAFA\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#A1A1AA\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#71717A\]/g, replacement: 'text-muted-foreground' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Perform general replacements
      for (const rep of replacements) {
        content = content.replace(rep.regex, rep.replacement);
      }
      
      // Specific contextual modifications for text-white on light-cream cards:
      // If a container has bg-[#111111] (which becomes bg-card), any text-white or text-zinc-* text should adapt.
      // So if the file is updated to bg-card, we also want to fix the obvious text-white contrast issues in specific headers/descriptions:
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

const webDir = 'c:/Users/Manoj/Desktop/patra.io/apps/web';
processDirectory(path.join(webDir, 'app'));
processDirectory(path.join(webDir, 'components'));
console.log('Class mapping replacements completed successfully.');
