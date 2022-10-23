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
import { getEventsEndpoint, IEvent } from "./backend";

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles({
  table: {
    borderTop: "1px solid rgb(224, 224, 224)",
    minHeight: "100%",
    "& td ~ td, & th ~ th": {
      borderLeft: "1px solid rgb(224, 224, 224)",
    },
  },
});

export function CalendarScreen() {
  const classes = useStyles();
  const weeks = generateCalendar(getToday());
  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    getEventsEndpoint(firstDate, lastDate).then(setEvents);
  }, [firstDate, lastDate]);

  return (
    <Box style={{ display: "flex", height: "100%", alignItems: "stretch" }}>
      <Box
        style={{ borderRight: "1px solid rgb(224, 224, 224)", width: "16em", padding: "8px 16px" }}
      >
        <h2>Agenda React</h2>
        <Button variant="contained" color="primary">
          Novo evento
        </Button>
        <Box>
          <FormControlLabel control={<Checkbox />} label="Pessoal" />
          <FormControlLabel control={<Checkbox />} label="Trabalho" />
        </Box>
      </Box>
      <Box style={{ flex: "1", display: "flex", flexDirection: "column" }}>
        <Box>
          <IconButton aria-label="Mês anterior ">
            <Icon>chevron_left</Icon>
          </IconButton>
          Mes
          <IconButton aria-label="Próximo mês">
            <Icon>chevron_right</Icon>
          </IconButton>
          <IconButton aria-label="Usuário">
            <Avatar>
              <Icon>person</Icon>
            </Avatar>
          </IconButton>
        </Box>

        <TableContainer>
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
                      {cell.date}
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

interface ICalendarCell {
  date: string;
  events: IEvent[];
}

function generateCalendar(date: string): ICalendarCell[][] {
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
      week.push({ date: isoDate, events: [] });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}

function getToday() {
  return "2022-10-22";
}
