import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import '../QRscanner.scss';

const QRscanner: React.FC = () => {    
  function onScanSuccess(decodedText: any, decodedResult: any) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
    let regex: string = "^http:\/\/localhost:5173\/.*$"

    if(decodedText.match(regex)){
      window.location.href = decodedText;
    } else {
      alert("Invalid QR Code");
    }
  }

  function onScanFailure(error: any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 300, height: 300 } },
      /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      // Cleanup when the component unmounts
        html5QrcodeScanner.clear();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <>
      <div>
        <div id="reader"></div>
      </div>
    </>
  );
};

export default QRscanner;
