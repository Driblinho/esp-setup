const PythonShell = require('python-shell');


class Firmware {


    constructor(deviceName = '/dev/ttyUSB0') {
        this._deviceName = deviceName;

        this._timeout = 60000;

        this.optionsErase = {
            args: [
                '--port',
                this._deviceName,
                'erase_flash'    
            ]
        };
    
        this.optionsFlash = {
            args: [
                '--port',
                this._deviceName,
                '--baud',
                '115200',
                'write_flash',
                '--verify',
                '--flash_freq',
                '40m',
                '--flash_mode',
                'qio',
                '--flash_size',
                '1MB',
                '0x0000',
                './lib/boot_v1.6.bin',
                '0x1000',
                './lib/espruino_esp8266_user1.bin',
                '0xFC000', 
                './lib/esp_init_data_default.bin',
                '0xFE000', 
                './lib/blank.bin'
            ]
        };
    }


    _runEsptool(Options) {
        console.log("Flash witch", this._deviceName);
        
        return new Promise((resolve, reject) => {
            
            let timeoutID = setTimeout(() => {
                    reject('Time Out');
            },this._timeout);
            
            let shell = new PythonShell('lib/esptool.py', Options);
              
              shell.on('error', function (err) {
                  reject('Permission denied or could not open port')
              });

              shell.on('message', function (message) {
                console.log(message);
             });
              
              shell.on('close', () =>  {
                  clearTimeout(timeoutID);
                  resolve(true);
              });

        });
    }


    erase() {
        return this._runEsptool(this.optionsErase);
    }

    flash() {
        return this._runEsptool(this.optionsFlash);
    }

}

module.exports = Firmware;