import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Divider, List, ListItem,
  ListItemText, CardMedia, Container, Typography} from '@mui/material';


import PropTypes from 'prop-types';

import {useNavigate} from 'react-router-dom';

// Own files
import ReportForm from '../components/ReportForm.js';
import {BootstrapDialog,
  BootstrapDialogTitle,
  longDate} from '../assets/Constants';
import {uploadImageAPI, createReportAPI} from '../api/trasteApi';
import {wasteTypes, successSx} from '../assets/Constants';
import {Colors} from '../assets/Colors.js';
import CustomChart from '../components/Chart.js';

/**
 * ReportPage renders the report form for a waste report.
 * @param {*} snackBarHandler Shows a snackbar pop up on report send.
 * @return {div}
 */
function ReportPage({snackBarHandler}) {
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);

  const [docketURL, setDocketURL] = useState('');
  const [wasteURL, setWasteURL] = useState('');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClosed = () => setOpen(false);

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
      docketPicture: '',
      wastePicture: '',
      name: '',
      weight: null,
      binSize: null,
      site: '',
      wasteData: {...wasteTypes},
      timeStamps: '',
    },
  });
  const all = watch(control);

  const labelArray = ['Wood', 'Plastic', 'Concrete', 'Metal', 'Other'];
  const seriesArray = [all.wasteData['Wood'],
    all.wasteData['Plastic'], all.wasteData['Concrete'],
    all.wasteData['Metal'], all.wasteData['Other']];

  /**
   * Keeps track of changes to the wastedata inputs and then updated the
   * total procentage of materials.
   */
  useEffect(() => {
    let tmp = 0;
    Object.values(all.wasteData).forEach((item) => {
      if (!isNaN(parseInt(item))) {
        tmp += parseInt(item, 10);
      }
    });
    setTotal(tmp);
  }, [all]);


  /**
   * uploadPicture will upload an image to firebase storage.
   * @param {Object} picture Picture to be uploaded.
   */
  async function uploadPicture(picture) {
    const res = await uploadImageAPI
        .post('', picture).catch((e) => {
          console.log('error', e);
        });
    return res.data.imgUrl;
  }

  /**
   * sendReport will send the data from the form to the backend.
   * http://localhost:5001/traste-71a71/europe-west3/app/uploadimage
   * https://europe-west3-traste-71a71.cloudfunctions.net/app/createreport
   * @param {*} data All data from the form.
   * @return {Object} The response message from traste API.
   */
  async function sendReport(data) {
    const report = {...data};
    console.log('sent report', report);
    // Upload pictures to Firebase Storage.
    report.docketPicture = await uploadPicture(data.docketPicture);
    report.wastePicture = await uploadPicture(data.wastePicture);

    // Create new report and return response.
    return await createReportAPI.post('', report);
  }

  // fungerar inte för t.ex. 10e+12
  const onlyNumbers = (score) => !isNaN(parseInt(score)) && isFinite(score);
  const onlyFloats = (score) => !isNaN(parseFloat(score)) && isFinite(score);

  const onSubmit = (data) => {
    data = {
      ...data,
      timeStamps: new Date().toUTCString(),
      date: new Date(data.date).toDateString(),
    };

    sendReport(data).then((res) => {
      if (res.status === 200) {
        if (res.data.msg === 'Report was made') {
          snackBarHandler(
              'Report was sent!',
              'success',
              successSx,
          );
        } else { // When res.body.msg === 'Report already exists'.
          snackBarHandler(
              'An report with that docketnumber already exists!',
              'warning',
          );
        }
      }
    }).catch( (error) => {
      snackBarHandler('An Error occured, report was not sent',
          'error');
    });
    navigate('/');
  };

  return (
    <div>
      <ReportForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        total={total}
        isValid={isValid}
        onlyNumbers={onlyNumbers}
        onlyFloats={onlyFloats}
        handleClickOpen={handleClickOpen}
        setDocketURL={setDocketURL}
        setWasteURL={setWasteURL}
      />

      <BootstrapDialog
        onClose={handleClosed}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{style: {
          backgroundColor: Colors.trasteGreen,
          boxShadow: 'none'}}}
        // fullScreen='true'
        sx={{backdropFilter: 'blur(40px)'}}
      >
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClosed}
          sx={{backgroundColor: Colors.trasteNavyBlue}}
        >
          <Typography variant='h5' color="common.white" align="center">
        Confirm Report
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers
          sx={{borderColor: Colors.trasteNavyBlue, overflow: 'hidden',
            overflowY: 'scroll'}}>
          <List sx={{pt: 0}}>
            <ListItem autoFocus>
              <ListItemText primary="Date"
                secondary={new Date(all.date)
                    .toLocaleDateString('en-AU', longDate)}
                primaryTypographyProps={{color: Colors.trasteNavyBlue}}
                secondaryTypographyProps={{color: Colors.trasteNavyLight}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Docket number"
                secondary={all.docketNumber}
                primaryTypographyProps={{color: Colors.trasteNavyBlue}}
                secondaryTypographyProps={{color: Colors.trasteNavyLight}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Weight"
                secondary={all.weight}
                primaryTypographyProps={{color: Colors.trasteNavyBlue}}
                secondaryTypographyProps={{color: Colors.trasteNavyLight}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Bin size"
                secondary={all.binSize}
                primaryTypographyProps={{color: Colors.trasteNavyBlue}}
                secondaryTypographyProps={{color: Colors.trasteNavyLight}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Site"
                secondary={all.site}
                primaryTypographyProps={{color: Colors.trasteNavyBlue}}
                secondaryTypographyProps={{color: Colors.trasteNavyLight}}
              />
            </ListItem>
          </List>
          <Divider
            sx={{color: Colors.trasteNavyBlue}}>
            <Typography variant='h6' color={Colors.trasteNavyBlue}>
            Waste Data
            </Typography></Divider>
          <CustomChart labels={labelArray}
            seriesData={seriesArray}
            chartColor={[Colors.trasteNavyLight,
              Colors.trasteBlue,
              Colors.trasteTeal,
              Colors.trasteDarkPurple,
              Colors.trastePurple]}
            labelColor={['white',
              'white',
              'white',
              'white',
              'white']}
            size='120%'
            marginLeft={0}
            foreColor={Colors.trasteNavyBlue}/>
          <Divider sx={{color: Colors.trasteNavyBlue}}>
            <Typography variant='h6' color={Colors.trasteNavyBlue}>
                Docket picture
            </Typography></Divider>
          <Container style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 0}}>
            <CardMedia
              image={docketURL}
              component='img'
              sx={{maxWidth: '400px',
                width: '80vw'}} />
            <Divider sx={{color: Colors.trasteNavyBlue, width: '100%'}}>
              <Typography variant='h6' color={Colors.trasteNavyBlue}>
                Waste picture
              </Typography></Divider>
            <CardMedia
              image={wasteURL}
              component='img'
              sx={{maxWidth: '400px',
                width: '80vw'}} />
          </Container>
        </DialogContent>
        <DialogActions sx={{backgroundColor: Colors.trasteNavyBlue}}>
          <Button autoFocus type="submit" onClick={handleClosed}
            form='report-form'
            sx={{width: '100vw', color: 'common.white',
              backgroundColor: Colors.trasteNavyBlue, m: 0, p: 1}}>
            <Typography variant='h6' color="common.white">
                Send Report
            </Typography>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

ReportPage.propTypes = {
  snackBarHandler: PropTypes.any.isRequired,
};


export default ReportPage;
