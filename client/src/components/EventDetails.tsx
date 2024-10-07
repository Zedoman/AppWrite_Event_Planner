import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppwrite } from '../hooks/appWrite'; // Use the Appwrite hook
import { formatDateTime, getChipVariant } from '../helpers';
import { Event } from '../interfaces';
import { deleteEvent as deleteEventAction } from '../redux/eventsSlice';
import { Button } from './Button';
import { Chip } from './Chip';

interface EventDetailsProps {
  className?: string;
}

export function EventDetails({ className }: EventDetailsProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Extract the event ID from the URL
  const { databases } = useAppwrite(); // Use Appwrite client from hook
  const [event, setEvent] = useState<Event | null>(null); // State to store event details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Fetch event details from Appwrite using the event ID
        const response = await databases.getDocument(
          import.meta.env.VITE_APP_APPWRITE_DATABASE as string, // Use Appwrite database ID from .env
          import.meta.env.VITE_APP_APPWRITE_COLLECTION as string, // Use Appwrite collection ID from .env
          id as string // Use the event ID from the URL
        );
        // Map the Appwrite Document to the Event type
        const fetchedEvent: Event = {
          _id: response.$id,
          id: response.$id, // Ensure this matches your Event interface
          title: response.title,
          description: response.description,
          date: response.date,
          time: response.time,
          location: response.location,
          category: response.category,
          picture: response.picture,
          priority: response.priority,
          // Add any other properties that are part of your Event interface
        };

        setEvent(fetchedEvent);// Set the fetched event data
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEventDetails();
  }, [id, databases]);

  // Handle deletion of the event
  const handleDelete = async () => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE as string,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION as string,
        id as string // Delete event by ID
      );
      dispatch(deleteEventAction(id as string)); // Dispatch action to update Redux state
      navigate('/'); // Navigate back to the events list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // If the event is still loading, show a loading indicator or message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If event is not found, display a message
  if (!event) {
    return <div>Event not found</div>;
  }

  const { title, description, date, time, location, category, picture, priority } = event;
  
  // Use EventCard's logic for handling date and time
  const eventDateTime = new Date(`${date}T${time}:00`);
  const [day, month, year] = date.split('/');
  const formattedDate = new Date(`${year}-${month}-${day}`);

  const displayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',    // e.g., "Wed"
    day: 'numeric',      // e.g., "27"
    month: 'short',      // e.g., "Nov"
    year: 'numeric',     // e.g., "2024"
  }).format(formattedDate);

  return (
    <div className={clsx('rounded-md bg-white shadow-sm', className)}>
      <img
        className="aspect-[16/10] w-full rounded-md object-cover md:aspect-[5/2]"
        src={picture}
        alt={title}
      />
      <div className="px-6 pb-10 pt-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-sm">{description}</p>
        <div className="mb-10 flex flex-wrap gap-3">
          <Chip className="text-black">{category}</Chip>
          <Chip variant={getChipVariant(priority)}>{priority}</Chip>
          <Chip className="text-black">{location}</Chip>
          <Chip className="text-black">{displayDate}</Chip> {/* Show formatted DateTime */}
          <Chip className="text-black">{time}</Chip>
        </div>
        <div className="flex gap-6 md:justify-end md:gap-4">
          <Button
            className="basis-1/2 text-xs md:basis-auto md:text-sm text-black"
            variant="secondary"
            onClick={() => navigate(`/edit/${id}`)} // Navigate to edit page
          >
            Edit
          </Button>
          <Button
            className="basis-1/2 text-xs md:basis-auto md:text-sm"
            style={{ backgroundColor: 'purple', color: 'white' }}
            onClick={handleDelete} // Call handleDelete on click
          >
            Delete event
          </Button>
        </div>
      </div>
    </div>
  );
}
