import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} >
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label={props.label}
          format="dd/MM/yyyy"
          value={props.selectedDate}
          onChange={props.handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />

      </Grid>
    </MuiPickersUtilsProvider>
  );
}