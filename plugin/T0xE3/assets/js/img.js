import {
  imgBaseUrl
} from "../../../../api";
const newPre = imgBaseUrl.url + "/plugin/0xE3/";

const imgs = {
  powerOn: "powerOn@2x.png",
  temSet: "temSet@2.png",
  noneSub: "noneSub.png",
  powerOffBg: "meiGrayBg.png",
  aiColdWater: "aiColdWater.png",
  coldWater: "coldWaterMeiOn.png",
  ai: "ai.png",
  diy: "diy.png",
  warning: "warning@2x.png",
  doneYellow: "doneYellow.png",
  running: "running.png",
  heating: "heating.png",
};

let rs = {};
Object.keys(imgs).forEach((key) => {
  rs[key] = newPre + imgs[key];
});

export default rs;