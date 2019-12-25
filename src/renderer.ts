// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var port: any;
var parser: any;
var ports: any;

function getPorts() {
    //  Get all available ports to array
    SerialPort.list().then((ports: any) => {
        this.ports = ports;
        console.dir(ports);
    })
        .then(() => {
            // iterate through array and try connect to port
            this.ports.forEach((element: any) => {
                try {
                    let temp = new SerialPort(element.path);
                    let temp_parser = temp.pipe(new Readline({ delimiter: '\n' }));
                    temp.open(()=>{
                        // Check if port sends '787' at first 3 places (id of arduino)
                        temp_parser.on('data',(data:string)=>{
                            if (parseInt(data.substring(0,3))==787){
                                // Close teporary connection and run port listener
                                temp.close();
                                this.hide();
                                setTimeout( () => this.listen(element.path) , 50 );
                            }
                        })
                    })
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    if (this.port===undefined)
        setTimeout(()=>this.getPorts(),500);
}

getPorts();

function listen(path:String) {
    console.log("Connected on "+path);

    this.port= new SerialPort(path);
    this.parser=port.pipe(new Readline({ delimiter: '\n' }));

    this.port.open(() => {
        this.parser.on('data', (data: any) => {
            //parse data
            let arr=data;
            arr=data.substr(3,arr.length);
            arr=arr.match(/.{1,2}/g);
            
            console.log('recieved:', arr);
            show(arr);
        });
    })
}

function show(arr: any) {
    let temp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (let x in arr) {
        temp[arr[x]]=1;
    }

    for (let i in temp){
        if (temp[i]==1){
            document.getElementById("n"+parseInt(i)).style.opacity="1";
        }
        else {
            document.getElementById("n"+parseInt(i)).style.opacity="0.5";
        }
            
    }


        //document.getElementById("n"+parseInt(arr[i])).style.opacity="0";

}

function hide() {
    document.getElementById("plug").style.animationPlayState="running";
    document.getElementById("connection").style.animationPlayState="running";
}