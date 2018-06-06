const program = require('commander');
const  Firmware = require('./firmware'); 





program
  .option('-p, --port [newPort]', 'Define port /dev/ttyUSB0')
  .parse(process.argv);

  let firmware;

  if(program.port) firmware = new Firmware(program.port);
  else firmware = new Firmware();

const _hashs = '##########################################';
console.log('Erase ESP and flash new Firmware');

firmware.erase()
    .then(()=> {
        console.log(_hashs);     
        console.log('Re-Plug ESP8266 and Press any key to flash'); 
        console.log(_hashs);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        
        process.stdin.on('data', ()=> {
                firmware.flash().then(() => {
                    console.log(_hashs);
                    console.log("Operation complete Plug-out ESP switch to UART");
                    console.log(_hashs);
                    process.exit();
                });
        });
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
