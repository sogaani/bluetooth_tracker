//RSSI.js
const noble = require('noble');
const child_process = require('child_process');
const datastore = require(process.argv[2] + '/datastore');
const config = require('./config.json');

noble.on('stateChange', function (state) {
    if (state == 'poweredOn') {
        noble.startScanning();
    }
    else {
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {

    if (peripheral.address == config.mac) {
        noble.stopScanning();
        var timeout;
        peripheral.once('connect', function () {
            console.log('on -> connect');
            timeout = setTimeout(function () {
                const device = {
                    id: config.connect.id
                }
                datastore.commandDevice(config.uid, config.connect.command, device);
            }, 5000);
        });

        peripheral.once('disconnect', function () {
            clearTimeout(timeout);
            console.log('on -> disconnect');
            const device = {
                id: config.disconnect.id
            }
            datastore.commandDevice(config.uid, config.disconnect.command, device);
            noble.startScanning();
        });

        peripheral.connect();
    }
});