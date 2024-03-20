import React, {Fragment, useCallback} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

type QRScannerProps = {
  setScanned: (value: string) => void;
};

const QRScanner = ({setScanned}: QRScannerProps) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      const value = codes[0]?.value;
      if (value == null) {
        return;
      }
      setScanned(value);
    },
    [setScanned],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  if (!hasPermission) {
    return <Text onPress={requestPermission}>Request camera permission</Text>;
  }

  if (device == null) {
    return <Text>No camera device available</Text>;
  }
  return (
    <Fragment>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        enableZoomGesture={true}
      />
    </Fragment>
  );
};
export default QRScanner;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});
