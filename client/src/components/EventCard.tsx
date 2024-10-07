import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, getChipVariant } from '../helpers';
import { Event } from '../interfaces';
import { Button } from './Button';
import { Chip } from './Chip';

interface EventCardProps {
  className?: string;
  event: Event;
}

export function EventCard({
  className,
  event: {
    id,
    title,
    description,
    date,  // Date in "DD/MM/YYYY" format
    time,  // Time in "hh:mm am/pm" format
    location,
    category,
    picture,
    priority,
  },
}: EventCardProps) {
  const navigate = useNavigate();

  // Parse the date (assuming "DD/MM/YYYY" format)
  const [day, month, year] = date.split('/');
  const formattedDate = new Date(`${year}-${month}-${day}`);

  // Format the date for display using Intl.DateTimeFormat
  const displayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',    // e.g., "Wed"
    day: 'numeric',      // e.g., "27"
    month: 'short',      // e.g., "Nov"
    year: 'numeric',     // e.g., "2024"
  }).format(formattedDate);

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl bg-white pb-[144px] shadow-sm',
        className,
      )}
    >
      <img
        className="h-[336px] w-full object-cover"
        src={picture}
        alt={title}
      />
      <div className="absolute left-3 top-3 flex gap-3 y">
        <Chip className='text-black'>{category}</Chip>
        <Chip variant={getChipVariant(priority)}>{priority}</Chip>
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-14 transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex items-center justify-between bg-white/80 px-4 py-2 text-sm text-accent text-black">
          {/* Display the formatted date and the time separately */}
          <div>
            <p>{displayDate}</p> {/* e.g., "Wed, 27 Nov 2024" */}
            <p>{time}</p> {/* e.g., "01:00 pm" */}
          </div>
          <p>{location}</p>
        </div>
        <div className="flex h-[200px] flex-col bg-white p-4">
          <h3 className="mb-4 font-medium">{title}</h3>
          <p className="mb-6 line-clamp-3 text-sm">{description}</p>
          <Button
            className="ml-auto mt-auto opacity-0 transition-opacity group-hover:opacity-100"
            style={{ backgroundColor: 'purple', color: 'white' }}
            onClick={() => navigate(`/events/${id}`)}
          >
            More info
          </Button>
        </div>
      </div>
    </div>
  );
}
