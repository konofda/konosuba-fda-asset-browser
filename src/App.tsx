import React, { useState } from 'react';
import { Image, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildFileTree, getCurrentDirectoryContents } from './utils/fileSystemUtils';
import { useAssets } from './hooks/useAssets';
import { FilesView } from './components/FilesView';
import { KonoTab } from './components/KonoTab';
import { MobileDrawer } from './components/MobileDrawer';
import { TABS, getDefaultView, isValidView } from './config/navigation';
import type { FileNode } from './utils/fileSystemUtils';
import type { View } from './types';

function App() {
  const { data: assets = [] } = useAssets();
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = isValidView(location.pathname.slice(1)) 
    ? location.pathname.slice(1) 
    : getDefaultView();

  React.useEffect(() => {
    if (assets.length > 0) {
      setFileTree(buildFileTree(assets));
    }
  }, [assets]);

  const { contents } = fileTree 
    ? getCurrentDirectoryContents(fileTree, currentPath)
    : { parentPath: null, contents: [] };

  const handleNavigate = (node: FileNode) => {
    if (node.type === 'directory') {
      setCurrentPath([...currentPath, node.name]);
    } else {
      setSelectedAsset(node.path);
    }
  };

  const navigateToPath = (index: number) => {
    setCurrentPath(index === -1 ? [] : currentPath.slice(0, index + 1));
  };

  const handleViewChange = (view: View) => {
    navigate(`/${view === 'files' ? '' : view}`);
  };

  const renderContent = () => {
    if (currentView === 'files') {
      return (
        <FilesView
          assets={assets}
          fileTree={fileTree}
          currentPath={currentPath}
          selectedAsset={selectedAsset}
          contents={contents}
          onNavigate={handleNavigate}
          onNavigateToPath={navigateToPath}
        />
      );
    }

    const tab = TABS.find(t => t.id === currentView);
    if (tab?.component) {
      const Component = tab.component;
      return <Component assets={assets} />;
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl">
      {/* Top Navigation Bar */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 flex-none">
        <div className="flex items-center h-10 px-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors mr-2"
          >
            <Menu className="w-5 h-5 text-purple-900" />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-1.5 text-purple-900 font-medium text-sm mr-4">
            <Image className="w-4 h-4" />
            <span className="whitespace-nowrap">Konofan Assets Browser</span>
          </div>
          
          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center h-full gap-0.5 text-xs overflow-x-auto">
            {TABS.map(tab => (
              <KonoTab
                key={tab.id}
                icon={tab.icon}
                isActive={currentView === tab.id}
                onClick={() => handleViewChange(tab.id)}
              >
                {tab.label}
              </KonoTab>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tabs={TABS}
        currentView={currentView}
        onViewChange={view => {
          handleViewChange(view as View);
          setIsDrawerOpen(false);
        }}
      />

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}

export default App;