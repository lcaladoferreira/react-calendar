import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import { FormControlLabel, Icon, IconButton, Tab } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import { useEffect, useState } from "react";
import { getEventsEndpoint, IEvent, ICalendar, getCalendarsEndpoint } from "./backend";
import { getToday } from "./dateFunctions";
import { useParams } from "react-router-dom";

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles({
  table: {
    borderTop: "1px solid rgb(224, 224, 224)",
    minHeight: "100%",
    tableLayout: "fixed",
    "& td ~ td, & th ~ th": {
      borderLeft: "1px solid rgb(224, 224, 224)",
    },
    "& td": {
      verticalAlign: "top",
      overflow: "hidden",
      padding: "8px 4px",
    },
  },
  dayOfMonth: {
    fontWeight: 500,
    marginBottom: "4px",
  },
  event: {
    display: "flex",
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
    margin: "4px 0px",
  },
  eventBackground: {
    color: "white",
    padding: "2px",
  },
});

export function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

  const classes = useStyles();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [calendarsSelected, setCalendarsSelected] = useState<boolean[]>([]);
  const weeks = generateCalendar(month + "-01", events, calendars, calendarsSelected);
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([getCalendarsEndpoint(), getEventsEndpoint(firstDate, lastDate)]).then(
      ([calendars, events]) => {
        setCalendarsSelected(calendars.map(() => true));
        setCalendars(calendars);
        setEvents(events);
      }
    );
  }, [firstDate, lastDate]);

  function toggleCalendar(i: number) {
    const newValue = [...calendarsSelected];
    newValue[i] = !newValue[i];
    setCalendarsSelected(newValue);
  }

  return (
    <Box style={{ display: "flex", height: "100%", alignItems: "stretch" }}>
      <Box
        style={{ borderRight: "1px solid rgb(224, 224, 224)", width: "16em", padding: "8px 16px" }}
      >
        <h2>Agenda React</h2>
        <Button variant="contained" color="primary">
          Novo evento
        </Button>
        <Box style={{ marginTop: "64px" }}>
          <h3>Agendas</h3>
          {calendars.map((calendar, i) => (
            <FormControlLabel
              key={calendar.id}
              control={
                <Checkbox
                  style={{ color: calendar.color }}
                  checked={calendarsSelected[i]}
                  onChange={() => toggleCalendar(i)}
                />
              }
              label={calendar.name}
            />
          ))}
        </Box>
      </Box>
      <Box style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <div>
            <IconButton aria-label="Mês anterior ">
              <Icon>chevron_left</Icon>
            </IconButton>
            <strong>{month}</strong>
            <IconButton aria-label="Próximo mês">
              <Icon>chevron_right</Icon>
            </IconButton>
          </div>
          <div style={{ flex: "5", display: "flex", flexDirection: "column" }}>
            <IconButton aria-label="Usuário">
              <Avatar>
                <Icon>person</Icon>
              </Avatar>
            </IconButton>
          </div>
        </Box>
        <TableContainer component={"div"}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {DAYS_OF_WEEK.map((day) => (
                  <TableCell align="center" key={day}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, i) => (
                <TableRow key={i}>
                  {week.map((cell) => (
                    <TableCell align="center" key={cell.date}>
                      <div className={classes.dayOfMonth}>{cell.dayOfMonth}</div>
                      {cell.events.map((event) => {
                        const color = event.calendar.color;
                        return (
                          <button key={event.id} className={classes.event}>
                            {event.time && (
                              <>
                                <Icon style={{ backgroundColor: color, fontSize: "inherit" }}>
                                  watch_later
                                </Icon>
                                <Box component="span" style={{ margin: "0 4px" }}>
                                  {" "}
                                  {event.time}
                                </Box>
                              </>
                            )}
                            {event.time ? (
                              <span>{event.desc}</span>
                            ) : (
                              <span
                                className={classes.eventBackground}
                                style={{ backgroundColor: color }}
                              >
                                {event.desc}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

type IEventWithCalendar = IEvent & { calendar: ICalendar };

interface ICalendarCell {
  date: string;
  dayOfMonth: number;
  events: IEventWithCalendar[];
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T10:00:00");
  const currentMonth = jsDate.getMonth();
  const currentDay = new Date(jsDate.valueOf());
  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = (currentDay.getDate() + 1).toString().padStart(2, "0");
      const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex((cal) => cal.id === event.calendarId);
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }

      week.push({
        dayOfMonth: currentDay.getDate(),
        date: isoDate,
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
