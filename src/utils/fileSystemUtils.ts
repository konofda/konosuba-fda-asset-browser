interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: Record<string, FileNode>;
}

export function buildFileTree(paths: string[]): FileNode {
  const root: FileNode = {
    name: '.',
    path: '',
    type: 'directory',
    children: {},
  };

  paths.forEach(path => {
    const parts = path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        current.children![part] = {
          name: part,
          path: path,
          type: 'file',
        };
      } else {
        // It's a directory
        if (!current.children![part]) {
          current.children![part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: 'directory',
            children: {},
          };
        }
        current = current.children![part];
      }
    });
  });

  return root;
}

export function getCurrentDirectoryContents(
  root: FileNode,
  currentPath: string[]
): { 
  parentPath: string[] | null;
  contents: FileNode[];
} {
  if (currentPath.length === 0) {
    return {
      parentPath: null,
      contents: Object.values(root.children || {}).sort((a, b) => {
        // Directories first, then files
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    };
  }

  let current = root;
  for (const part of currentPath) {
    current = current.children![part];
  }

  return {
    parentPath: currentPath.slice(0, -1),
    contents: Object.values(current.children || {}).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }),
  };
}