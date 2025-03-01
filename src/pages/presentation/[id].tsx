import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Section {
  id: number;
  content: string;
}

const PresentationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentSection, setCurrentSection] = useState<Section | null>(null);

  useEffect(() => {
    // Add any web-specific initialization here if needed
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