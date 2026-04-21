import { CATEGORIES, EVENTS } from '../data/mockData';

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCategories = async () => {
  await delay();
  return CATEGORIES;
};

export const getEventsByCategory = async (categoryId) => {
  await delay();
  return EVENTS.filter((e) => e.categoryId === categoryId);
};

export const getEventById = async (id) => {
  await delay();
  return EVENTS.find((e) => e.id === id) || null;
};

export const getAllEvents = async () => {
  await delay();
  return EVENTS;
};

export const searchEvents = async (filters = {}) => {
  await delay();
  let results = [...EVENTS];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.department) {
    results = results.filter((e) => e.department === filters.department);
  }

  if (filters.categoryId) {
    results = results.filter((e) => e.categoryId === filters.categoryId);
  }

  if (filters.sort === 'popular') {
    results.sort((a, b) => b.registeredCount - a.registeredCount);
  } else if (filters.sort === 'seats') {
    results.sort((a, b) => (b.maxSeats - b.registeredCount) - (a.maxSeats - a.registeredCount));
  } else {
    results.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return results;
};
