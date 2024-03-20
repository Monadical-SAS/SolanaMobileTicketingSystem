import React from 'react';
import QRCode from 'react-native-qrcode-svg';

type QRGeneratorProps = {
  value: string;
};

const QRGenerator = ({value}: QRGeneratorProps) => {
  return <QRCode value={value} size={300} />;
};

export default QRGenerator;
