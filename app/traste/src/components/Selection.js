import React from 'react';
import PropTypes from 'prop-types';
import {TextField, MenuItem} from '@mui/material';

/**
 * Custom TextField for displaying a selectionbox with different alternatives.
 * @param {*} label Name of field.
 * @param {*} value Starting value.
 * @param {*} onChange Handler.
 * @param {*} error What will be shown for the error.
 * @param {*} data A list of data to be displayed.
 * @return {TextField} Rendred field.
 */
function Selection({label, value, onChange, error, data}) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={onChange}
      sx={{
        marginTop: '15px',
        backgroundColor: 'rgba(255,255,255,0.3)',
        width: '90vw',
      }}
      // required
      inputProps={{'data-testid': 'selectionfield'}}
      error={!!error}
      // helperText={error ? error.message : null}
    >
      {
        /** Placeholde ifall det inte finns någon data */
        data !== undefined ? (
          data.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem key={0}>Ingen data</MenuItem>
        )
      }
    </TextField>
  );
}

Selection.propTypes = {
  label: PropTypes.func.isRequired,
  value: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
  data: PropTypes.func.isRequired,
};

export default Selection;
