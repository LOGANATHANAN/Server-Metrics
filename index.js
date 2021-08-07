const express=require('express');
const path=require('path');
const app=express();
const os=require('os');

app.use(express.json({ extended: false }));

//static folder
app.use(express.static(path.join(__dirname,'views')));

app.get('/cpu', (req, res) => {
    res.send(os.cpus());
    //console.log(os.cpus());
});

app.get('/os-type', (req, res) => {
    res.send(os.type());
});

app.get('/ram', (req, res) => {
    var p=Math.pow(10,6);
    var ram=[os.freemem()/p,os.totalmem()/p];
    res.send(ram);
    //console.log(os.freemem()+'');
});

app.get('/networks', (req, res) => {
    res.send(os.networkInterfaces().wlp13s0);
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server Running At Port ${PORT}`);
});