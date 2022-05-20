import React, {useState} from 'react';
import {
  Typography,
  Stack,
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';
import {Controller} from 'react-hook-form';
import Inputfield from './Inputfield';
import Selection from './Selection';
import {Colors} from '../assets/Colors';
import SendIcon from '@mui/icons-material/Send';

import PropTypes from 'prop-types';

import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Own files
import {binsizes, sites} from '../assets/Constants';
import WasteInputField from './WasteInputField';
import CameraButtons from './CameraButtons';

/**
 * ReportForm renders the report form for a waste report.
 * @param {func}  handleSubmit a snackbar pop up on report send.
 * @param {func}  onSubmit a snackbar pop up on report send.
 * @param {bool}  isValid a snackbar pop up on report send.
 * @param {bool}  onlyNumbers a snackbar pop up on report send.
 * @param {func}  handleClickOpen a snackbar pop up on report send.
 * @return {form} Returns the form that renders the report page.
 */
function ReportForm({handleSubmit, onSubmit, control, total, isValid,
  onlyNumbers, onlyFloats, handleClickOpen, setDocketURL, setWasteURL}) {
  const [docketCheck, setDocketCheck] = useState(0);
  const [wasteCheck, setWasteCheck] = useState(0);

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      id='report-form'>
      <Stack
        sx={{
          display: 'flex',
          marginLeft: '15px',
          marginRight: '15px',
          alignItems: 'center',
          flexDirection: 'column',
          bgcolor: Colors.trasteGreen,
          padding: 0,

        }}>
        <Paper elevation={0}
          sx={{display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            width: '85vw', maxWidth: '600px', padding: '20px',
            marginTop: '15px', paddingTop: '4px',
            backgroundColor: 'rgba(255,255,255,0.4)'}}>
          <Container style={{display: 'flex', m: 0, p: 0}}
            direction='row'
            disableGutters={true}
            sx={{
              paddingLeft: '0px',
              paddingRight: '0px',
              alignItems: 'flex-start',
              justifyContent: 'space-between'}}>
            <Typography
              variant="h4"
              sx={{align: 'left', marginTop: '15px', marginBottom: '0px',
                color: Colors.trasteNavyBlue}}>General Information
            </Typography>
          </Container>
          <Controller
            name="date"
            control={control}
            render={({field: {onChange, value}}) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Date"
                  name="Date"
                  value={value}
                  inputFormat='dd/MM/yyyy'
                  autoOK
                  minDate={new Date('2000-01-01T03:00:00')}
                  maxDate={new Date()}
                  onChange={onChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        marginTop: '15px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />

          <Container
            style={{display: 'flex'}}
            direction='row'
            disableGutters={true}
            sx={{
              paddingLeft: '0px',
              paddingRight: '0px',
              alignItems: 'flex-start',
            }}>

            <Controller
              name="docketNumber"
              control={control}
              rules={{required: 'Docket Number required'}}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Inputfield
                  label="Docket No."
                  onChange={onChange}
                  value={value}
                  error={error}
                  sx={{flexGrow: 1,
                    marginTop: '15px',
                    marginRight: '15px',
                    backgroundColor: 'rgba(255,255,255,0.3)'}}
                />
              )}
            />

            <CameraButtons
              control={control}
              useStateValue={docketCheck}
              setUseStateFunc={setDocketCheck}
              buttonId={'contained-button-file'}
              name={'docketPicture'}
              displayName={'Docket Picture'}
              iconId={'icon-button-file'}
              setURL={setDocketURL}
            />
          </Container>

          <Controller
            name="weight"
            control={control}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Inputfield
                label="Weight"
                onChange={(e) => {
                  let tmpval = e.target.value;
                  if (isNaN(parseFloat(e.target.value, 10))) {
                    tmpval = 0;
                  } else {
                    tmpval = parseFloat(tmpval, 10);
                  }
                  onChange(tmpval);
                }}
                value={value}
                error={error}
                type="number"
              />
            )}
          />

          <Controller
            name="binSize"
            control={control}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Selection
                label="Bin Size"
                data={binsizes}
                onChange={onChange}
                value={value}
                error={error}
              />
            )}
          />

          <Controller
            name="site"
            control={control}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Selection
                label="Site"
                data={sites}
                onChange={onChange}
                value={value}
                error={error}
              />
            )}
          />
        </Paper>
        <Paper elevation={0}
          sx={{display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            width: '85vw', maxWidth: '600px', padding: '20px',
            marginTop: '15px', paddingTop: '4px',
            backgroundColor: 'rgba(255,255,255,0.4)'}}>
          <Container
            style={{display: 'flex', m: 0, p: 0}}
            direction='row'
            disableGutters={true}
            sx={{
              paddingLeft: '0px',
              paddingRight: '0px',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
            <Typography
              variant="h4"
              sx={{align: 'center', marginTop: '15px', marginBottom: '0px',
                color: Colors.trasteNavyBlue}}>
            Waste Types
            </Typography>
            <CameraButtons
              control={control}
              useStateValue={wasteCheck}
              setUseStateFunc={setWasteCheck}
              buttonId={'waste-button-file'}
              name={'wastePicture'}
              displayName={'Waste Picture'}
              iconId={'waste-icon-button-file'}
              setURL={setWasteURL}
            />
          </Container>
          <WasteInputField control={control} onlyNumbers={onlyNumbers} />
        </Paper>
      </Stack>

      <Stack
        sx={{
          paddingLeft: 0,
          paddingRight: 0,
          flexDirection: 'column',
          marginTop: '15px',
          flexGrow: '2',
          position: 'sticky',
          justifyContent: 'flex-end',
          bottom: 0,
          display: 'flex',
          zIndex: 2,
          flex: '1',
          bgcolor: Colors.trasteGreen,
        }}>

        <Stack
          sx={{
            flex: '1',
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: Colors.trasteNavyBlue,
            color: 'white',
            paddingTop: 1,
            paddingBottom: 1,
          }}
          direction="row">

          <Typography variant="h4">Waste total: </Typography>

          <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress
              variant="determinate"
              value={total > 100 ? 100 : total}
              size={60}
              thickness={5}
              sx={{color: total > 100 ? 'red' : Colors.trasteGreen}}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>

              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                fontSize={16}
                fontWeight="bold"
                sx={{color: 'white'}}>
                {`${Math.round(total)}%`}
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Button
          endIcon={
            <SendIcon
              sx={{
                color: isValid && total === 100 ?
                Colors.trasteNavyBlue :
                'rgba(0,50,0,0.2)',
                fontSize: '200px',
                width: 40,
                height: 40,
              }}
            />
          }
          disabled={!isValid || total !== 100}
          // type="submit"
          sx={{
            'flex': '1',
            'display': 'flex',
            'position': 'sticky',
            'alignItems': 'center',
            'aligntContent': 'stretch',
            'justifyContent': 'space-around',
            'width': 1,
            'zIndex': 2,
            'backgroundColor':
            isValid && total === 100 ?
              Colors.trastePurple :
              'rgba(255,255,255,0.4)',
            'borderRadius': '0',
            'paddingTop': 1,
            'paddingBottom': 1,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.5)'},
          }}
          onClick={handleClickOpen}
        >

          <Typography
            variant="h4"
            sx={{color: isValid && total === 100 ?
              Colors.trasteNavyBlue :
              'rgba(0,50,0,0.2)'}}>
            Send Report
          </Typography>
        </Button>
      </Stack>
    </form>
  );
}

ReportForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  total: PropTypes.number.isRequired,
  isValid: PropTypes.bool.isRequired,
  onlyNumbers: PropTypes.func.isRequired,
  onlyFloats: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  setDocketURL: PropTypes.func.isRequired,
  setWasteURL: PropTypes.func.isRequired,
};

export default ReportForm;
