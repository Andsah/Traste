import React from 'react';
import {Controller} from 'react-hook-form';
import {Button, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PropTypes from 'prop-types';
import {Colors} from '../assets/Colors';

/**
 * Custom Stack for displaying upload button and camera icon used for
 * uploading pictures.
 * @return {Stack} Rendered Stack.
 */
function CameraButtons({control, useStateValue, setUseStateFunc, buttonId,
  name, displayName, iconId, setURL}) {
  // Used for Input component.
  const Input = styled('input')({
    display: 'none',
  });

  return (
    <Stack
      direction="column"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'flex-end',
      }}>
      <Typography variant='caption'
        color={Colors.trasteNavyBlue}>{displayName}</Typography>

      {/* buttonId is a button that
      an user can click to upload a picture. */}
      <label htmlFor={buttonId}>
        <Controller
          name={name}
          control={control}
          render={({field: {onChange}, fieldState: {error}}) => (

            <Input
              accept="image/*"
              id={buttonId}
              multiple type="file"
              onChange={(e) => {
                onChange(e.target.files.item(0));
                setUseStateFunc(1);
                setURL(URL.createObjectURL(e.target.files[0]));
              }}
              error={error}
            />
          )}/>

        <Button
          variant="contained"
          component="span"
          startIcon={<AddPhotoAlternateIcon
            style={{color: 'white'}}/>}
          sx={{
            'backgroundColor': Colors.trasteNavyBlue,
            ':hover': {backgroundColor: Colors.trasteNavyLight},
            'height': 45, 'width': 120,
          }}
          endIcon={<CheckIcon
            sx={{
              color: () => (useStateValue === 1 ?
                      'white' : 'transparent'),
            }}>
          </CheckIcon>}>
          upload
        </Button>
      </label>
    </Stack>
  );
}

CameraButtons.propTypes = {
  control: PropTypes.any.isRequired,
  useStateValue: PropTypes.any.isRequired,
  setUseStateFunc: PropTypes.any.isRequired,
  buttonId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  iconId: PropTypes.string.isRequired,
  setURL: PropTypes.func.isRequired,
};

export default CameraButtons;
