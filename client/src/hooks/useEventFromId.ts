import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Event } from '../interfaces';
import { Client, Databases } from 'appwrite';

export const useEventFromId = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL
  const [event, setEvent] = useState<Event | null>(null); // Use Event type
  const [loading, setLoading] = useState(true);

  const client = new Client();
  const databases = new Databases(client);

  // Initialize Appwrite client with environment variables
  client
    .setEndpoint(import.meta.env.VITE_APP_APPWRITE_ENDPOINT as string) // Your Appwrite API Endpoint
    .setProject(import.meta.env.VITE_APP_APPWRITE_PROJECT as string); // Your Appwrite Project ID

    useEffect(() => {
      const fetchEvent = async () => {
        try {
          const response = await databases.getDocument(
            import.meta.env.VITE_APP_APPWRITE_DATABASE as string,
            import.meta.env.VITE_APP_APPWRITE_COLLECTION as string,
            id as string, // Event ID from the URL params
          );
          setEvent(response as unknown as Event); // Cast response to Event type
        } catch (error) {
          console.error('Error fetching event from Appwrite:', error);
        } finally {
          setLoading(false);
        }
      };
    
      if (id) {
        fetchEvent();
      }
    }, [id]);
    

  return { event, loading }; // Return both event and loading state
};
