import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export const requestCalendarPermission = async () => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
};

export const getDefaultCalendar = async () => {
  try {
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      throw new Error('Calendar permission denied');
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    
    // Find primary calendar
    const primaryCalendar = calendars.find(
      (cal) => cal.isPrimary || cal.allowsModifications
    );

    return primaryCalendar?.id || calendars[0]?.id;
  } catch (error) {
    console.error('Error getting default calendar:', error);
    throw error;
  }
};

export const addJobToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  notes?: string
) => {
  try {
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      throw new Error('Calendar permission denied');
    }

    const calendarId = await getDefaultCalendar();
    if (!calendarId) {
      throw new Error('No calendar available');
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
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
