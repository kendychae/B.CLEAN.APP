// Calendar integration temporarily disabled
// To enable: npm install expo-calendar and add "expo-calendar" to app.json plugins

export const requestCalendarPermission = async () => {
  console.log('Calendar integration disabled - expo-calendar not installed');
  return false;
};

export const getDefaultCalendar = async () => {
  console.log('Calendar integration disabled - expo-calendar not installed');
  return null;
};

export const addJobToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  notes?: string
) => {
  console.log('Calendar integration disabled - expo-calendar not installed');
  console.log('Would have added event:', { title, startDate, endDate, location, notes });
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
) => {
  console.log('Calendar integration disabled - expo-calendar not installed');
  return;
};

export const deleteCalendarEvent = async (eventId: string) => {
  console.log('Calendar integration disabled - expo-calendar not installed');
  return;
};

      endDate,
      location,
      notes,
      alarms: [
        { relativeOffset: -60 }, // 1 hour before
        { relativeOffset: -1440 }, // 1 day before
      ],
    });

    return eventId;
  } catch (error) {
    console.error('Error adding job to calendar:', error);
    throw error;
  }
};

export const updateCalendarEvent = async (
  eventId: string,
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  notes?: string
) => {
  try {
    await Calendar.updateEventAsync(eventId, {
      title,
      startDate,
      endDate,
      location,
      notes,
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (eventId: string) => {
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};
