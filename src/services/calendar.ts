// Calendar integration disabled - expo-calendar not installed
// To enable: npx expo install expo-calendar and add "expo-calendar" to app.json plugins

export const requestCalendarPermission = async () => {
  return false;
};

export const getDefaultCalendar = async () => {
  return null;
};

export const addJobToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  notes?: string
): Promise<string | null> => {
  console.log('Calendar integration disabled', { title, startDate, endDate, location, notes });
  return null;
};

export const updateCalendarEvent = async (
  eventId: string,
  updates: {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    notes?: string;
  }
): Promise<void> => {
  console.log('Calendar integration disabled', { eventId, updates });
};

export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  console.log('Calendar integration disabled', { eventId });
};
