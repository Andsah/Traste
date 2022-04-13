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
import {BootstrapDialog, BootstrapDialogTitle} from '../assets/Constants';
import {uploadImageAPI, createReportAPI} from '../api/trasteApi';
import {wasteTypes, successSx} from '../assets/Constants';
import {Colors} from '../assets/Colors.js';

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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClosed = () => {
    setOpen(false);
  };

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

  useEffect(() => {
    console.log(all);
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
    console.log('uploadPic RP, pic:', picture);
    const res = await uploadImageAPI
        .post('/uploadimage', picture).catch((e) => {
          console.log('error', e);
        });
    console.log('RP upload res.data:', res.data);
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
    console.log('the data being sent before', data);
    const outData = {...data};

    console.log('data innan tillagda bilder:', data);
    console.log('outData innan tillagda bilder:', outData);

    console.log('dock pic:', data.docketPicture);
    // Upload pictures to Firebase Storage.
    outData.docketPicture = await uploadPicture(data.docketPicture);
    outData.wastePicture = await uploadPicture(data.wastePicture);

    console.log('outData efter tillagda bilder:', outData);

    // Create new report and return response.
    return await createReportAPI.post('/createreport', outData);
  }

  // fungerar inte för t.ex. 10e+12
  const onlyNumbers = (score) => !isNaN(parseInt(score)) && isFinite(score);

  const onSubmit = (data) => {
    data = {
      ...data,
      timeStamps: new Date().toUTCString(),
      date: new Date(data.date).toDateString(),
    };

    sendReport(data).then((res) => {
      console.log('res:', res);
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
                secondary={new Date(all.date).toDateString()}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Docket number"
                secondary={all.docketNumber}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Weight"
                secondary={all.weight}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Bin size"
                secondary={all.binSize}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Site"
                secondary={all.site}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
          </List>
          <Divider
            sx={{backgroundColor: Colors.trasteNavyBlue}}/>
          <List sx={{pt: 0}}>
            <ListItem autoFocus>
              <ListItemText primary="Wood"
                secondary={all.wasteData['Wood'] + '%'}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Plastic"
                secondary={all.wasteData['Plastic'] + '%'}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Concrete"
                secondary={all.wasteData['Concrete'] + '%'}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Metal"
                secondary={all.wasteData['Metal'] + '%'}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
            <ListItem autoFocus>
              <ListItemText primary="Other"
                secondary={all.wasteData['Other'] + '%'}
                // primaryTypographyProps={{color: 'common.white'}}
                // secondaryTypographyProps={{color: 'common.white'}}
              />
            </ListItem>
          </List>
          <Divider sx={{backgroundColor: Colors.trasteNavyBlue}}/>
          <Container style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'}}>
            <Typography variant='h6' color="common.black">
                Docket picture
            </Typography>
            <CardMedia
              image={docketURL}
              sx={{height: '50vh',
                width: '80vw'}} />
            <Typography variant='h6' color="common.black">
                Waste picture
            </Typography>
            <CardMedia
              image={wasteURL}
              sx={{height: '50vh',
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
