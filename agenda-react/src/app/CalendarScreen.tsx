import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
const WEEK0 = [1, 2, 3, 4, 5, 6, 7];
const WEEK1 = [8, 9, 10, 11, 12, 13, 14];
const WEEK2 = [15, 16, 17, 18, 19, 20, 21];
const WEEK3 = [22, 23, 24, 25, 26, 27, 28];
const d = new Date();
let date = d.getDate();
console.log(date);

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  table: {
    minHeight: "100%",
    "& td ~ td, & th ~ th": {
      borderLeft: "1px solid rgb(224, 224, 224)",
    },
  },
});

export function CalendarScreen() {
  const classes = useStyles();

  return (
    <TableContainer className={classes.root} component={"div"}>
      <Table className={classes.table} aria-label="simple table">
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
          <TableRow>
            {WEEK0.map((week) => (
              <TableCell align="center" key={week}>
                {week}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {WEEK1.map((week) => (
              <TableCell align="center" key={week}>
                {week}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {WEEK2.map((week) => (
              <TableCell align="center" key={week}>
                {week}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {WEEK3.map((week) => (
              <TableCell align="center" key={week}>
                {week}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
