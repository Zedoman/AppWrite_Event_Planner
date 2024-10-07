import { createSelector } from '@reduxjs/toolkit';
import { CATEGORY_ALL } from '../constants';
import { RootState } from './eventsStore';

export const selectEvents = (state: RootState) => state.events;

export const selectSearchKey = (state: RootState) => state.searchKey;

export const selectCategoryFilter = (state: RootState) => state.categoryFilter;

export const selectFilteredEvents = createSelector(
  selectEvents,
  selectCategoryFilter,
  selectSearchKey,
  (events, categoryFilter, searchKey) => {
    // console.log('Current events:', events); // Debugging line
    if (!Array.isArray(events)) {
      return []; // Return an empty array if events is not an array
    }

    const search = searchKey.toLowerCase();
    const filteredEvents = events.filter(event => {
      const isSearchMatched =
        event.title.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search);

      const isCategoryMatched =
        categoryFilter === CATEGORY_ALL ||
        event.category.includes(categoryFilter);

      return isSearchMatched && isCategoryMatched;
    });

    return filteredEvents.sort((event1, event2) => {
      const event1DateTime = new Date(`${event1.date}T${event1.time}:00`);
      const event2DateTime = new Date(`${event2.date}T${event2.time}:00`);
      return event1DateTime.getTime() - event2DateTime.getTime();
    });
  },
);

