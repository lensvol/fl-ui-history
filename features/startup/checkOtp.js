/* eslint-disable no-console, no-param-reassign */
import qs from "query-string";

export default function checkOtp(window) {
  const {
    location: { search },
  } = window;
  const { otp } = qs.parse(search);

  if (otp) {
    console.info("OTP found, setting and reloading");
    // OTP only gets to set in session storage
    window.sessionStorage.setItem("access_token", otp);
    const { protocol, host } = window.location;
    window.location = `${protocol}//${host}`;
  }
}
