import { useState, useCallback, useEffect } from 'react';
import { FaTv } from 'react-icons/fa';

interface SettingOption {
  id: string;
  name: string;
  icon: JSX.Element;
  component: JSX.Element;
}

interface ProjectorSettings {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  showTitle: boolean;
  showBackground: boolean;
  isFullScreen: boolean;
  currentVerse: number;
}

const defaultSettings: ProjectorSettings = {
  backgroundColor: '#0F172A',
  textColor: '#FFFFFF',
  fontSize: 40,
  fontFamily: 'Arial',
  showTitle: false,
  showBackground: true,
  isFullScreen: false,
  currentVerse: 0
};

function ProjectorSettingsComponent({ 
  settings, 
  onSettingsChange 
}: { 
  settings: ProjectorSettings;
  onSettingsChange: (settings: ProjectorSettings) => void;
}) {
  const handleChange = (key: keyof ProjectorSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    // Store settings in localStorage to access from lyrics page
    localStorage.setItem('projectorSettings', JSON.stringify(newSettings));
  };

  const backgroundOptions = [
    { color: '#0F172A' }, // Dark blue/black
    { color: '#3B82F6' }, // Blue
    { color: '#22C55E' }, // Green
    { color: '#8B5CF6' }, // Purple
  ];

  const textColorOptions = [
    { color: '#FFFFFF' }, // White
    { color: '#FDE047' }, // Yellow
    { color: '#22D3EE' }, // Cyan
    { color: '#F87171' }, // Red
  ];

  // Sample verses for demonstration
  const verses = [
    {
      lines: [
        "Amazing grace! How sweet the sound",
        "That saved a wretch like me!"
      ]
    },
    {
      lines: [
        "I once was lost, but now am found,",
        "Was blind, but now I see."
      ]
    },
    {
      lines: [
        "'Twas grace that taught my heart to fear,",
        "And grace my fears relieved;"
      ]
    }
  ];

  // Handle full screen
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      handleChange('isFullScreen', true);
    } else {
      document.exitFullscreen();
      handleChange('isFullScreen', false);
    }
  }, []);

  // Navigation handlers
  const previousVerse = () => {
    if (settings.currentVerse > 0) {
      handleChange('currentVerse', settings.currentVerse - 1);
    }
  };

  const nextVerse = () => {
    if (settings.currentVerse < verses.length - 1) {
      handleChange('currentVerse', settings.currentVerse + 1);
    }
  };

  // Quick controls handlers
  const clearScreen = () => {
    handleChange('showBackground', false);
    handleChange('showTitle', false);
  };

  const toggleTitle = () => {
    handleChange('showTitle', !settings.showTitle);
  };

  const toggleBackground = () => {
    handleChange('showBackground', !settings.showBackground);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Projection Mode</h1>
      <p className="text-gray-600 mb-8">Configure and control projection settings</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <button 
              onClick={toggleFullScreen}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {settings.isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
          </div>

          <div 
            className="rounded-lg p-8 mb-4 min-h-[200px] flex items-center justify-center"
            style={{ 
              backgroundColor: settings.showBackground ? settings.backgroundColor : 'transparent',
              transition: 'background-color 0.3s'
            }}
          >
            <div className="text-center" style={{ color: settings.textColor }}>
              {settings.showTitle && (
                <h3 className="text-xl mb-4 opacity-70">Amazing Grace</h3>
              )}
              {verses[settings.currentVerse].lines.map((line, index) => (
                <p 
                  key={index}
                  style={{ 
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                  }}
                  className="mb-4"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={previousVerse}
              disabled={settings.currentVerse === 0}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Verse
            </button>
            <button 
              onClick={nextVerse}
              disabled={settings.currentVerse === verses.length - 1}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Verse
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          {/* Display Settings */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Font Size</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Arial</option>
                  <option>Helvetica</option>
                  <option>Times New Roman</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Background Options */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Background</h2>
            <div className="grid grid-cols-4 gap-4">
              {backgroundOptions.map((bg, index) => (
                <button
                  key={index}
                  onClick={() => handleChange('backgroundColor', bg.color)}
                  className={`w-full aspect-square rounded-lg transition-transform hover:scale-105 ${
                    settings.backgroundColor === bg.color ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: bg.color }}
                />
              ))}
            </div>
          </div>

          {/* Text Color Options */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Text Color</h2>
            <div className="grid grid-cols-4 gap-4">
              {textColorOptions.map((text, index) => (
                <button
                  key={index}
                  onClick={() => handleChange('textColor', text.color)}
                  className={`w-full aspect-square rounded-lg transition-transform hover:scale-105 ${
                    settings.textColor === text.color ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: text.color,
                    border: text.color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Controls</h2>
            <div className="flex gap-2">
              <button 
                onClick={clearScreen}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Clear Screen
              </button>
              <button 
                onClick={toggleTitle}
                className={`px-4 py-2 rounded transition-colors ${
                  settings.showTitle 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Show Title
              </button>
              <button 
                onClick={toggleBackground}
                className={`px-4 py-2 rounded transition-colors ${
                  settings.showBackground 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Toggle Background
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [projectorSettings, setProjectorSettings] = useState<ProjectorSettings>(defaultSettings);

  // Load saved settings on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('projectorSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setProjectorSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
        // If there's an error parsing, use default settings
        setProjectorSettings(defaultSettings);
      }
    }
  }, []);

  const handleSettingsChange = (newSettings: ProjectorSettings) => {
    setProjectorSettings(newSettings);
    localStorage.setItem('projectorSettings', JSON.stringify(newSettings));
  };

  const settingOptions: SettingOption[] = [
    {
      id: 'projector',
      name: 'Projector',
      icon: <FaTv className="text-2xl" />,
      component: <ProjectorSettingsComponent 
        settings={projectorSettings} 
        onSettingsChange={handleSettingsChange}
      />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1">
            <div className="p-6 bg-white">
              {settingOptions[0].component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}