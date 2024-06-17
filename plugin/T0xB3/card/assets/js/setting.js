import imgs from './img.js';
export const modes = {
    ozone_disinfect: { // 臭氧杀菌
        name: '杀菌', key: 'ozone_disinfect', mode: 1, time: 10,
        desc: '',
        img: {
            type_off: imgs.ozone_disinfect_off,
            type_on: imgs.ozone_disinfect_on,
            off: imgs.ozone_disinfect_sub_off,
            on: imgs.ozone_disinfect_sub_on,
        },
    },
    drying: { // 烘干
        name: '烘干', key: 'drying', mode: 2, time: 10,
        desc: '烘干功能：通过加热烘干餐具表面的水分，可以保持餐具表面干燥无水渍，这样取出来的餐具让人用起来非常放心',
        img: {
            type_off: imgs.drying_off,
            type_on: imgs.drying_on,
            off: imgs.drying_sub_off,
            on: imgs.drying_sub_on,
        },
    },
    uperization: { // 高温消毒
        name: '消毒', key: 'uperization', mode: 3, time: 60,
        desc: '消毒功能：通过高温消毒可以消灭餐具表面大量细菌，保证餐具干净清洁可用',
        img: {
            type_off: imgs.uperization_off,
            type_on: imgs.uperization_on,
            off: imgs.uperization_sub_off,
            on: imgs.uperization_sub_on,
        },
    },
    warmdisk: {
        name: '暖碟', key: 'warmdisk', mode: 4, time: 10,
        desc: '暖碟功能：上下室体同时工作，可以让餐具保持最合适的37°，这样取出来的餐具拿到手里还有恰到好处的暖暖的感觉，让人用起来非常放心、温心',
        img: {
            type_off: imgs.warmdisk_off,
            type_on: imgs.warmdisk_on,
            off: imgs.warmdisk_sub_off,
            on: imgs.warmdisk_sub_on,
        },
    },
    clean: { // 保洁
        name: '保洁', key: 'clean', mode: 5, time: 80,
        desc: '保洁功能: 通过保洁功能，可使餐具更加干净清洁',
        img: {
            type_off: imgs.clean_off,
            type_on: imgs.clean_on,
            off: imgs.clean_sub_off,
            on: imgs.clean_sub_on,
        },
    },
};

const setting = {
    '000XC801': {
        hasPowerBtn: false, // 是否有开关机按钮
        equipment: [{
            name: '消毒柜',
            key: 'upstair',
            items: [
                {key:'uperization', time: 80}, 
                {key:'drying', time: 60}
            ],
        }],
    },
    '000XC802': {
        hasPowerBtn: false,
        equipment: [{
            name: '上室',
            key: 'upstair',
            items: [
                {key:'clean', time: 80}, 
                // {key:'drying', time: 60}
            ],
        }, {
            name: '下室',
            key: 'downstair',
            items: [
                {key:'uperization', time: 60}, 
            ],
        }],
    },
    // '000XC802': {
    //     equipment: [{
    //         name: '上室',
    //         key: 'upstair',
    //         mode: '',
    //         items: [
    //             // {key:'clean', time: 80}, 
    //             {key:'drying', time: 60}
    //         ],
    //     }],
    // },
}


export const getSetting = function (code) {
    return setting[code]
}

export const getEquipments = function (code) {
    let equipments = setting[code] ? setting[code].equipment : [];
    return equipments.map(eq => ({
        ...eq,
        mode: eq.items[0].key,
        items: eq.items.map(x => Object.assign({}, modes[x.key], x))
    }));
}