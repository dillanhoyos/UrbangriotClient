import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserQRCodeReader } from '@zxing/library';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

const QRScanner = () => {
  const webcamRef = useRef(null);
  const [isCameraActive, setCameraActive] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(null); // State to track camera permission
  const [isScanning, setIsScanning] = useState(false); // State to show scanning status
  const [scanStatus, setScanStatus] = useState(''); // State to show scan result
  const isDesktop = useMediaQuery('(min-width:1024px)');

  useEffect(() => {
    testCameraPermission();
  }, []);

  const testCameraPermission = async () => {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
    }
  };

  const handleScan = async () => {
    if (webcamRef.current) {
      setIsScanning(true);
      const screenshot = webcamRef.current.getScreenshot();
      const qrReader = new BrowserQRCodeReader();
      try {
        const result = await qrReader.decodeFromImageUrl(screenshot);
        if (result) {
          setScanStatus(result.getText());
          setCameraActive(false); // Stop camera after detecting QR code
        } else {
          setScanStatus('No QR code detected.');
        }
      } catch (err) {
        console.error('Error scanning QR code:', err);
        setScanStatus('Error scanning QR code.');
      } finally {
        qrReader.reset();
        setIsScanning(false);
      }
    }
  };

  const videoConstraints = {
    width: isDesktop ? 700 : '100%', // Set a larger width for desktop and full width for mobile
    height: isDesktop ? 500 : 'auto', // Set a larger height for desktop and maintain aspect ratio for mobile
    aspectRatio: 4 / 3,
    facingMode: 'environment',
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      padding={2}
    >
      {/* Camera permission test button */}
      <Button
        variant="contained"
        color="primary"
        onClick={testCameraPermission}
        style={{ marginBottom: '1rem' }}
      >
        Test Camera Permission
      </Button>

      {/* Display camera access status */}
      {hasCameraPermission === true && (
        <Typography variant="body1" color="green">Camera access granted!</Typography>
      )}
      {hasCameraPermission === false && (
        <Typography variant="body1" color="red">Unable to access camera. Please check permissions.</Typography>
      )}

      {/* Render webcam if camera permission is granted and camera is active */}
      {isCameraActive && hasCameraPermission && (
        <Box
          maxWidth={isDesktop ? '800px' : '100%'} // Set max width for desktop and full width for mobile
          width="100%"
          marginBottom={2}
        >
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={(error) => {
              console.error('Camera not accessible:', error);
              setHasCameraPermission(false);
            }}
          />
        </Box>
      )}

      {/* Scan QR Code button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleScan}
        disabled={!isCameraActive || !hasCameraPermission || isScanning}
      >
        {isScanning ? 'Scanning...' : 'Scan QR Code'}
      </Button>

      {/* Display scan status */}
      {scanStatus && (
        <TextField
          value={scanStatus}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
      )}
    </Box>
  );
};

export default QRScanner;
