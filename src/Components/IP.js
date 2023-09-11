import React, { useState, useEffect } from "react";

const IP = () => {
  const [localIPAddress, setLocalIPAddress] = useState("");
  const [publicIPAddress, setPublicIPAddress] = useState("");

  useEffect(() => {
    // get local IP address
    const getLocalIPAddress = async () => {
      const pc = new RTCPeerConnection();
      const candidate = await pc.createOffer();
      pc.setLocalDescription(candidate);
      const localIPAddress = candidate.sdp.match(
        /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
      )[0];
      setLocalIPAddress(localIPAddress);
    };
    getLocalIPAddress();

    // get public IP address
    const getPublicIPAddress = async () => {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const publicIPAddress = data.ip;
      setPublicIPAddress(publicIPAddress);
    };
    getPublicIPAddress();
  }, []);

  return (
    <div>
      <p>Local IP address: {localIPAddress}</p>
      <p>Public IP address: {publicIPAddress}</p>
    </div>
  );
};

export default IP;
