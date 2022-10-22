export interface ICalendar {
  id: number;
  name: string;
  color: string;
}
// de acordo com o backend o time é opcional
export interface IEvent {
  id: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch("http://localhost:8080/calendars").then((resp) => {
    return resp.json();
  });
}

export function getEventsEndpoint(): Promise<IEvent[]> {
  return fetch("http://localhost:8080/events").then((resp) => {
    return resp.json();
  });
}
