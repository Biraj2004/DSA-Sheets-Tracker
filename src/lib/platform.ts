import type { Platform } from '../types';

/**
 * Derives the coding platform directly from a URL.
 * Concept questions with no URL return 'concept'.
 */
export function getPlatformFromUrl(url: string | null | undefined): Platform {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return 'concept';
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'leetcode.com' || host === 'leetcode.cn' || host.endsWith('.leetcode.com')) {
      return 'leetcode';
    }
    if (host === 'geeksforgeeks.org' || host.endsWith('.geeksforgeeks.org')) {
      return 'gfg';
    }
    if (host === 'codingninjas.com' || host.endsWith('.codingninjas.com') || host === 'naukri.com' || host.endsWith('.naukri.com')) {
      return 'codingninjas';
    }
    if (host === 'spoj.com') {
      return 'spoj';
    }
    if (host === 'hackerearth.com') {
      return 'hackerearth';
    }
    if (host === 'interviewbit.com') {
      return 'interviewbit';
    }

    return 'other';
  } catch {
    return 'concept';
  }
}

/**
 * Normalizes a problem link by removing tracking queries, hash, and trailing slashes.
 */
export function cleanProblemUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    
    // Normalize hostname
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Remove query params and hash
    parsed.search = '';
    parsed.hash = '';

    // Strip trailing slash
    let clean = parsed.toString().replace(/\/$/, '');

    // Normalize LeetCode links ending with /description
    if (parsed.hostname === 'leetcode.com' && clean.endsWith('/description')) {
      clean = clean.replace(/\/description$/, '');
    }

    return clean;
  } catch {
    return trimmed;
  }
}

/**
 * Generates a unique canonical problem ID based on platform and clean URL/slug.
 */
export function generateProblemId(url: string | null | undefined, title: string): string {
  const platform = getPlatformFromUrl(url);

  if (platform === 'concept' || !url) {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `concept-${cleanTitle}`;
  }

  const cleanedUrl = cleanProblemUrl(url) || url;
  
  try {
    const parsed = new URL(cleanedUrl.startsWith('http') ? cleanedUrl : `https://${cleanedUrl}`);
    const pathname = parsed.pathname.replace(/\/$/, '');
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'problem';

    switch (platform) {
      case 'leetcode': {
        // e.g. /problems/two-sum/
        const probIndex = segments.indexOf('problems');
        const slug = probIndex !== -1 && segments[probIndex + 1] ? segments[probIndex + 1] : lastSegment;
        return `lc-${slug.toLowerCase()}`;
      }
      case 'gfg': {
        // e.g. /problems/kadanes-algorithm-1587115620/1
        // prefer the slug before the numeric id
        const slug = segments[segments.length - 2] && segments[segments.length - 1] === '1'
          ? segments[segments.length - 2]
          : lastSegment;
        return `gfg-${slug.toLowerCase()}`;
      }
      case 'codingninjas': {
        return `cn-${lastSegment.toLowerCase()}`;
      }
      case 'spoj': {
        return `spoj-${lastSegment.toLowerCase()}`;
      }
      case 'hackerearth': {
        return `he-${lastSegment.toLowerCase()}`;
      }
      case 'interviewbit': {
        return `ib-${lastSegment.toLowerCase()}`;
      }
      default: {
        return `other-${lastSegment.toLowerCase()}`;
      }
    }
  } catch {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${platform}-${cleanTitle}`;
  }
}
