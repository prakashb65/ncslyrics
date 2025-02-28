import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaPrint, FaShare, FaHeart, FaArrowLeft, FaDesktop, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

interface LyricsSection {
  type: string;
  content: string;
}

export async function getStaticPaths() {
  // This is example data - replace with your actual data source
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: false // or 'blocking' if you want to generate pages on-demand
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  // Here you would normally fetch data for the specific song
  return {
    props: {
      // Add any props you want to pass to the component
    },
  };
}

export default function SingleLyricsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [presentationWindow, setPresentationWindow] = useState<Window | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  // Example lyrics data (you'll replace this with your actual data)
  const lyricsSections: LyricsSection[] = [
    { type: 'Verse 1', content: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now I\'m found\nWas blind, but now I see' },
    { type: 'Verse 2', content: 'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed' },
    { type: 'Chorus', content: 'My chains are gone, I\'ve been set free\nMy God, my Savior has ransomed me\nAnd like a flood His mercy reigns\nUnending love, amazing grace' },
    // Add more sections as needed
  ];

  const openPresentation = () => {
    // Try to get the secondary display
    let presentationScreen: Window | null = null;
    
    if (window.screen && window.screen.availWidth) {
      // Calculate dimensions for full screen
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;
      
      // Try to open on secondary display if available
      try {
        // First try to open on a potential second screen
        presentationScreen = window.open(
          '',
          '_blank',
          `popup=true,fullscreen=yes,width=${width},height=${height},left=${width},top=0`
        );
      } catch (e) {
        // Fallback to primary display if secondary is not available
        presentationScreen = window.open(
          '',
          '_blank',
          `popup=true,fullscreen=yes,width=${width},height=${height},left=0,top=0`
        );
      }
    }

    // Get projector settings from localStorage
    const projectorSettings = JSON.parse(localStorage.getItem('projectorSettings') || JSON.stringify({
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      fontSize: 40,
      fontFamily: 'Arial'
    }));

    if (presentationScreen) {
      setPresentationWindow(presentationScreen);
      setIsPresenting(true);
      
      presentationScreen.document.write(`
        <html>
          <head>
            <title>Lyrics Presentation</title>
            <style>
              body { 
                font-family: ${projectorSettings.fontFamily}; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0;
                background: ${projectorSettings.backgroundColor};
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
              /* Add fullscreen styles */
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
              }
              /* Ensure text is readable on any screen size */
              @media (min-width: 1920px) {
                body {
                  font-size: 3em;
                }
              }
              @media (max-width: 1366px) {
                body {
                  font-size: 2em;
                }
              }
            </style>
            <script>
              // Request fullscreen when window opens
              window.onload = function() {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                  document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                  document.documentElement.msRequestFullscreen();
                }
              };
              
              // Handle keyboard shortcuts
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                  window.close();
                }
              });
            </script>
          </head>
          <body>
            <div id="content">${lyricsSections[currentSection].content}</div>
          </body>
        </html>
      `);

      // Add event listener for window close
      presentationScreen.addEventListener('beforeunload', () => {
        setIsPresenting(false);
        setPresentationWindow(null);
      });

      // Try to position the window on a second screen if available
      try {
        if (window.screen && window.screen.availWidth) {
          presentationScreen.moveTo(window.screen.availWidth, 0);
        }
      } catch (e) {
        console.log('Unable to position on second screen');
      }
    }
  };

  const closePresentation = () => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.close();
    }
    setIsPresenting(false);
    setPresentationWindow(null);
  };

  const updatePresentation = (sectionIndex: number) => {
    if (presentationWindow && !presentationWindow.closed) {
      const content = presentationWindow.document.getElementById('content');
      if (content) {
        content.innerHTML = lyricsSections[sectionIndex].content;
      }
    }
  };

  const navigateSection = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentSection + 1, lyricsSections.length - 1)
      : Math.max(currentSection - 1, 0);
    setCurrentSection(newIndex);
    updatePresentation(newIndex);
  };

  return (
    <>
      {/* Updated print styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except lyrics content */
          body * {
            visibility: hidden;
          }
          
          /* Show only lyrics content */
          .print-content, .print-content * {
            visibility: visible;
          }

          /* Hide author section when printing */
          .author-section {
            display: none !important;
          }
          
          /* Reset background and text colors for printing */
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }

          /* Remove highlighting in print */
          .print-content div {
            background: none !important;
            padding: 0 !important;
          }

          /* Add page margins */
          @page {
            margin: 2cm;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => router.push('/lyrics')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft /> Back to Lyrics
            </button>
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

        <div className="max-w-4xl mx-auto p-8">
          {/* Lyrics Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center print-content">
              <div className="text-xl text-gray-800 whitespace-pre-line leading-relaxed">
                {lyricsSections.map((section, index) => (
                  <div 
                    key={index} 
                    className={`mb-6 last:mb-0 ${
                      isPresenting && currentSection === index ? 'bg-blue-50 rounded-lg p-4' : ''
                    }`}
                  >
                    {section.content}
                  </div>
                ))}
              </div>
              <div className="mt-12 pt-8 border-t border-gray-200 author-section">
                <div className="text-gray-500">
                  Author: John Newton
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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

          {/* Presentation Controls - Only visible when presenting */}
          {isPresenting && (
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
              <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => navigateSection('prev')}
                    className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                    disabled={currentSection === 0}
                  >
                    <FaChevronLeft /> Previous
                  </button>
                  
                  {lyricsSections.map((section, index) => (
                    section.type === 'Chorus' || section.type === 'Verse 1' ? (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentSection(index);
                          updatePresentation(index);
                        }}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          currentSection === index
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {section.type}
                      </button>
                    ) : null
                  ))}

                  <button
                    onClick={() => navigateSection('next')}
                    className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                    disabled={currentSection === lyricsSections.length - 1}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Add padding at bottom when controls are visible */}
          {isPresenting && <div className="h-20"></div>}
        </div>
      </div>
    </>
  );
} 