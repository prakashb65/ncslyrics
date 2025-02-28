import { useState, useEffect } from 'react';
import Head from 'next/head';

interface Section {
  type: string;
  content: string;
}

const PresentationPage = () => {
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  useEffect(() => {
    window.electron?.receive('update-section', (section) => {
      setCurrentSection(section);
    });

    return () => {
      window.electron?.removeAllListeners('update-section');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Presentation Mode</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: black;
          }
        `}</style>
      </Head>
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
          color: 'white',
          padding: '2rem'
        }}
      >
        {currentSection ? (
          <div style={{ 
            fontSize: '4rem',
            fontWeight: '600',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            maxWidth: '90%'
          }}>
            {currentSection.content}
          </div>
        ) : (
          <div style={{ fontSize: '2rem', opacity: 0.5 }}>
            Waiting for lyrics...
          </div>
        )}
      </div>
    </>
  );
};

export default PresentationPage; 