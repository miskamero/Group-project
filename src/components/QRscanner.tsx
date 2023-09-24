import React, { useEffect, useRef } from 'react';
import {Html5QrcodeScanner} from "html5-qrcode";

const QRscanner: React.FC = () => {
    const qrRef = useRef<any>(null);
    
    useEffect(() => {
        const qrCodeSuccessCallback = (decodedText: string) => {
        // handle the decoded text as you want
        console.log(`QR Code detected: ${decodedText}`);
        };
    
        const config = { fps: 10, qrbox: 250 };
    
        const qrCodeScanner = new Html5QrcodeScanner(
        "qr-reader", config);
        qrCodeScanner.render(qrRef.current, qrCodeSuccessCallback);
    }, []);
    
    return (
        <div>
        <div id="qr-reader" ref={qrRef}></div>
        </div>
    );
    
};

export default QRscanner;
