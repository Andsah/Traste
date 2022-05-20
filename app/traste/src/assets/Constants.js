import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import {Colors} from './Colors.js';


export const binsizes = [
  {
    id: '0',
    label: 2,
  },
  {
    id: '1',
    label: 3,
  },
  {
    id: '2',
    label: 4,
  },
  {
    id: '3',
    label: 6,
  },
  {
    id: '4',
    label: 8,
  },
  {
    id: '5',
    label: 12,
  },
  {
    id: '6',
    label: 15,
  },
  {
    id: '7',
    label: 23,
  },
  {
    id: '8',
    label: 31,
  },
];

export const wasteTypes = {
  Wood: 0,
  Plastic: 0,
  Concrete: 0,
  Metal: 0,
  Other: 0,
};

export const longDate = {year: 'numeric', month: 'short', day: 'numeric'};

export const shortDate = {year: 'numeric', month: 'numeric', day: 'numeric'};

export const sites = [
  {
    id: '0',
    label: 'Sydney International Speedway',
  },
  {
    id: '1',
    label: 'Redfern Station Upgrade',
  },
  {
    id: '2',
    label: 'The Marker, Spencer St Melbourne',
  },
  {
    id: '3',
    label: 'St Catherine’s Junior School, Waverley ',
  },
];

export const successSx = {
  width: '100%',
  backgroundColor: Colors.trasteGreen,
  color: Colors.trasteNavyBlue,
  fontSize: 18,
};

export const warningSx = {
  width: '100%',
  backgroundColor: '#302f2fba',
  color: 'white',
  fontSize: 18,
};

export const errorSx = {
  width: '100%',
  backgroundColor: '#302f2fba',
  color: 'white',
  fontSize: 18,
};

export default {
  binsizes, wasteTypes, sites, successSx,
};

export const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const BootstrapDialogTitle = (props) => {
  const {children, onClose, ...other} = props;
  return (
    <DialogTitle sx={{m: 0, p: 2, alignContent: 'center'}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };
};
