import React from 'react';
import {Controller} from 'react-hook-form';
import {Button, Stack} from '@mui/material';
import {styled} from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';

/**
 * Custom Stack for displaying upload button and camera icon used for
 * uploading pictures.
 * @return {Stack} Rendered Stack.
 */
function CameraButtons({control, onChange, error,
  docketCheck, setDocketCheck}) {
  const Input = styled('input')({
    display: 'none',
  });

  return (
    <Stack
      direction="column"
      sx={{
        display: 'flex',
        paddingTop: '15px',
        alignItems: 'center',
        direction: 'row',
      }}
    >
      <label htmlFor="contained-button-file">
        <Controller
          name="docketPicture"
          control={control}
          rules={{required: 'Select an image'}}
          render={({field: {onChange}, fieldState: {error}}) => (
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple type="file"
              onChange={(e) => {
                onChange(e.target.files.item(0));
                setDocketCheck(1);
              }}
              error={error}
            />
          )}
        />
        <Button variant="contained" component="span"
          sx={{
            'backgroundColor': Colors.trasteNavyBlue,
            ':hover': {backgroundColor: Colors.trastePurple},
            'height': 20,
            'width': '5vw',
          }}>
            Upload
        </Button>
      </label>
      <Stack
        style={{display: 'flex'}}
        width='5vw'
        direction='row'
        spacing={2}
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
        }}>
        <label htmlFor="icon-button-file">
          <Controller
            name="docketPicture"
            control={control}
            rules={{required: 'Select an image'}}
            render={({field: {onChange}, fieldState: {error}}) => (
              <Input
                accept="image/*"
                id="icon-button-file"
                multiple type="file"
                onChange={(e) => {
                  onChange(e.target.files[0]);
                  setDocketCheck(1);
                }}
                error={error}
              />
            )}
          />
          <IconButton aria-label="upload picture" component="span"
            sx={{
              'color': Colors.trasteNavyBlue,
              ':hover': {color: Colors.trastePurple},
              'width': '5vw',
            }}>
            <PhotoCamera />
          </IconButton>
        </label>
        <CheckIcon
          sx={{
            paddingTop: 0.9,
            color: () => (docketCheck === 1 ?
                    Colors.trasteNavyBlue : Colors.trasteGreen),
          }}></CheckIcon>
      </Stack>
    </Stack>
  );
}

CameraButtons.defaultProps = {
  error: false,
};

CameraButtons.propTypes = {
  control: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.any.isRequired,
  setDocketCheck: PropTypes.any,
  docketCheck: PropTypes.any,
};

export default CameraButtons;