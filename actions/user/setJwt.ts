import { getTokenAndStorage } from "features/startup";

export default function setJwt(window: Window, { jwt }: { jwt: string }) {
  window[getTokenAndStorage(window).storage].setItem("access_token", jwt);
}
