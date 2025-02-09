import React from 'react';
import { FileType, getFileType } from '../utils/assetUtils';

interface AssetViewerProps {
  url: string;
  path: string;
}

const ImageViewer: React.FC<{ url: string }> = ({ url }) => (
  <div className='w-full h-full flex items-center justify-center p-4'>
    <img
      src={url}
      alt='Asset preview'
      className='max-w-full max-h-[calc(100vh-3.5rem)] object-contain mx-auto'
      style={{ objectFit: 'contain' }}
    />
  </div>
);

const TextViewer: React.FC<{ url: string }> = ({ url }) => {
  const [content, setContent] = React.useState<string>('Loading...');

  React.useEffect(() => {
    fetch(url)
      .then(response => response.text())
      .then(setContent)
      .catch(() => setContent('Error loading file'));
  }, [url]);

  return (
    <div className='h-full overflow-auto p-4'>
      <pre className='whitespace-pre-wrap font-mono text-sm p-4 bg-white/10 rounded-lg'>
        {content}
      </pre>
    </div>
  );
};

const UnknownViewer: React.FC<{ path: string }> = ({ path }) => (
  <div className='h-full flex items-center justify-center'>
    <div className='text-center p-4 bg-white/10 rounded-lg'>
      <p>Unknown file type</p>
      <p className='text-sm opacity-75 mt-2'>{path}</p>
    </div>
  </div>
);

export const AssetViewer: React.FC<AssetViewerProps> = ({ url, path }) => {
  const fileType = getFileType(path);

  const viewers: Record<FileType, React.FC<any>> = {
    image: ImageViewer,
    text: TextViewer,
    unknown: UnknownViewer,
  };

  const Viewer = viewers[fileType];

  return <Viewer url={url} path={path} />;
};
