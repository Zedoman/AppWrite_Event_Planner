import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { EventCard } from '../components/EventCard';
import { Filter } from '../components/Filter';
import { Title } from '../components/Title';
import { CopilotBot } from '../components/Copilot/CopilotBot';
import { CATEGORIES, CATEGORY_ALL } from '../constants';
import { selectCategoryFilter, selectFilteredEvents } from '../redux/eventsSelectors';
import { setCategoryFilter, setEvents } from '../redux/eventsSlice';
import { useAppwrite } from '../hooks/appWrite'; 

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const events = useSelector(selectFilteredEvents);
  const categoryFilter = useSelector(selectCategoryFilter);
  const { databases } = useAppwrite(); 

  // Fetch events from Appwrite Database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APP_APPWRITE_DATABASE as string,
          import.meta.env.VITE_APP_APPWRITE_COLLECTION as string
        );

        // Log the documents to inspect their structure
        // console.log(response.documents);

        // Map Appwrite documents to Event[]
        const events = response.documents.map(mapDocumentToEvent);

        // Dispatch the mapped events to the Redux store
        dispatch(setEvents(events));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
  
    fetchEvents();
  }, [dispatch, databases]);

  return (
    <>
      <div className="container py-10">
        <div>
          <div className="mb-10 flex justify-end gap-6 md:mb-5 xl:mb-10">
            <Title className="hidden xl:mr-auto xl:block text-black">My events</Title>
            <Filter
              className="md:min-w-[146px]"
              value={categoryFilter}
              noneOption={CATEGORY_ALL}
              options={CATEGORIES}
              icon="filters-3"
              placeholder="Category"
              onChange={value => dispatch(setCategoryFilter(value))}
            />
            <Button size="lg" icon="plus" style={{ backgroundColor: 'purple', color: 'white' }} onClick={() => navigate('/create')}>
              Add new event
            </Button>
          </div>
          <Title className="mb-5 hidden md:block xl:hidden">My events</Title>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {events.length > 0 ? (
            events.map(event => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <li>No events found.</li>
          )}
        </ul>
      </div>

      <div className="fixed bottom-5 right-5" style={{ backgroundColor: 'purple', color: 'white' }}>
        <CopilotBot className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-lg shadow-lg " />
      </div>
    </>
  );
};

// Function to map Appwrite document to event object
function mapDocumentToEvent(doc: Document): Event {
  return {
    _id: doc.$id,
    id: doc.$id,
    title: doc.title || '',
    description: doc.description || '',
    date: doc.date || '',
    time: doc.time || '',
    location: doc.location || '',
    category: doc.category || '',
    picture: doc.picture || '',
    priority: doc.priority || '',
  };
}
