import React, {useState, useEffect} from 'react';
import {
  Typography,
  Stack,
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import MaterialField from '../components/MaterialField';
import {useForm, Controller} from 'react-hook-form';
import Inputfield from '../components/Inputfield';
import Selection from '../components/Selection';
import {Colors} from '../assets/Colors';
import SendIcon from '@mui/icons-material/Send';

import PropTypes from 'prop-types';

import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import axios from 'axios';

import {useNavigate} from 'react-router-dom';

const binsizes = [
  {
    id: '0',
    label: 5,
  },
  {
    id: '1',
    label: 10,
  },
  {
    id: '2',
    label: 15,
  },
  {
    id: '3',
    label: 20,
  },
];
const sites = [
  {
    id: '0',
    label: 'Linköping',
  },
  {
    id: '1',
    label: 'Norrköping',
  },
  {
    id: '2',
    label: 'Gustavsberg',
  },
  {
    id: '3',
    label: 'Vetlanda',
  },
];

/**
 * ReportPage renders the report form for a waste report.
 * @param {*} snackBarHandler Shows a snackbar pop up on report send.
 * @return {form} Returns the form that renders the report page.
 */
function ReportPage({snackBarHandler}) {
  const wasteTypes = {
    Wood: 0,
    Plastic: 0,
    Concrete: 0,
    Metal: 0,
    Other: 0,
  };

  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const {
    handleSubmit,
    control,
    watch,
    formState: {isValid},
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      date: new Date().toDateString(),
      docketNumber: '',
      docketPicture: 'NULL',
      wastePicture: 'NULL',
      name: 'NULL',
      weight: '',
      binSize: '',
      site: '',
      wasteData: {...wasteTypes},
      timeStamps: 'NULL',
    },
  });
  const all = watch(control);

  /**
   * sendReport will send the data from the form to the backend.
   * @param {*} data all data from the form.
   */
  async function sendReport(data) {
    await axios({
      method: 'post',
      url: 'https://europe-west3-traste-71a71.cloudfunctions.net/app/createreport',
      data: data,
    }).then(function(response) {
      console.log(response.data);
    });
  }

  useEffect(() => {
    let tmp = 0;
    Object.values(all.wasteData).forEach((item) => {
      if (!isNaN(parseInt(item))) {
        tmp += parseInt(item, 10);
      }
    });
    setTotal(tmp);
  }, [all]);

  // fungerar inte för t.ex. 10e+12
  const onlyNumbers = (score) => !isNaN(parseInt(score)) && isFinite(score);
  const onSubmit = (data) => {
    data = {
      ...data,
      timeStamps: new Date().toUTCString(),
      date: new Date(data.date).toDateString(),
    };
    sendReport(data);
    console.log(data);
    snackBarHandler();
    navigate('/');
  };

  /**
   * Renders the inputboxes for the different types of wastes.
   * @return {Stack} is returned containing all MaterialFields.
   */
  function renderWasteList() {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Controller
          name="date"
          control={control}
          rules={{required: 'Select a valid date'}}
          render={({field: {onChange, value}}) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date"
                name="Date"
                value={value}
                autoOK
                minDate={new Date('2000-01-01T03:00:00')}
                maxDate={new Date()}
                onChange={onChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      marginTop: '15px',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      width: '90vw',
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />

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
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          rules={{
            required: 'Enter a valid number',
            validate: onlyNumbers,
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <Inputfield
              label="Weight"
              onChange={(e) => {
                let tmpval = e.target.value;
                if (isNaN(parseInt(e.target.value, 10))) {
                  tmpval = 0;
                } else {
                  tmpval = parseInt(tmpval, 10);
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
          rules={{required: 'Select a bin size'}}
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
          rules={{required: 'Select a site'}}
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
        <Typography
          variant="h3"
          sx={{textAlign: 'center', marginTop: '10px', marginBottom: '10px'}}
        >
          Waste Types
        </Typography>
        {renderWasteList()}
        <Stack
          direction="column"
          justifyContent="center"
          alignContent="stretch"
          sx={{marginTop: '15px', width: '100vw', flexGrow: '2'}}
        >
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
            direction="row"
          >
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
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  fontSize={16}
                  fontWeight="bold"
                  sx={{color: 'white'}}
                >
                  {`${Math.round(total)}%`}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Button
        endIcon={
          <SendIcon
            sx={{
              color: Colors.trasteNavyBlue,
              fontSize: '200px',
              width: 40,
              height: 40,
            }}
          />
        }
        disabled={total !== 100}
        type="submit"
        sx={{
          flex: '1',
          display: 'flex',
          position: 'sticky',
          bottom: 0,
          alignItems: 'center',
          aligntContent: 'stretch',
          justifyContent: 'space-around',
          width: 1,
          zIndex: 2,
          backgroundColor:
            isValid && total === 100 ?
              Colors.trastePurple :
              Colors.trasteDadada,
          borderRadius: '0',
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        <Typography variant="h4" sx={{color: Colors.trasteNavyBlue}}>
          Send Report
        </Typography>
      </Button>
    </form>
  );
}

ReportPage.propTypes = {
  snackBarHandler: PropTypes.any.isRequired,
};

export default ReportPage;
