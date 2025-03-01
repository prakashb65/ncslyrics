import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaPrint, FaShare, FaHeart, FaArrowLeft, FaDesktop, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface LyricSection {
  type: string;
  content: string;
}

interface Lyric {
  id: string;
  title: string;
  artist: string;
  category?: string;
  lyrics: string;
}

export default function SingleLyricsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lyric, setLyric] = useState<Lyric | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationWindow, setPresentationWindow] = useState<Window | null>(null);
  const [sections, setSections] = useState<LyricSection[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchLyric();
    }
  }, [id]);

  useEffect(() => {
    if (lyric) {
      const parsedSections = parseLyricSections(lyric.lyrics);
      setSections(parsedSections);
      if (presentationWindow && !presentationWindow.closed) {
        updatePresentationContent(currentSectionIndex);
      }
    }
  }, [lyric]);

  const parseLyricSections = (lyrics: string): LyricSection[] => {
    const lines = lyrics.split('\n');
    const sections: LyricSection[] = [];
    let currentSection: LyricSection | null = null;
    
    lines.forEach(line => {
      const sectionMatch = line.match(/^\[(.*?)\]/);
      if (sectionMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          type: sectionMatch[1].trim(),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      } else {
        currentSection = {
          type: 'default',
          content: line
        };
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const navigateSection = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      updatePresentationContent(currentSectionIndex - 1);
    } else if (direction === 'next' && currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      updatePresentationContent(currentSectionIndex + 1);
    }
  };

  const updatePresentationContent = (index: number) => {
    if (presentationWindow && !presentationWindow.closed && sections[index]) {
      try {
        const savedSettings = localStorage.getItem('projectorSettings');
        const projectorSettings = savedSettings ? JSON.parse(savedSettings) : null;
        
        if (projectorSettings) {
          const body = presentationWindow.document.body;
          body.style.background = projectorSettings.showBackground ? projectorSettings.backgroundColor : 'transparent';
          body.style.color = projectorSettings.textColor;
          body.style.fontFamily = projectorSettings.fontFamily;
          body.style.fontSize = `${projectorSettings.fontSize}px`;
        }

        const content = presentationWindow.document.getElementById('content');
        if (content) {
          content.innerHTML = `
            ${projectorSettings?.showTitle && lyric?.title ? `<h1 style="margin-bottom: 1em; opacity: 0.7">${lyric.title}</h1>` : ''}
            <div class="section-content">${sections[index].content}</div>
          `;
        }
      } catch (e) {
        console.error('Failed to update presentation content:', e);
        setIsPresenting(false);
        setPresentationWindow(null);
      }
    }
  };

  const fetchLyric = async () => {
    try {
      console.log('Fetching lyric with id:', id);
      const response = await fetch(`/api/lyrics/${id}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lyric: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received lyric data:', data);
      setLyric(data);
    } catch (error) {
      console.error('Error fetching lyric:', error);
      // Show error state instead of infinite loading
      setLyric(null);
    }
  };

  const openPresentation = () => {
    if (!lyric || sections.length === 0) return;

    // Get saved projector settings
    const savedSettings = localStorage.getItem('projectorSettings');
    const projectorSettings = savedSettings ? JSON.parse(savedSettings) : {
      backgroundColor: '#0F172A',
      textColor: '#FFFFFF',
      fontSize: 40,
      fontFamily: 'Arial',
      showTitle: false,
      showBackground: true
    };

    // If window exists and is not closed, just update content
    if (presentationWindow && !presentationWindow.closed) {
      updatePresentationContent(currentSectionIndex);
      return;
    }

    let newPresentationWindow: Window | null = null;
    
    try {
      newPresentationWindow = window.open(
        '',
        'lyrics_presentation',
        `popup=true,fullscreen=yes,width=${window.screen.availWidth},height=${window.screen.availHeight}`
      );

      if (!newPresentationWindow) {
        console.error('Failed to open presentation window');
        return;
      }

      setPresentationWindow(newPresentationWindow);
      setIsPresenting(true);
      
      newPresentationWindow.document.write(`
        <html>
          <head>
            <title>${lyric.title || 'Presentation'}</title>
            <style>
              body { 
                font-family: ${projectorSettings.fontFamily}; 
                display: flex; 
                flex-direction: column;
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0;
                background: ${projectorSettings.showBackground ? projectorSettings.backgroundColor : 'transparent'};
                color: ${projectorSettings.textColor};
                font-size: ${projectorSettings.fontSize}px;
                text-align: center;
                line-height: 1.6;
                overflow: hidden;
              }
              #content {
                white-space: pre-line;
                max-width: 80%;
                padding: 2rem;
              }
              .section-content {
                font-size: 1.2em;
              }
            </style>
          </head>
          <body>
            <div id="content">
              ${projectorSettings.showTitle && lyric.title ? `<h1 style="margin-bottom: 1em; opacity: 0.7">${lyric.title}</h1>` : ''}
              <div class="section-content">${sections[currentSectionIndex].content}</div>
            </div>
          </body>
        </html>
      `);

      newPresentationWindow.document.close();

      // Only handle window close event
      newPresentationWindow.addEventListener('beforeunload', () => {
        setIsPresenting(false);
        setPresentationWindow(null);
      });
    } catch (e) {
      console.error('Failed to open presentation window:', e);
      return;
    }
  };

  const closePresentation = () => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.close();
    }
    setIsPresenting(false);
    setPresentationWindow(null);
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Missing lyric ID</div>
      </div>
    );
  }

  if (!lyric) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-gray-600">Loading...</div>
        <button
          onClick={(e) => {
            e.preventDefault();
            router.push('/lyrics', undefined, { shallow: true });
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to Lyrics
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .author-section {
            display: none !important;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }

          .print-content div {
            background: none !important;
            padding: 0 !important;
          }

          @page {
            margin: 2cm;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push('/lyrics', undefined, { shallow: true });
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft /> Back to Lyrics
            </button>
            <div className="flex items-center gap-4">
              {isPresenting && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateSection('prev')}
                    disabled={currentSectionIndex === 0}
                    className={`p-2 rounded ${
                      currentSectionIndex === 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">
                    Section {currentSectionIndex + 1} of {sections.length}
                  </span>
                  <button
                    onClick={() => navigateSection('next')}
                    disabled={currentSectionIndex === sections.length - 1}
                    className={`p-2 rounded ${
                      currentSectionIndex === sections.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
              <button
                onClick={isPresenting ? closePresentation : openPresentation}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  isPresenting 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FaDesktop /> 
                {isPresenting ? 'Close Projection' : 'Project'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center print-content">
              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <div className="text-xl text-gray-800 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
              {lyric.artist && (
                <div className="mt-12 pt-8 border-t border-gray-200 author-section">
                  <div className="text-gray-500">
                    By {lyric.artist}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Controller - Moved below lyrics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="text-lg font-semibold text-gray-700">Navigation Controls</div>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigateSection('prev')}
                  disabled={currentSectionIndex === 0}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    currentSectionIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FaChevronLeft />
                    <span>Previous</span>
                  </div>
                </button>

                {sections.map((section, index) => (
                  section.type.toLowerCase().includes('verse 1') || section.type.toLowerCase().includes('chorus') ? (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSectionIndex(index);
                        if (presentationWindow) {
                          updatePresentationContent(index);
                        }
                      }}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        currentSectionIndex === index
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {section.type}
                    </button>
                  ) : null
                ))}

                <button
                  onClick={() => navigateSection('next')}
                  disabled={currentSectionIndex === sections.length - 1}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    currentSectionIndex === sections.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Next</span>
                    <FaChevronRight />
                  </div>
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Section {currentSectionIndex + 1} of {sections.length}: {sections[currentSectionIndex]?.type}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8 mb-12">
            <button 
              onClick={() => window.print()} 
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaPrint size={24} />
              <span className="text-sm">Print</span>
            </button>
            <button 
              onClick={() => {}} 
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaShare size={24} />
              <span className="text-sm">Share</span>
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex flex-col items-center gap-2 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaHeart size={24} />
              <span className="text-sm">Favorite</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}