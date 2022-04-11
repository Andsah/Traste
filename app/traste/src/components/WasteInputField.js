import React from 'react';
import {Controller} from 'react-hook-form';
import {Stack} from '@mui/material';
import MaterialField from './MaterialField';
import PropTypes from 'prop-types';

import {wasteTypes} from '../assets/Constants';

/**
 * Custom Stack for displaying waste data in a list.
 * @return {Stack} Rendered Stack.
 */
function WasteList({control, onlyNumbers}) {
  const outputlist = [];
  for (let i = 0; i < Object.keys(wasteTypes).length; i += 2) {
    if (i + 1 >= Object.keys(wasteTypes).length) {
      outputlist.push(
          <Stack direction="row" key={i + 'stack'}>
            <Controller
              name={'wasteData.' + Object.keys(wasteTypes)[i]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: {value: 100, message: 'Too large of a number'},
                min: {value: 0, message: 'No negative numbers'},
              }}
              render={({
                field: {onChange, value},
                fieldState: {error},
              }) => (
                <MaterialField
                  key={i}
                  label={Object.keys(wasteTypes)[i]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          </Stack>,
      );
    } else {
      outputlist.push(
          <Stack direction="row" spacing={2} key={i + 'stack'}>
            <Controller
              name={'wasteData.' + Object.keys(wasteTypes)[i]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: {value: 100, message: 'Too large of a number'},
                min: {value: 0, message: 'No negative numbers'},
              }}
              render={({
                field: {onChange, value},
                fieldState: {error},
              }) => (
                <MaterialField
                  key={i}
                  label={Object.keys(wasteTypes)[i]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
            <Controller
              name={'wasteData.' + Object.keys(wasteTypes)[i + 1]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: {value: 100, message: 'Too large of a number'},
                min: {value: 0, message: 'No negative numbers'},
              }}
              render={({
                field: {onChange, value},
                fieldState: {error},
              }) => (
                <MaterialField
                  key={i + 1}
                  label={Object.keys(wasteTypes)[i + 1]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          </Stack>,
      );
    }
  }

  return (
    <Stack direction="column" spacing={2} sx={{width: '90vw'}}>
      {outputlist}
    </Stack>
  );
}

WasteList.propTypes = {
  control: PropTypes.any.isRequired,
  onlyNumbers: PropTypes.func.isRequired,
};

export default WasteList;

