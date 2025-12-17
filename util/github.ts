/**
 * Utility functions to fetch and parse GitHub README content
 */

// Cache duration: 7 days in seconds
const CACHE_DURATION = 7 * 24 * 60 * 60; // 604800 seconds

/**
 * Fetches the README content from a GitHub repository
 * Tries 'main' branch first, then 'master' as fallback
 */
async function fetchReadmeContent(repository: string): Promise<string | null> {
  const branches = ['main', 'master'];
  
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${repository}/${branch}/README.md`;
    try {
      const response = await fetch(url, { 
        next: { revalidate: CACHE_DURATION }
      });
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error(`Failed to fetch README from ${url}:`, error);
    }
  }
  
  return null;
}

/**
 * Check if a line should be skipped as non-descriptive content
 */
function shouldSkipLine(line: string): boolean {
  const trimmed = line.trim();
  
  // Empty lines
  if (!trimmed) return true;
  
  // Headers
  if (trimmed.startsWith('#')) return true;
  
  // Badges and images
  if (trimmed.startsWith('![') || trimmed.startsWith('[![')) return true;
  
  // HTML comments
  if (trimmed.startsWith('<!--') || trimmed.includes('-->')) return true;
  
  // Code blocks
  if (trimmed.startsWith('```')) return true;
  
  // Tables
  if (trimmed.startsWith('|')) return true;
  
  // Blockquotes
  if (trimmed.startsWith('>')) return true;
  
  // List items at the start (TOC)
  if (trimmed.startsWith('- [') || /^\d+\.\s+\[/.test(trimmed)) return true;
  
  // Lines starting with any kind of quote character (straight or curly)
  // These are often epigraphs or quotes, not descriptions
  if (/^["'"\"\'\'\`]/.test(trimmed)) return true;
  
  // Attribution lines like "-- Author" or "- Author" or "— Author"
  // Matches: --, —, –, -, followed by optional space and text
  if (/^[-–—]+\s*[A-Za-z]/.test(trimmed)) return true;
  
  // Very short lines (less than 20 chars) are often not descriptions
  if (trimmed.length < 20) return true;
  
  return false;
}

/**
 * Extracts a description from README markdown content
 * Looks for the first substantial paragraph that describes the project
 */
function extractDescriptionFromReadme(readmeContent: string): string | null {
  const lines = readmeContent.split('\n');
  let description: string[] = [];
  let inCodeBlock = false;
  let foundContent = false;
  
  // First pass: try to find content after "Overview", "About", or "Description" headers
  let afterTargetHeader = false;
  const targetHeaders = /^#+\s*(overview|about|description|introduction|what is|summary)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Track code blocks
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    if (inCodeBlock) continue;
    
    // Check if this is a target header
    if (targetHeaders.test(trimmed)) {
      afterTargetHeader = true;
      continue;
    }
    
    // If we're after a target header and find non-skip content, use it
    if (afterTargetHeader) {
      if (shouldSkipLine(line)) {
        // If we already have content and hit a new header, stop
        if (trimmed.startsWith('#') && description.length > 0) {
          break;
        }
        continue;
      }
      
      foundContent = true;
      description.push(trimmed);
      
      // Stop at empty line after finding content
      if (!trimmed && description.length > 0) {
        break;
      }
    }
  }
  
  // If we found content after a target header, use it
  if (description.length > 0) {
    return formatDescription(description.join(' '));
  }
  
  // Second pass: fall back to first substantial paragraph
  description = [];
  inCodeBlock = false;
  foundContent = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Track code blocks
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    if (inCodeBlock) continue;
    
    // Skip non-descriptive content
    if (shouldSkipLine(line)) {
      // If we found content and hit a header, stop
      if (trimmed.startsWith('#') && foundContent && description.length > 0) {
        break;
      }
      // If we found content and hit empty line, stop
      if (!trimmed && foundContent && description.length > 0) {
        break;
      }
      continue;
    }
    
    foundContent = true;
    description.push(trimmed);
  }
  
  if (description.length === 0) {
    return null;
  }
  
  return formatDescription(description.join(' '));
}

/**
 * Clean up and format the description
 */
function formatDescription(text: string): string | null {
  // Remove markdown formatting
  let result = text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
    .replace(/\*(.*?)\*/g, '$1')       // Italic
    .replace(/`(.*?)`/g, '$1')         // Inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[.*?\]\(.*?\)/g, '')   // Images
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .trim();
  
  if (!result) return null;
  
  // Limit description length
  if (result.length > 300) {
    // Try to cut at a sentence boundary
    const truncated = result.substring(0, 300);
    const lastSentence = truncated.lastIndexOf('. ');
    if (lastSentence > 150) {
      result = truncated.substring(0, lastSentence + 1);
    } else {
      result = truncated.substring(0, 297) + '...';
    }
  }
  
  return result;
}

/**
 * Fetches the description from a GitHub repository's README
 * Returns null if unable to fetch or parse
 */
export async function getGithubReadmeDescription(repository: string): Promise<string | null> {
  try {
    const readmeContent = await fetchReadmeContent(repository);
    if (!readmeContent) {
      console.warn(`No README found for ${repository}`);
      return null;
    }
    
    const description = extractDescriptionFromReadme(readmeContent);
    
    if (!description) {
      console.warn(`Could not extract description from README for ${repository}`);
    }
    
    return description;
  } catch (error) {
    console.error(`Failed to fetch README for ${repository}:`, error);
    return null;
  }
}

/**
 * Batch fetch descriptions for multiple repositories
 * Useful for the projects list page
 */
export async function getGithubReadmeDescriptions(
  repositories: string[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  const fetchPromises = repositories.map(async (repo) => {
    try {
      const description = await getGithubReadmeDescription(repo);
      if (description) {
        results.set(repo, description);
      }
    } catch (error) {
      console.error(`Error fetching description for ${repo}:`, error);
    }
  });
  
  await Promise.all(fetchPromises);
  
  return results;
}

/**
 * Fetches the full README content from a GitHub repository
 * Returns the raw markdown content
 */
export async function getGithubReadmeContent(repository: string): Promise<string | null> {
  const branches = ['main', 'master'];
  
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${repository}/${branch}/README.md`;
    try {
      const response = await fetch(url, { 
        next: { revalidate: CACHE_DURATION }
      });
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error(`Failed to fetch README from ${url}:`, error);
    }
  }
  
  return null;
}
