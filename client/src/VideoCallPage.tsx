import React, {useEffect} from 'react'
import { ZoomMtg } from "@zoom/meetingsdk";
import { ZOOM_SETTINGS } from "./constant";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

export default function VideoCallPage() {
  const authEndpoint = ZOOM_SETTINGS.AUTH_ENDPOINT;
  const sdkKey = ZOOM_SETTINGS.SDK_KEY;
  const meetingNumber = "9296165223"; // TODO: list meeting id
  const passWord = "123"; 
  const role = 0;
  const userName = "React";
  const userEmail = "";
  const registrantToken = "";
  const zakToken = "";
  const leaveUrl = "http://localhost:3000";

  const getSignature = async () => {
    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
        }),
      });
      const res = await req.json();
      const signature = res.signature as string;
      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  function startMeeting(signature: string) {
    console.log(signature)
    document.getElementById("zmmtg-root").style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: unknown) => {
        console.log(success);
        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success);
          },
          error: (error: unknown) => {
            console.log(error);
          },
        });
      },
      error: (error: unknown) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    getSignature();
  }, []);

  return (
    <div>VideoCallPage</div>
  )
}
