import React from 'react';
import {Modal} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A modal containg an image
 * @param {string} picture: the image being showed
 * @param {func} closeHandler: handles the closing of the modal
 * @param {bool} isOpen: a bool determining
 * if the modal should be open or closed
 * @return {*} Modal
 */
function ImageModal({picture, closeHandler, isOpen}) {
  return (
    <Modal
      open={isOpen}
      onClose={closeHandler}
      style={{display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', marginTop: '10vh'}}
    >
      <img src={picture} alt="Firestore Photo"
        width={'100%'} onClick={closeHandler}/>
    </Modal>);
}

ImageModal.propTypes = {
  picture: PropTypes.string,
  closeHandler: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default ImageModal;
