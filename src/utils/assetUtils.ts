export const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/HaiKonofanDesu/konofan-assets-jp-sortet/main';

export type FileType = 'image' | 'text' | 'unknown';

export function getFileType(filename: string): FileType {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')) {
    return 'image';
  }
  if (['txt', 'json', 'md'].includes(extension || '')) {
    return 'text';
  }
  return 'unknown';
}

export function getFullAssetUrl(path: string): string {
  return `${GITHUB_RAW_URL}/${path}`;
}