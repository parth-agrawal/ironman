import { Canvas } from '../index'
import { CanvasContent } from '../types'
import { useEffect, useState } from 'react';

export default function App() {
  const [content, setContent] = useState<CanvasContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/canvas-content');
        console.log('response', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data as CanvasContent);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!content) {
    return <div>No content available.</div>
  }

  return <Canvas content={content} />;
}
