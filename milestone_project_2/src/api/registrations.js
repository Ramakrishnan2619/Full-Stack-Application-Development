import { REGISTRATIONS, EVENTS } from '../data/mockData';

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

let registrations = [...REGISTRATIONS];

export const registerForEvent = async (eventId, data) => {
  await delay(1500);
  const newReg = {
    id: 'reg-' + String(registrations.length + 1).padStart(3, '0'),
    eventId,
    studentId: data.studentId || 'S001',
    status: 'upcoming',
    registeredOn: new Date().toISOString().split('T')[0],
    feedback: null,
  };
  registrations.push(newReg);
  return newReg;
};

export const getMyRegistrations = async () => {
  await delay();
  return registrations.map((reg) => {
    const event = EVENTS.find((e) => e.id === reg.eventId);
    return { ...reg, event };
  });
};

export const submitFeedback = async (regId, data) => {
  await delay();
  registrations = registrations.map((r) =>
    r.id === regId ? { ...r, feedback: data } : r
  );
  return { success: true };
};

export const isRegistered = (eventId) => {
  return registrations.some(
    (r) => r.eventId === eventId && r.studentId === 'S001' && r.status !== 'cancelled'
  );
};

export const getRegistrationsForEvent = async (eventId) => {
  await delay();
  return registrations.filter((r) => r.eventId === eventId);
};

export const getAllRegistrations = () => registrations;
