import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

type Section = {
  id: number;
  content: string;
}

const PresentationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/lyrics/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch lyrics');
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('No lyrics found');
        }
        
        setCurrentSection(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCurrentSection(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [id]);

  return (
    <>
      <Head>
        <title>Presentation Mode | {currentSection?.content || 'Loading...'}</title>
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
        {error ? (
          <div style={{ fontSize: '2rem', color: 'red', opacity: 0.8 }}>
            {error}
          </div>
        ) : isLoading ? (
          <div style={{ fontSize: '2rem', opacity: 0.5 }}>
            Loading lyrics...
          </div>
        ) : currentSection ? (
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
            No lyrics found
          </div>
        )}
      </div>
    </>
  );
};

export default PresentationPage; 