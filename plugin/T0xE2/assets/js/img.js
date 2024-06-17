import { imgBaseUrl } from "../../../../api";
const newPre = imgBaseUrl.url + "/plugin/0xE2/";

const imgs = {
  powerOn: "powerOn@2x.png",
  circleBlue: "circle-blue.json",
  temSet: "temSet@2.png",
  cloudHome: "cloudHome.png",
  appointOn: "appointOn@2x.png",
  noneSub: "noneSub.png",
  powerOffBg: "poweredOff3x.png",
  circleYellow: "circleYellow.png",
  highTemperature: "highTemperature.png",
  warning: "warning@2x.png",
};

let rs = {};
Object.keys(imgs).forEach((key) => {
  rs[key] = newPre + imgs[key];
});

export default rs;
