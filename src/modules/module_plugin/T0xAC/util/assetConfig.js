const app = getApp()
var baseImgApi = app.getGlobalConfig().baseImgApi;
var imageDoamin = (baseImgApi.url).split('/projects/')[0] + '/projects/sit/meiju-lite-assets/';

const leftRightAnglePopBtns = [ // 左风道摆风角度
  {
    img: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-un-angle1.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-heat-angle1.png',
      cool: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle1.png',
      fan: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle1.png',
      dry: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle1.png',
      auto: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle1.png',
    },
    angle: 1,
  },
  {
    img: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-un-angle2.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-heat-angle2.png',
      cool: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle2.png',
      fan: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle2.png',
      dry: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle2.png',
      auto: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle2.png',
    },
    angle: 25,
  },
  {
    img: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-un-angle3.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-heat-angle3.png',
      cool: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle3.png',
      fan: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle3.png',
      dry: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle3.png',
      auto: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle3.png',
    },
    angle: 50,
  },
  {
    img: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-un-angle4.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-heat-angle4.png',
      cool: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle4.png',
      fan: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle4.png',
      dry: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle4.png',
      auto: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle4.png',
    },
    angle: 75,
  },
  {
    img: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-un-angle5.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-heat-angle45png',
      cool: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle5.png',
      fan: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle5.png',
      dry: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle5.png',
      auto: imageDoamin + 'plugin/0xAC/left-lr-angle/' + 'left-cool-angle5.png',
    },
    angle: 100,
  },
]

const rightRightAnglePopBtns = [ // 左风道摆风角度
  {
    img: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-un-angle1.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-heat-angle1.png',
      cool: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle1.png',
      fan: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle1.png',
      dry: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle1.png',
      auto: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle1.png',
    },
    angle: 1,
  },
  {
    img: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-un-angle2.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-heat-angle2.png',
      cool: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle2.png',
      fan: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle2.png',
      dry: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle2.png',
      auto: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle2.png',
    },
    angle: 25,
  },
  {
    img: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-un-angle3.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-heat-angle3.png',
      cool: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle3.png',
      fan: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle3.png',
      dry: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle3.png',
      auto: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle3.png',
    },
    angle: 50,
  },
  {
    img: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-un-angle4.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-heat-angle4.png',
      cool: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle4.png',
      fan: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle4.png',
      dry: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle4.png',
      auto: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle4.png',
    },
    angle: 75,
  },
  {
    img: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-un-angle5.png',
    clickImg: {
      heat: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-heat-angle5.png',
      cool: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle5.png',
      fan: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle5.png',
      dry: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle5.png',
      auto: imageDoamin + 'plugin/0xAC/right-lr-angle/' + 'right-cool-angle5.png',
    },
    angle: 100,
  },
]

const T1T3UdAngle = [{
      img: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-un-angle1.png',    
      clickImg: {
        heat: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-heat-angle1.png',
        cool: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle1.png',
        fan: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle1.png',
        dry: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle1.png',
        auto: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle1.png',
      },     
      angle: 1,
    },
    {
      img: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-un-angle2.png',    
      clickImg: {
        heat: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-heat-angle2.png',
        cool: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle2.png',
        fan: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle2.png',
        dry: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle2.png',
        auto: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle2.png',
      },     
      angle: 25,
    },
    {
      img: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-un-angle3.png',    
      clickImg: {
        heat: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-heat-angle3.png',
        cool: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle3.png',
        fan: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle3.png',
        dry: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle3.png',
        auto: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle3.png',
      },     
      angle: 50,
    },
    {
      img: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-un-angle4.png',    
      clickImg: {
        heat: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-heat-angle4.png',
        cool: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle4.png',
        fan: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle4.png',
        dry: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle4.png',
        auto: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle4.png',
      },     
      angle: 75,
    },
    {
      img: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-un-angle5.png',    
      clickImg: {
        heat: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-heat-angle5.png',
        cool: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle5.png',
        fan: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle5.png',
        dry: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle5.png',
        auto: imageDoamin + 'plugin/0xAC/t1-t3-ud-angle/' + 'ud-cool-angle5.png',
      },     
      angle: 100,
    },
  ]

  export {
    leftRightAnglePopBtns,
    rightRightAnglePopBtns,
    T1T3UdAngle
  }
