interface SubtitleBlock {
  number: string;
  timestamp: string;
  text: string[];
}

function parseBlock(block: string): SubtitleBlock | null {
  const lines = block.trim().split('\n');
  
  // Find the timestamp line
  const timestampLineIndex = lines.findIndex(line => line.includes('-->'));
  if (timestampLineIndex === -1) return null;
  
  return {
    number: '',
    timestamp: lines[timestampLineIndex],
    text: lines.slice(timestampLineIndex + 1).filter(line => line.trim())
  };
}

function formatVttBlock(block: SubtitleBlock): string {
  return `${block.number}\n${block.timestamp}\n${block.text.join('\n')}`;
}

export function srtToVtt(srtContent: string): string {
  // Remove BOM if present
  const cleanContent = srtContent.replace(/^\uFEFF/, '').trim();
  
  // Split into subtitle blocks
  const blocks = cleanContent.split(/\n\s*\n/).filter(block => block.trim());
  let vttContent = 'WEBVTT\n\n';
  
  blocks.forEach((block, index) => {
    const parsedBlock = parseBlock(block);
    if (parsedBlock) {
      parsedBlock.number = (index + 1).toString();
      vttContent += formatVttBlock(parsedBlock) + '\n\n';
    }
  });
  
  return vttContent.trim() + '\n';
}

export function addVttNumbering(vttContent: string): string {
  // Remove any existing WEBVTT header and clean the content
  let cleanContent = vttContent.replace(/^WEBVTT\n+/, '').trim();
  
  // Split into blocks and filter out empty ones
  const blocks = cleanContent.split(/\n\s*\n/)
    .filter(block => block.trim())
    .map(block => block.trim());
  
  // Start with WEBVTT header
  let numberedContent = 'WEBVTT\n\n';
  let counter = 1;
  
  // Process each block
  for (const block of blocks) {
    const lines = block.split('\n');
    const timestampLineIndex = lines.findIndex(line => line.includes('-->'));
    
    if (timestampLineIndex !== -1) {
      const timestampAndText = lines.slice(timestampLineIndex);
      numberedContent += `${counter}\n${timestampAndText.join('\n')}\n\n`;
      counter++;
    }
  }
  
  return numberedContent.trim() + '\n';
}