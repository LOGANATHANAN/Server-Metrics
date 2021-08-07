window.onload=function loadOSType() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      document.getElementById("os-type").innerHTML = this.responseText;
    }
    xhttp.open("GET", "/os-type");
    xhttp.send();
   loadNetworkMetrics();
  }
  
  function loadRam(){
      const xhttp = new XMLHttpRequest();
     xhttp.onload = function() {
      var ram=JSON.parse(this.responseText);
      var xValues = ["Available Free RAM","Used RAM","Total System RAM"];
      var yValues = [ram[0],(ram[1]-ram[0]),ram[1]];
      var barColors = ["green", "red","blue"];
  
      new Chart("RAMChart", {
      type: "bar",
      data: {
          labels: xValues,
          datasets: [{
          backgroundColor: barColors,
          data: yValues
          }]
      },
      options: {
          legend: {display: false},
          title: {
          display: true,
          text: "RAM Metrics in MB"
          }
      }
      });
    }
    xhttp.open("GET", "/ram");
    xhttp.send();
  }
  
  function loadNetworkMetrics() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var net=JSON.parse(this.responseText);
      document.getElementById("ipv4").innerHTML = net[0].address;
      document.getElementById("ipv4-netmask").innerHTML = net[0].netmask;
      document.getElementById("ipv4-cidr").innerHTML = net[0].cidr;
      document.getElementById("ipv6").innerHTML = net[1].address;
      document.getElementById("ipv6-netmask").innerHTML = net[1].netmask;
      document.getElementById("ipv6-cidr").innerHTML = net[1].cidr;
    }
    xhttp.open("GET", "/networks");
    xhttp.send();
  }
  
  function loadCPUMetrics() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var cpu=JSON.parse(this.responseText);
        //console.log(cpu);
        let txt="";
        var times=["user","nice","sys","idle","irq"];
        var barColors = [
          "StateBlue",
          "DodgerBlue",
          "MediumSeaGreen",
          "LightGray",
          "blue"
          ];
        for(var i=0;i<cpu.length;i++){
            var chartid="chart"+i;
            var obj=cpu[i];
            var timesValues=[obj.times.user,obj.times.nice,obj.times.sys,obj.times.idle,obj.times.irq];
          
        txt+=`<div class="col-sm-6">
        <div class="text-center">
         <div style="height:100%;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
        <canvas id=${chartid} style="width:100%"></canvas>
        <hr>
        <div class="text-center">
        <p><b>vCPU${i+1} speed: </b>${obj.speed} MHz</p>
        </div>
        </div>
        </div>
        </div>`
        }
      document.getElementById("cpu").innerHTML = txt;
      for(var i=0;i<cpu.length;i++){
          var obj=cpu[i];
          var chartid="chart"+i;
          var vCPU="vCPU"+(i+1)+" (each in milliseconds)";
          var timesValues=[obj.times.user,obj.times.nice,obj.times.sys,obj.times.idle,obj.times.irq];
         new Chart(`${chartid}`, {
          type: "pie",
          data: {
              labels: times,
              datasets: [{
              backgroundColor: barColors,
              data: timesValues
              }]
          },
          options: {
              title: {
              display: true,
              text: `${vCPU}`
              }
          }
          });
      }
    }
    xhttp.open("GET", "/cpu");
    xhttp.send();
    loadRam();
  }
  
  setInterval(loadCPUMetrics,2000);