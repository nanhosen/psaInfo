//7 day brown : 225,198,148
function ajax(options) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    xhr.responseType = '';
    xhr.onload = function() {
      if (this.status <= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } 
      else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (options.headers) {
      Object.keys(options.headers).forEach(function(key) {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    };
    var params = options.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    };
    xhr.send(params);
  });
}

var getERCData =  async function(){
  let day1 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day1'}) 
  let day2 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day2'}) 
  let day3 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day3'}) 
  // let day1 = await ajax({method: 'GET',url: 'https://gacc.nifc.gov/gbcc/predictive/psaInfo/day0.json'}) 
  // let day2 = await ajax({method: 'GET',url: 'https://gacc.nifc.gov/gbcc/predictive/psaInfo/day1.json'}) 
  // let day3 = await ajax({method: 'GET',url: 'https://gacc.nifc.gov/gbcc/predictive/psaInfo/day2.json'}) 
  var threeDayAray = [day1,day2,day3];
  // console.log('ercDat', day1)
  return threeDayAray
}
getERCData()
.then(
  (g)=>{
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');


    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });


    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    var infoArea = document.getElementById('infoArea');
    var matrixArea = document.getElementById('matrixArea');
    var detailDiv = document.getElementById('details');
    var dateDiv = document.getElementById('date');

    var stnInfo = {}
    var pos = ['highest','p97','p90','p80','p70','p50'];

    var colorAr = [['highest','purple'],['p97','pink'],['p90','red'],['p80','orange'],['p70','yellow'],['p50','green']];
    var colorMap = new Map(colorAr);

    var percNameAr = [['highest','highest'],['p97','97th percentile'],['p90','90th percentile'],['p80','80th percentile'],['p70','70th percentile'],['p50','50th percentile']];
    var percNameMap = new Map(percNameAr);

    var getPsaColor = async function(stnInfo,layerPsa){
      var psaThresh = await ajax({method: 'GET',url: './data/rawsAllInfo.json'})
      var psaColorObj = []
      // console.log(stnInfo)
      psaThresh.map((curr)=>{
        var psa = curr.PSA;
        if(layerPsa == psa){
          // console.log('here')
          if(curr.matrix!==undefined){
          getPSAAvg(stnInfo,psa)
          .then((g)=>{
            // console.log(g)
            var erc = g[0];
            // var erc = 10;
            var fm = g[1];
            // var fm = 13;
            console.log('erc',erc,'fm',fm)
            var matrix = curr.matrix;
            var green1 = matrix.green1;
            var greenErc1 = green1.erc[0];
            var greenErc2 = green1.erc[1];
            var greenFm1 = green1.fm[0];
            var greenFm2 = green1.fm[1];
            var yellow1 = matrix.yellow1;
            var yellowErc1 = yellow1.erc[0]
            var yellowErc2 = yellow1.erc[1]
            var yellowFm1 = yellow1.fm[0]
            var yellowFm2 = yellow1.fm[1]
            var brown1 = matrix.brown1;
            var brownErc = brown1.erc;
            var brownFm = brown1.fm;
            // console.log(greenFm1,greenFm2);
            var layerColor
            if((erc >= greenErc1[0] && fm >= greenFm1[0]) && (erc <= greenErc1[1] && fm <= greenFm1[1])){
              console.log("green erc")
              layerColor = "green";
              psaColorObj[0] = layerColor;
            }
            else if((erc >= greenErc2[0] && fm >= greenFm2[0]) && (erc <= greenErc2[1] && fm <= greenFm2[1])){
              console.log("green erc")
              layerColor = "green";
              psaColorObj[0] = layerColor;
            }
            else if((erc >= yellowErc1[0] && fm >= yellowFm1[0]) && (erc <= yellowErc1[1] && fm <= yellowFm1[1])){
              console.log("yellow erc")
              layerColor = "yellow";
              psaColorObj[0] = layerColor;
            }
            else if((erc >= yellowErc2[0] && fm >= yellowFm2[0]) && (erc <= yellowErc2[1] && fm <= yellowFm2[1])){
              console.log("yellow erc")
              layerColor = "yellow";
              psaColorObj[0] = layerColor;
            }
            else if((erc >= brownErc[0] && fm >= brownFm[0])&&( erc <= brownErc[1] && fm <= brownFm[1])){
              console.log("brown erc")
              layerColor = "brown";
              psaColorObj[0] = layerColor;
            }
            else{
              console.log("green cause didn't fit")
              layerColor = "green";
              psaColorObj[0] = layerColor;
            }

          })
          // console.log(average1)
        }
        else{
             layerColor = "grey";
              psaColorObj[0] = layerColor;
        }
        return psaColorObj
        }
        
      })
      return psaColorObj
      // console.log(psaThresh,"GB35")
    }

   var col = getPsaColor(stnInfo,"GB35").then((g)=>{
    var color = g;
    console.log('g0',color.length)
  })
   // console.log('stnInfo',stnInfo)

   getPsaColor1 = async function(stnInfo,layerPsa){
      var psaThresh = await ajax({method: 'GET',url: './data/rawsAllInfo.json'})
      var b;
      psaThresh.map((curr)=>{
        if(layerPsa == curr.PSA){
          b = layerPsa
        }
      })
      // console.log(psaThresh)
      return b
    }
   var col1 = getPsaColor1(stnInfo,"GB35").then((g)=>{return g})
   console.log(col1)

    var assignValue = function(id,obAr){
      // console.log('obAr',obAr)
      if (ercDay1[id]!==undefined){
        var erc = ercDay1[id].erc;
        var oneHr = ercDay1[id].oneHr;
        var tenHr = ercDay1[id].tenHr;
        var hunHr = ercDay1[id].hunHr;
        var thouHr = ercDay1[id].thouHr;
        var date = ercDay1[id].obDate;
        // dateDiv.innerHTML = 'RAWS Observations from ' + date + ' at 1800 MDT';
       }
      else {
        var erc = 'missing';
        }

      if (ercDay3[id]!==undefined){
        var erc3 = ercDay3[id].erc
        var date = ercDay3[id].obDate;
        dateDiv.innerHTML = 'RAWS Observations from ' + date + ' at 1800 MDT';

        // console.log('erc3',erc - erc3)
       }
      else {
        var erc3 = 'missing';
        } 

      if(erc!=='missing'){
        var pMax = obAr[0];
        var p97 = obAr[1];
        var p90 = obAr[2];
        var p80 = obAr[3];
        var p70 = obAr[4];
        var p50 = obAr[5];
        var color,upper,upperVal,lower,lowerVal,above,below,trendText;
        var trend = (erc3 !=='missing') ? erc - erc3 : 'missing';
        var trendText;
        if(trend>0){
          trendText = "increasing";
          var arrow = "up";
        }
        else if (trend<0){
          trendText = "decreasing";
          var arrow = "down";
        }
        else{
          trendText = "missing";
          var arrow = "flat";
        }
        if(erc>p97){
          color = 'purple';
          upper = 'Max';
          lower = 'Max';
          upperVal = pMax;
          lowerVal = pMax;
          above = true;
          below = false;
          arrow = arrow;
        }
        else if(erc<p97 && erc>=p90){
          color = 'burnt';
          upper = 'p97';
          lower = 'p90';
          upperVal = p97;
          lowerVal = p90;
          above = false;
          below = false;
          arrow = arrow;
        }
        else if(erc<p90 && erc>=p80){
          color = 'red';
          upper = 'p90';
          lower = 'p80';
          upperVal = p90;
          lowerVal = p80;
          above = false;
          below = false;
          arrow = arrow;
        }
        else if(erc<p80 && erc>=p70){
          color = 'orange';
          upper = 'p80';
          lower = 'p70';
          upperVal = p80;
          lowerVal = p70;
          above = false;
          below = false;
          arrow = arrow;
        }
        else if(erc<p70 && erc>=p50){
          color = 'yellow';
          upper = 'p70';
          lower = 'p50';
          upperVal = p70;
          lowerVal = p50;
          above = false;
          below = false;
          arrow = arrow;
        }
        else if(erc<p50){
          color = 'green';
          upper = 'p50';
          lower = 'p50';
          upperVal = p50;
          lowerVal = p50;
          above = false;
          below = true;
          arrow = arrow;
        }
        else{
          var trend = 'missing';
          stnInfo[id] = {
              'erc' : erc,
              'oneHr': oneHr,
              'tenHr' : tenHr,
              'hunHr': hunHr,
              'thouHr' : thouHr,   
              'upper' : 'missing',
              'lower' : 'missing',
              'color' : 'nodata',
              'trend' : 'missing',
              'above' : false,
              'below' : false,
              'arrow' : ''
            };
          }
        stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : upper, 
                'upperVal' : upperVal,
                'lower' : lower,
                'lowerVal' : lowerVal,
                'color' : color,
                'trend' : trendText,
                'above' : above,
                'below' : below,
                'arrow' : arrow
              };  
      }
      else{
        // console.log('missing ERC', id)
          var trend = 'missing';
          stnInfo[id] = {
              'erc' : 'missing',
              'oneHr': 'missing',
              'tenHr' : 'missing',
              'hunHr': 'missing',
              'thouHr' : 'missing',   
              'upper' : 'missing',
              'lower' : 'missing',
              'color' : 'nodata',
              'trend' : 'missing',
              'above' : false,
              'below' : false,
              'arrow' : ''
            };
      }
    }
    
    console.log('stnInfo',stnInfo)
    var highlightStyleCache = {};
    var psaNm;

    var ercDay1 = g[0];
    var ercDay2 = g[1];
    var ercDay3 = g[2];
    // console.log('day1', ercDay1)
    
    var geojsonObject = {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.199,36.353]},"properties":{"name":"Logan","id":20107,"highest":116,"p97":103,"p90":97,"p80":90,"p70":84,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.817,36.5]},"properties":{"name":"Olaf","id":20108,"highest":124,"p97":117,"p90":113,"p80":108,"p70":104,"p50":98}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.717,36.583]},"properties":{"name":"Tweedy","id":20109,"highest":122,"p97":111,"p90":106,"p80":103,"p70":95,"p50":90}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.841,36.471]},"properties":{"name":"Robinson Tank (through 2013)","id":20111,"highest":113,"p97":107,"p90":102,"p80":93,"p70":88,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.158,36.388]},"properties":{"name":"Nixon","id":20113,"highest":121,"p97":102,"p90":95,"p80":88,"p70":82,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.747,36.79]},"properties":{"name":"Blackrock Portable","id":20114,"highest":119,"p97":104,"p90":98,"p80":92,"p70":88,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.207,36.699]},"properties":{"name":"Hurricane","id":20117,"highest":119,"p97":111,"p90":106,"p80":102,"p70":95,"p50":86}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.583,36.704]},"properties":{"name":"Gunsight","id":20223,"highest":116,"p97":111,"p90":105,"p80":98,"p70":93,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-120.094,40.059]},"properties":{"name":"Doyle","id":40724,"highest":106,"p97":100,"p90":96,"p80":93,"p70":89,"p50":82}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-120.038,39.572]},"properties":{"name":"Dog Valley","id":41302,"highest":97,"p97":92,"p90":87,"p80":83,"p70":80,"p50":71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.768,38.685]},"properties":{"name":"Markleeville","id":42802,"highest":101,"p97":97,"p90":93,"p80":90,"p70":87,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.22,38.248]},"properties":{"name":"Bridgeport","id":43702,"highest":105,"p97":99,"p90":96,"p80":93,"p70":90,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.455,38.57]},"properties":{"name":"Walker","id":43707,"highest":110,"p97":106,"p90":103,"p80":100,"p70":98,"p50":94}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.188,45.378]},"properties":{"name":"lodgepole","id":101044,"highest":85,"p97":74,"p90":68,"p80":62,"p70":58,"p50":50}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.427,44.847]},"properties":{"name":"weiser river","id":101108,"highest":102,"p97":96,"p90":93,"p80":89,"p70":85,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.738,45.1]},"properties":{"name":"snake","id":101109,"highest":100,"p97":95,"p90":90,"p80":85,"p70":80,"p50":72}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.1,44.89]},"properties":{"name":"McCall","id":101209,"highest":69,"p97":66,"p90":59,"p80":52,"p70":48,"p50":41}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.5,44.383]},"properties":{"name":"Bearskin","id":101221,"highest":93,"p97":84,"p90":80,"p80":74,"p70":69,"p50":61}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.183,44.25]},"properties":{"name":"pine creek","id":101222,"highest":100,"p97":92,"p90":88,"p80":83,"p70":77,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.188,44.943]},"properties":{"name":"ski hill","id":101223,"highest":93,"p97":84,"p90":80,"p80":75,"p70":70,"p50":58}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.849,45.104]},"properties":{"name":"Taylor Ranch","id":101224,"highest":94,"p97":90,"p90":84,"p80":81,"p70":76,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.163,45.401]},"properties":{"name":"Indianola","id":101303,"highest":97,"p97":85,"p90":79,"p80":75,"p70":68,"p50":67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.945,45.15]},"properties":{"name":"Salmon","id":101310,"highest":97,"p97":89,"p90":86,"p80":81,"p70":75,"p50":73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.502,45.336]},"properties":{"name":"Skull Gulch","id":101311,"highest":97,"p97":89,"p90":84,"p80":78,"p70":75,"p50":66}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.347,44.702]},"properties":{"name":"leadore","id":101312,"highest":94,"p97":87,"p90":81,"p80":77,"p70":72,"p50":65}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.026,44.849]},"properties":{"name":"ezra","id":101314,"highest":98,"p97":93,"p90":88,"p80":83,"p70":78,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.895,45.356]},"properties":{"name":"kriley creek","id":101315,"highest":97,"p97":92,"p90":87,"p80":83,"p70":77,"p50":68}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.418,44.988]},"properties":{"name":"Red Rock Peak","id":101316,"highest":98,"p97":91,"p90":86,"p80":78,"p70":68,"p50":57}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.168,44.319]},"properties":{"name":"dead indian Ridge","id":101402,"highest":105,"p97":98,"p90":94,"p80":91,"p70":88,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.917,43.944]},"properties":{"name":"Town Creek","id":101708,"highest":99,"p97":87,"p90":83,"p80":77,"p70":71,"p50":61}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.881,44.091]},"properties":{"name":"Little Anderson","id":101710,"highest":102,"p97":90,"p90":86,"p80":80,"p70":75,"p50":67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.729,44.372]},"properties":{"name":"Bonanza","id":101801,"highest":79,"p97":73,"p90":68,"p80":64,"p70":60,"p50":53}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.846,43.81]},"properties":{"name":"Copper Basin","id":101804,"highest":83,"p97":78,"p90":72,"p80":66,"p70":61,"p50":54}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.996,44.723]},"properties":{"name":"Little Creek","id":101805,"highest":95,"p97":90,"p90":86,"p80":83,"p70":78,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.926,44.169]},"properties":{"name":"Stanley RS","id":101809,"highest":85,"p97":75,"p90":71,"p80":62,"p70":57,"p50":50}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.729,44.372]},"properties":{"name":"Road CR","id":101816,"highest":96,"p97":88,"p90":84,"p80":85,"p70":75,"p50":64}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.223,44.504]},"properties":{"name":"Challis","id":101817,"highest":96,"p97":91,"p90":87,"p80":84,"p70":81,"p50":74}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.387,43.623]},"properties":{"name":"Archo","id":101905,"highest":96,"p97":90,"p90":86,"p80":74,"p70":80,"p50":72}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.394,44.163]},"properties":{"name":"Mulkey Bar","id":101906,"highest":26,"p97":22,"p90":90,"p80":19,"p70":18,"p50":14}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.108,44.396]},"properties":{"name":"3 Mile","id":102004,"highest":90,"p97":84,"p90":78,"p80":72,"p70":66,"p50":60}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.384,44.42]},"properties":{"name":"Island Park","id":102105,"highest":71,"p97":60,"p90":54,"p80":49,"p70":45,"p50":40}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.779,44.168]},"properties":{"name":"Gascv","id":102106,"highest":92,"p97":81,"p90":76,"p80":72,"p70":68,"p50":59}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.576,43.65]},"properties":{"name":"Moody","id":102301,"highest":95,"p97":84,"p90":79,"p80":74,"p70":69,"p50":63}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.201,43.54]},"properties":{"name":"Pine Creek Pass","id":102401,"highest":94,"p97":87,"p90":83,"p80":76,"p70":74,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.201,43.567]},"properties":{"name":"Boise South","id":102601,"highest":95,"p97":89,"p90":87,"p80":85,"p70":82,"p50":75}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.87,43.028]},"properties":{"name":"Mountain Home","id":102709,"highest":100,"p97":93,"p90":91,"p80":89,"p70":88,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.152,43.174]},"properties":{"name":"DeerHV","id":102711,"highest":110,"p97":102,"p90":97,"p80":95,"p70":92,"p50":90}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.327,43.573]},"properties":{"name":"WagonTown","id":102712,"highest":104,"p97":97,"p90":92,"p80":87,"p70":83,"p50":73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.899,43.62]},"properties":{"name":"Fleck Summit","id":102802,"highest":98,"p97":90,"p90":86,"p80":83,"p70":78,"p50":67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.421,43.79]},"properties":{"name":"North Fork RS","id":102903,"highest":88,"p97":84,"p90":80,"p80":76,"p70":69,"p50":62}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.316,43.601]},"properties":{"name":"Ohio Gulch","id":102906,"highest":100,"p97":92,"p90":91,"p80":86,"p70":82,"p50":71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.574,43.226]},"properties":{"name":"Potter","id":102907,"highest":111,"p97":98,"p90":93,"p80":89,"p70":85,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.408,43.058]},"properties":{"name":"Dale Bitner","id":103102,"highest":71,"p97":63,"p90":59,"p80":54,"p70":50,"p50":45}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.202,42.418]},"properties":{"name":"Horse Butte","id":103205,"highest":106,"p97":98,"p90":95,"p80":90,"p70":86,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.686,42.35]},"properties":{"name":"Brace Flat","id":103207,"highest":113,"p97":102,"p90":99,"p80":94,"p70":90,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.586,42.819]},"properties":{"name":"Triange","id":103208,"highest":104,"p97":93,"p90":88,"p80":84,"p70":80,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.195,42.691]},"properties":{"name":"Twin Butte","id":103209,"highest":107,"p97":99,"p90":96,"p80":93,"p70":91,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.768,42.052]},"properties":{"name":"Pole Creek","id":103210,"highest":102,"p97":96,"p90":93,"p80":91,"p70":87,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.211,42.02]},"properties":{"name":"Sho Pai","id":103211,"highest":98,"p97":91,"p90":89,"p80":84,"p70":83,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.064,42.973]},"properties":{"name":"Rock Lake","id":103403,"highest":103,"p97":94,"p90":90,"p80":87,"p70":85,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.167,42.983]},"properties":{"name":"Crystal","id":103703,"highest":103,"p97":94,"p90":90,"p80":86,"p70":82,"p50":77}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.706,42.365]},"properties":{"name":"Bull Canyon","id":103704,"highest":93,"p97":89,"p90":84,"p80":79,"p70":74,"p50":68}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.855,42.537]},"properties":{"name":"Grace","id":103902,"highest":98,"p97":91,"p90":86,"p80":81,"p70":76,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.841,42.894]},"properties":{"name":"Pole Canyon","id":103903,"highest":96,"p97":89,"p90":84,"p80":79,"p70":74,"p50":66}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.317,42.3]},"properties":{"name":"Trail Gulch","id":104004,"highest":101,"p97":96,"p90":92,"p80":89,"p70":86,"p50":79}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.483,42.083]},"properties":{"name":"Bull Springs","id":104006,"highest":91,"p97":84,"p90":79,"p80":74,"p70":71,"p50":63}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.09,42.02]},"properties":{"name":"Moberg Canyon","id":104103,"highest":103,"p97":96,"p90":91,"p80":86,"p70":82,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.259,42.548]},"properties":{"name":"Raft River","id":104104,"highest":90,"p97":82,"p90":79,"p80":74,"p70":73,"p50":65}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.896,42.095]},"properties":{"name":"Goose Creek","id":104105,"highest":100,"p97":92,"p90":88,"p80":83,"p70":82,"p50":79}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.183,42.079]},"properties":{"name":"Flint Creek","id":104203,"highest":115,"p97":99,"p90":93,"p80":86,"p70":82,"p50":75}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-94.615,47.377778]},"properties":{"name":"Cass Lake","id":211604,"highest":44,"p97":38,"p90":34,"p80":32,"p70":29,"p50":25}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.559444,48.539444]},"properties":{"name":"Stillwater","id":240221,"highest":85,"p97":58,"p90":50,"p80":46,"p70":41,"p50":35}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.815,39.382]},"properties":{"name":"Galena","id":260108,"highest":105,"p97":100,"p90":97,"p80":95,"p70":92,"p50":87}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.551,41.009]},"properties":{"name":"Fox Mountain","id":260110,"highest":106,"p97":100,"p90":95,"p80":91,"p70":88,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.768,39.674]},"properties":{"name":"Desert Springs","id":260114,"highest":110,"p97":104,"p90":100,"p80":97,"p70":95,"p50":89}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.09,40.335]},"properties":{"name":"Bluewing","id":260202,"highest":113,"p97":107,"p90":105,"p80":103,"p70":101,"p50":96}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.117,41.492]},"properties":{"name":"Dry Canyon","id":260203,"highest":110,"p97":104,"p90":101,"p80":98,"p70":95,"p50":87}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.633,41.456]},"properties":{"name":"Mory Creek","id":260204,"highest":122,"p97":110,"p90":105,"p80":101,"p70":97,"p50":87}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-118.451,41.802]},"properties":{"name":"Texas Spring","id":260206,"highest":112,"p97":105,"p90":102,"p80":98,"p70":94,"p50":83}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-118.044,41.652]},"properties":{"name":"Double H","id":260207,"highest":105,"p97":101,"p90":96,"p80":92,"p70":89,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-118.52,40.773]},"properties":{"name":"Majuba","id":260208,"highest":105,"p97":102,"p90":99,"p80":96,"p70":91,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.231,41.554]},"properties":{"name":"Long Hollow","id":260305,"highest":109,"p97":103,"p90":99,"p80":95,"p70":89,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.811,40.44]},"properties":{"name":"Spruce Mtn","id":260306,"highest":115,"p97":110,"p90":103,"p80":98,"p70":93,"p50":84}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.203,40.593]},"properties":{"name":"Spring Gulch","id":260308,"highest":111,"p97":104,"p90":99,"p80":95,"p70":92,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.643,41.643]},"properties":{"name":"Rock Spring Creek","id":260309,"highest":99,"p97":94,"p90":88,"p80":84,"p70":80,"p50":71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.764,41.685]},"properties":{"name":"Antelope Lake","id":260310,"highest":110,"p97":104,"p90":100,"p80":95,"p70":90,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.85,40.46]},"properties":{"name":"Crane Springs","id":260314,"highest":107,"p97":103,"p90":98,"p80":93,"p70":90,"p50":81}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.393,41.518]},"properties":{"name":"Stag Mtn","id":260315,"highest":101,"p97":96,"p90":93,"p80":87,"p70":82,"p50":71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.615,40.4]},"properties":{"name":"Siard","id":260402,"highest":114,"p97":107,"p90":104,"p80":102,"p70":99,"p50":91}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.584,39.309]},"properties":{"name":"Desatoya","id":260503,"highest":112,"p97":105,"p90":100,"p80":97,"p70":94,"p50":87}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.317,39.65]},"properties":{"name":"Red Butte","id":260504,"highest":114,"p97":108,"p90":105,"p80":102,"p70":99,"p50":91}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.758,40.558]},"properties":{"name":"Beacon","id":260505,"highest":116,"p97":111,"p90":108,"p80":105,"p70":102,"p50":94}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.3,39.633]},"properties":{"name":"Combs","id":260601,"highest":111,"p97":104,"p90":101,"p80":97,"p70":93,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.492,39.833]},"properties":{"name":"Coils Creek","id":260603,"highest":107,"p97":102,"p90":98,"p80":93,"p70":89,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-118.96,39.256]},"properties":{"name":"Dead Camel","id":260701,"highest":113,"p97":106,"p90":103,"p80":100,"p70":97,"p50":92}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.518,39.737]},"properties":{"name":"Alligator Ridge","id":260804,"highest":111,"p97":104,"p90":99,"p80":95,"p70":91,"p50":83}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.149,39.757]},"properties":{"name":"Cedar pass","id":260805,"highest":112,"p97":104,"p90":97,"p80":92,"p70":88,"p50":81}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.814,38.904]},"properties":{"name":"Cattle Camp","id":260807,"highest":108,"p97":98,"p90":92,"p80":87,"p70":83,"p50":77}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-119.641,38.925]},"properties":{"name":"Fish Springs","id":261204,"highest":112,"p97":106,"p90":100,"p80":96,"p70":94,"p50":88}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.193,38.304]},"properties":{"name":"Pancake","id":261404,"highest":119,"p97":113,"p90":106,"p80":102,"p70":99,"p50":92}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.417,38.767]},"properties":{"name":"Currant Creek","id":261406,"highest":117,"p97":111,"p90":106,"p80":102,"p70":98,"p50":93}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-116.609,37.021]},"properties":{"name":"Buddy Adams","id":261408,"highest":114,"p97":110,"p90":108,"p80":105,"p70":102,"p50":96}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.758,38.283]},"properties":{"name":"Coyote Wash","id":261603,"highest":115,"p97":108,"p90":101,"p80":95,"p70":91,"p50":83}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.708,37.25]},"properties":{"name":"kane Spring","id":261604,"highest":122,"p97":118,"p90":112,"p80":108,"p70":105,"p50":99}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-114.16,37.921]},"properties":{"name":"Immigration Wash","id":261608,"highest":115,"p97":108,"p90":100,"p80":95,"p70":91,"p50":84}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.6,36.267]},"properties":{"name":"Kyle","id":261702,"highest":127,"p97":112,"p90":105,"p80":100,"p70":95,"p50":85}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.427,36.135]},"properties":{"name":"Red Rock","id":261705,"highest":128,"p97":119,"p90":113,"p80":108,"p70":105,"p50":99}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-115.867,36.333]},"properties":{"name":"Mt. Springs","id":261708,"highest":115,"p97":107,"p90":103,"p80":99,"p70":95,"p50":88}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.931,41.18]},"properties":{"name":"Bues Canyon","id":420403,"highest":95,"p97":88,"p90":84,"p80":79,"p70":76,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.817,40.883]},"properties":{"name":"Bear River","id":420703,"highest":84,"p97":68,"p90":61,"p80":56,"p70":52,"p50":44}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.481,40.953]},"properties":{"name":"Hewinta","id":420705,"highest":84,"p97":71,"p90":61,"p80":55,"p70":52,"p50":45}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.067,40.55]},"properties":{"name":"Norway_Flat","id":420706,"highest":87,"p97":76,"p90":90,"p80":64,"p70":59,"p50":52}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.777,40.301]},"properties":{"name":"Cedar Mountain","id":420901,"highest":107,"p97":101,"p90":93,"p80":89,"p70":86,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.427,40.099]},"properties":{"name":"Vernon","id":420908,"highest":102,"p97":97,"p90":89,"p80":84,"p70":81,"p50":73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.021,40.597]},"properties":{"name":"Aragonite","id":420911,"highest":108,"p97":105,"p90":100,"p80":95,"p70":91,"p50":86}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.281,41.753]},"properties":{"name":"Otter Creek ","id":420912,"highest":104,"p97":92,"p90":90,"p80":81,"p70":79,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.591,41.61]},"properties":{"name":"Rosebud","id":420914,"highest":109,"p97":100,"p90":95,"p80":91,"p70":87,"p50":82}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.876,40.113]},"properties":{"name":"Clifton Flat","id":420915,"highest":104,"p97":100,"p90":97,"p80":93,"p70":89,"p50":81}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.75,40.431]},"properties":{"name":"Pleasant Grove","id":421101,"highest":105,"p97":95,"p90":91,"p80":88,"p70":85,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-117.095,38.4869444]},"properties":{"name":"Quima Peak","id":260810,"highest":"","p97":"","p90":"","p80":"","p70":"","p50":""}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.275,40.118]},"properties":{"name":"Rays Valley","id":421103,"highest":95,"p97":85,"p90":78,"p80":73,"p70":70,"p50":64}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.33,40.544]},"properties":{"name":"Ylwstn  ","id":421301,"highest":103,"p97":93,"p90":84,"p80":76,"p70":66,"p50":65}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.266,39.881]},"properties":{"name":"Five Mile","id":421304,"highest":110,"p97":99,"p90":91,"p80":85,"p70":80,"p50":73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.861,39.934]},"properties":{"name":"Horse Ridge  ","id":421305,"highest":101,"p97":92,"p90":84,"p80":79,"p70":74,"p50":67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.562,40.278]},"properties":{"name":"Blacktail","id":421307,"highest":105,"p97":101,"p90":94,"p80":87,"p70":84,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.265,39.634]},"properties":{"name":"McCook","id":421405,"highest":107,"p97":98,"p90":91,"p80":84,"p70":79,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.243,40.617]},"properties":{"name":"Diamond","id":421408,"highest":96,"p97":89,"p90":85,"p80":81,"p70":76,"p50":68}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112,39.583]},"properties":{"name":"Sevier Res","id":421501,"highest":107,"p97":103,"p90":95,"p80":91,"p70":88,"p50":83}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.272,39.799]},"properties":{"name":"Mud Spring","id":421502,"highest":105,"p97":97,"p90":91,"p80":87,"p70":85,"p50":78}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.323,39.309]},"properties":{"name":"Joes Valley ","id":421602,"highest":105,"p97":99,"p90":89,"p80":83,"p70":80,"p50":72}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.292,39.608]},"properties":{"name":"Bruin Point ","id":421702,"highest":97,"p97":91,"p90":82,"p80":78,"p70":72,"p50":61}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.239,38.979]},"properties":{"name":"Black Cedar","id":421805,"highest":102,"p97":93,"p90":89,"p80":85,"p70":82,"p50":76}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.367,39.35]},"properties":{"name":"Tule Valley","id":421806,"highest":117,"p97":107,"p90":104,"p80":100,"p70":97,"p50":90}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.683,38.664]},"properties":{"name":"Horse Hollow","id":421807,"highest":113,"p97":97,"p90":95,"p80":91,"p70":89,"p50":81}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.061,38.632]},"properties":{"name":"Signal Peak","id":421904,"highest":109,"p97":98,"p90":89,"p80":83,"p70":79,"p50":70}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.863,38.771]},"properties":{"name":"Lost Creek","id":421905,"highest":107,"p97":95,"p90":86,"p80":82,"p70":70,"p50":67}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.6,39.338]},"properties":{"name":"Flattop","id":422002,"highest":115,"p97":105,"p90":99,"p80":94,"p70":91,"p50":84}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.217,39.275]},"properties":{"name":"Bryson","id":422102,"highest":115,"p97":104,"p90":97,"p80":91,"p70":88,"p50":82}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.517,38.033]},"properties":{"name":"Jensen Springs","id":422502,"highest":118,"p97":106,"p90":99,"p80":94,"p70":90,"p50":82}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.5,37.5]},"properties":{"name":"Asay Bench","id":422604,"highest":108,"p97":95,"p90":87,"p80":81,"p70":76,"p50":66}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.683,37.9]},"properties":{"name":"Buck Flat","id":422606,"highest":114,"p97":103,"p90":92,"p80":83,"p70":80,"p50":71}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.119,37.829]},"properties":{"name":"Tom Best Spring","id":422608,"highest":108,"p97":94,"p90":90,"p80":81,"p70":76,"p50":50}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.172,37.642]},"properties":{"name":"Bryce Canyon","id":422609,"highest":100,"p97":90,"p90":82,"p80":73,"p70":70,"p50":58}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.32,38.016]},"properties":{"name":"Larb Hollow","id":422610,"highest":115,"p97":100,"p90":90,"p80":80,"p70":75,"p50":68}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.825,38.034]},"properties":{"name":"Henry Mountain","id":422611,"highest":109,"p97":99,"p90":91,"p80":83,"p70":79,"p50":68}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.839,37.838]},"properties":{"name":"North Long Point","id":422710,"highest":110,"p97":95,"p90":88,"p80":80,"p70":72,"p50":61}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.279,38.221]},"properties":{"name":"Big Indian","id":422711,"highest":115,"p97":103,"p90":96,"p80":91,"p70":86,"p50":77}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.892,37.525]},"properties":{"name":"Kane Gulch","id":422712,"highest":107,"p97":97,"p90":94,"p80":86,"p70":81,"p50":73}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.717,37.559]},"properties":{"name":"Enterprise","id":422803,"highest":112,"p97":100,"p90":91,"p80":86,"p70":81,"p50":74}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.378,37.216]},"properties":{"name":"White Reef","id":422805,"highest":119,"p97":115,"p90":110,"p80":104,"p70":101,"p50":95}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.951,37.152]},"properties":{"name":"Badger Springs","id":422806,"highest":126,"p97":115,"p90":110,"p80":105,"p70":101,"p50":95}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.039,37.392]},"properties":{"name":"Lava Point RAWS","id":422807,"highest":95,"p97":86,"p90":80,"p80":73,"p70":68,"p50":61}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.978,37.205]},"properties":{"name":"Zion Canyon","id":422808,"highest":116,"p97":111,"p90":104,"p80":101,"p70":97,"p50":91}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.271,37.522]},"properties":{"name":"Agua Canyon","id":422903,"highest":102,"p97":96,"p90":88,"p80":81,"p70":74,"p50":66}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.371,43.84]},"properties":{"name":"Burro Hill","id":480707,"highest":81,"p97":77,"p90":71,"p80":64,"p70":59,"p50":51}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.71,43.724]},"properties":{"name":"Grand Teton","id":480708,"highest":78,"p97":73,"p90":65,"p80":61,"p70":55,"p50":47}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.423,43.22]},"properties":{"name":"Hoback","id":481302,"highest":53,"p97":50,"p90":48,"p80":47,"p70":45,"p50":40}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.018,43.472]},"properties":{"name":"Raspberry","id":481307,"highest":79,"p97":72,"p90":65,"p80":57,"p70":53,"p50":43}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-111.416,41.637]},"properties":{"name":"Red Spur","id":420206,"highest":88,"p97":83,"p90":77,"p80":72,"p70":69,"p50":64}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.862,40.285]},"properties":{"name":"Fort Duchesne","id":421415,"highest":102,"p97":95,"p90":87,"p80":80,"p70":77,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.908,39.545]},"properties":{"name":"Wildhorse","id":421416,"highest":114,"p97":103,"p90":94,"p80":85,"p70":80,"p50":69}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-113.385,38.308]},"properties":{"name":"Brimstone Reservoir","id":422203,"highest":116,"p97":105,"p90":97,"p80":89,"p70":86,"p50":81}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.639,37.984]},"properties":{"name":"Cottonwood Mountain","id":422503,"highest":109,"p97":103,"p90":97,"p80":90,"p70":85,"p50":74}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-112.025,37.2]},"properties":{"name":"Telegraph Flat","id":422902,"highest":116,"p97":107,"p90":100,"p80":92,"p70":86,"p50":80}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.806,42.276]},"properties":{"name":"Kelly","id":481208,"highest":92,"p97":87,"p90":81,"p80":75,"p70":68,"p50":57}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-110.527,42.491]},"properties":{"name":"Snider Basin","id":481306,"highest":73,"p97":65,"p90":55,"p80":50,"p70":45,"p50":39}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-109.747,42.915]},"properties":{"name":"Half Moon","id":481309,"highest":83,"p97":74,"p90":68,"p80":60,"p70":56,"p50":47}}]}
    var pointAr = geojsonObject.features;
    var percentileOb = {};

    pointAr.map((curr)=>{
      // console.log(curr)
      // console.log('curr', curr.properties)
      // console.log('assi',assignValue(curr))
      var id = curr.properties.id;
      var percentileObAr = [curr.properties.highest, curr.properties.p97, curr.properties.p90,curr.properties.p80,curr.properties.p70,curr.properties.p50];
      assignValue(id,percentileObAr)
      
    })

    var createTextStyle = function(feature, resolution) {
      // var align = dom.align.value;
      // var baseline = dom.baseline.value;
      // var size = dom.size.value;
      // var offsetX = parseInt(dom.offsetX.value, 10);
      // var offsetY = parseInt(dom.offsetY.value, 10);
      // var weight = dom.weight.value;
      // var placement = dom.placement ? dom.placement.value : undefined;
      // var maxAngle = dom.maxangle ? parseFloat(dom.maxangle.value) : undefined;
      // var overflow = dom.overflow ? (dom.overflow.value == 'true') : undefined;
      // var rotation = parseFloat(dom.rotation.value);
      // if (dom.font.value == '\'Open Sans\'' && !openSansAdded) {
      //   var openSans = document.createElement('link');
      //   openSans.href = 'https://fonts.googleapis.com/css?family=Open+Sans';
      //   openSans.rel = 'stylesheet';
      //   document.getElementsByTagName('head')[0].appendChild(openSans);
      //   openSansAdded = true;
      // }
      // var font = weight + ' ' + size + ' ' + dom.font.value;
      // var fillColor = dom.color.value;
      // var outlineColor = dom.outline.value;
      // var outlineWidth = parseInt(dom.outlineWidth.value, 10);

      return new ol.style.Text({
        textAlign: 'end',
        // textBaseline: baseline,
        // font: font,resolution < 5000 ? feature.get('') : '';
        text: resolution < 2000 ? feature.get('name') : '',
        // fill: new ol.style.Fill({color: fillColor}),
        stroke: new ol.style.Stroke({color: 'white', width: 2}),
        offsetX: 5
        // offsetY: offsetY,
        // placement: placement,
        // maxAngle: maxAngle,
        // overflow: overflow,
        // rotation: rotation
      });
    };


    // var colorPoint = function(id){
    //   var ptColor = stnInfo[id]
    //   var newColor;
    //   var erc;
    //   if(stnInfo[id]!==undefined){
    //     newColor = ptColor.color;
    //   }
    //   else{
    //     newColor = 'grey'
    //   }
    //   return new ol.style.Fill({color: newColor})
    // }

    var getDot = function(id){
      var ptColor = stnInfo[id];
      var color;
      var erc;
      var directory = './smallIcons/';
      if(stnInfo[id]!==undefined){
        color = ptColor.color;
        var arrow = ptColor.arrow;
        var imgName = directory + ptColor.color + ptColor.arrow + '.png';
      }
      else{
        var imgName =  directory + 'nodata.png';
      }
      return imgName
    }

    // var pointStyleFunction = function(feature,resolution){
    //   var id = feature.get('id');
    //   return new ol.style.Style({
    //     image: new ol.style.Circle({
    //       radius: 6,
    //       fill: colorPoint(id),
    //       stroke: new ol.style.Stroke({color: 'black', width: 0.5})
    //     }),
    //     text: createTextStyle(feature,resolution)
    //   });
    // }

    var pointStyleFunction = function(feature,resolution){
      var id = feature.get('id');
      return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            crossOrigin: 'anonymous',
            src: getDot(id)
            // img: undefined,
            // imgSize: img ? [img.width, img.height] : undefined
          })),
        text: createTextStyle(feature,resolution)
      });
    }



    
    // console.log('percentileOb', JSON.stringify(percentileOb))

    var vectorSource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject, {
        dataProjection : 'EPSG:4326', 
        featureProjection: 'EPSG:3857'
      })  
    });

    function createStyle(img) {
      console.log('img',img)
      return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 0.96],
          crossOrigin: 'anonymous',
          src: './smallIcons/bluedown.png',
          img: img,
          imgSize: img ? [img.width, img.height] : undefined
        }))
      });
    }

    var iconFeature = new ol.Feature(new ol.geom.Point([0, 0]));
    iconFeature.set('style', createStyle(undefined));


    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([44.169, -114.926], -1e6)));
    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle(ol.proj.transform([-114.012036, 40.440194], 'EPSG:4326','EPSG:3857'), 1e6)));
    var rawsPoints = new ol.layer.Vector({
      // projection: 'EPSG:3857',
      source: vectorSource,
      name: 'rawsPoints',
      // style: styleFunction
      style: pointStyleFunction
    });

    var featureOverlay = new ol.layer.Vector({
      name: 'featureOverlay',
      source: new ol.source.Vector(),
      map: map,
      style: function(feature, resolution) {
        var text = resolution < 5000 ? feature.get('') : '';
        if (!highlightStyleCache[text]) {
          highlightStyleCache[text] = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#f00',
              width: 1
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255,0,0,0.1)'
            }),
            text: new ol.style.Text({
              font: '12px Montserrat, sans-serif',
              text: text,
              fill: new ol.style.Fill({
                color: '#000'
              }),
              stroke: new ol.style.Stroke({
                color: '#f00',
                width: 3
              })
            })
          });
        }
        return highlightStyleCache[text];
      }
    });

    var highlight;

    var makePopup = function(evt,feat){
      var coord = evt.coordinate;
      var stnId = feat.get('id');
      var stnName = feat.get('name');
      var infStn = stnInfo[stnId];
      var ercCur = infStn.erc;
      var lowerPerc  =infStn.lower;
      var lowerV = infStn.lowerVal;
      var upperPerc = infStn.upper;
      var upperV = infStn.upperVal;
      var trendIs = infStn.trend;
      var above = infStn.above;
      var below = infStn.below;
      // console.log('a',above,'b',below)
      // content.innerHTML = stnName + ' RAWS(' + stnID + ') ERC is ' + trendIs + 'Current ERC Calue: ' + ercCur + 'ERC is between ' + lowerPerc + ' and ' + upperPerc;
      if(above == true && below == false){
        // console.log('above true')
        content.innerHTML = stnName + ' RAWS (' + stnId + ') <br />ERC is ' + trendIs + '<br />Current ERC Value: ' + ercCur + '<br />ERC is above ' + percNameMap.get(lowerPerc)  +'<br />' + percNameMap.get(lowerPerc) + ': ' + lowerV;
      }
      else if (below == true && above == false){
        // console.log('below true')
        content.innerHTML = stnName + ' RAWS (' + stnId + ') <br />ERC is ' + trendIs + '<br />Current ERC Value: ' + ercCur + '<br />ERC is below ' + percNameMap.get(lowerPerc) +'<br />'  + percNameMap.get(upperPerc) + ': ' + upperV;
      }
      else{
        // console.log('between')
        content.innerHTML = stnName + ' RAWS (' + stnId + ') <br />ERC is ' + trendIs + '<br />Current ERC Value: ' + ercCur + '<br />ERC is between ' + percNameMap.get(lowerPerc) + ' and ' + percNameMap.get(upperPerc) +'<br />' + percNameMap.get(lowerPerc) + ': ' + lowerV + '<br />' + percNameMap.get(upperPerc) + ': ' + upperV;
      }
      overlay.setPosition(coord)
    }
    var average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    var getPSAAvg = async function(stnInfo,psa) {
      // console.log('pixel', pixel)
      let psaInfo = await ajax({method: 'GET',url: './data/PSARawsInfo.json'})
      var rawsObj = psaInfo[psa].RAWS;
      var psaErcArray1 = [];
      var psaHunArray = [];
      for(var prop in rawsObj){
        var stnData = stnInfo[prop];
        if(stnData !== undefined){
          var stnERC = stnData.erc;
          var stnHun = stnData.hunHr
          if (stnERC != "missing"){
            psaErcArray1.push(parseInt(stnERC))
          }
          if (stnHun != "missing"){
            psaHunArray.push(parseInt(stnHun))
          }

        }
      }
      var ercAvg = average(psaErcArray1)
      var hunAvg = average(psaHunArray)
      var psaDataArray = [Math.round(ercAvg),Math.round(hunAvg)]
        // console.log(psa,average(psaErcArray1),psaErcArray1)
      
      return psaDataArray
      // console.log(ercAvg)
    }
    // getPSAAvg(stnInfo,"GB03")
    var displayFeatureInfo =  async function(pixel,feat) {
      // console.log('pixel', pixel)
      let rawsInfo = await ajax({method: 'GET',url: './data/rawsAllInfoElev.json'})
      var feature = feat;
      if (feature) {
        var testT = document.getElementById('test');
        psaNm = feature.get('NUMBER');
        var rawsDetailAr = [];
        var rawsDetail;
          rawsInfo.map((curr)=>{
            if (curr.PSA == psaNm){
              rawsDetailAr.push(curr)
              rawsDetail = curr;
            }
          })
        var PSA = rawsDetail.PSA;
        var psaRaws = rawsDetail.RAWS;
        var rawsIdArray = Object.keys(psaRaws)
        var rawsAmt = rawsIdArray.length;
        var psaAvg = getPSAAvg(stnInfo,psaNm).then((val)=>{
          var ercDiv = document.getElementById('avgERC');
          ercDiv.innerHTML = 'PSA Average ERC: ' + val[0] + '<br />PSA Average 100 hr: ' + val[1];
          console.log('observerd erc/fm',val)
        })
        // console.log(psaAvg)
        
        testT.innerHTML = '<img class="card-img-top" src="data/'+ psaNm +'.jpg" alt="Card image cap" id="matrixImage">';
        var tablehtml = '<div id = "avgERC"></div> RAWS Info<br /><table class="table table-hover"><thead>';
            tablehtml +='<tr> <th scope="col">Name</th><th scope="col">ID</th><th scope="col">Lat</th><th scope="col">Lon</th><th scope="col">Elevation</th>';
            tablehtml +='</tr></thead><tbody>';
        //     
        // detailDiv.innerHTML += rawsDetail.PSA;
        for(let value of rawsIdArray){
          var f = rawsDetail.RAWS[value];
          tablehtml += '<tr><th scope="row">' + f.name + '</th><td>' + value + '</td><td>' + f.lat + '</td><td>'+ f.lon + '</td><td>'+ f.elevation + '</td></tr>';
        }
        tablehtml += '</tbody></table>';
        detailDiv.innerHTML = tablehtml;
        console.log(rawsDetail)
        // psaNm = feature.get('NUMBER');
        // info.innerHTML = feature.getId() + ': ' + feature.get('NAME');
        infoArea.innerHTML = feature.get('NUMBER') + ': ' + feature.get('NAME');
        // matrixArea.innerHTML = feature.get('NUMBER') + ': ' + feature.get('NAME');
        var matImg = document.getElementById('matrixImage');
        var matImgLink = document.getElementById('linkImg');
        // matImg.src = 'data/test.jpg';
        matImg.src = 'data/' + psaNm + '.jpg';
        matImg.alt = psaNm;
        // matImgLink.href = 'data/' + psaNm + '.jpg';
        console.log('PSA',feature.get('NUMBER') )
        // matrixArea.setAttribute('src', './data/gb01.jpg');
        // matrixArea.setAttribute('src', './data/' + feature.get('NUMBER') + '.jpg');
        // hundred.setAttribute('src', './WebCharts/' + feature.get('NUMBER') + '/FM100Graph.PNG');
        // thousand.setAttribute('src', './WebCharts/' + feature.get('NUMBER') + '/FM1000Graph.PNG');
      } 
      else {
        infoArea.innerHTML = '&nbsp;';
      }
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
                console.log('features',featureOverlay.getSource())

          featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
      }

      var modal = document.getElementById('myModal');

      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var img = document.getElementById('matrixImage');
      var modalImg = document.getElementById("img01");
      var captionText = document.getElementById("caption");
      img.onclick = function(){
          console.log('modlimg', psaNm)
          modal.style.display = "block";
          modalImg.src = 'data/'+ psaNm +'.jpg';
          modalImg.alt = psaNm;
          captionText.innerHTML = this.alt;
      }

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() { 
          modal.style.display = "none";
      }
    };

    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
      }),
      text: new ol.style.Text({
        font: '12px Montserrat, sans-serif',
        fill: new ol.style.Fill({
          color: '#000'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3
        })
      })
    });


var createLayerTextStyle = function(feature, resolution) {
 return new ol.style.Text({
    font: '12px Montserrat, sans-serif',
    text: resolution < 5000 ? feature.get('NUMBER') : '',
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 3
    })
  });
};

var layerStyleFunction1 = function(feature,resolution){
        return new ol.style.Style({
        fill: new ol.style.Fill({
          color: getPsaColor(stnInfo,feature.get('NUMBER'))
        }),
        stroke: new ol.style.Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: createLayerTextStyle(feature,resolution)
      })};
var layerStyleFunction = function(feature, resolution) {
        style.getText().setText(resolution < 5000 ? feature.get('NUMBER') : '');
        return style;
      }        


    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        // url: 'layers/agai.geojson',
        url: 'layers/gbccPSAs3857.geojson',
        projection: 'EPSG:3857',
        format: new ol.format.GeoJSON()
      }),
      name:'PSAs',
      minResolution: 0,
      maxResolution: 5000,
      visible: true,
      style: layerStyleFunction1
    });

  

    var overallView = new ol.View({
      // center: ol.proj.transform([-114.012036, 40.440194], 'EPSG:4326','EPSG:3857'),
      // projection: 'EPSG:4326',
      // center: ol.proj.transform([-12753260.184760537, 4948659.629345282], 'EPSG:3857', 'EPSG:4326'),
      projection: 'EPSG:3857',
      center: [-12753260.184760537, 4948659.629345282],
      zoom: 5.55,
      // minZoom: 5,
      // maxZoom: 9.8,
      // extent:[ -13385849.855545742, 4164163.9360093023, -12120670.513975333, 5733155.322681262 ]
    });




    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          source: new ol.source.TileJSON({
            url: 'https://api.tiles.mapbox.com/v3/' +
              'mapbox.natural-earth-hypso-bathy.json',
            crossOrigin: 'anonymous'
          }),
          wrapX: false,
          minResolution: 500,
          maxResolution: 50000
        }),
        vectorLayer,
        rawsPoints,
        new ol.layer.Vector({
          style: function(feature) {
            return feature.get('style');
          },
          source: new ol.source.Vector({features: [iconFeature]})
        })
      ],
      overlays: [overlay],
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }),
      view: overallView
    });

    map.on('click', function(evt) {
      var pixel = map.getEventPixel(evt.originalEvent);
      var pix = evt.pixel;
      var feats = map.forEachFeatureAtPixel(pixel,function (feature,layer) {
        // console.log('name',layer.get('name'))
        var newObj = {
          'name': layer.get('name'),
          'feature':feature
        }
        return newObj
        },{
            layerFilter: function (layer) {
              if(layer.get('name') === 'PSAs'){
                return layer.get('name') === 'PSAs';
              }
              else if(layer.get('name') === 'rawsPoints') {
                return layer.get('name') === 'rawsPoints';
              }
            }
        });
      var feat = feats.feature;
      var layerName = feats.name;
      if(feat!==undefined){
        if(layerName == 'PSAs'){
          displayFeatureInfo(pix,feat)
        }
        else if(layerName == 'rawsPoints'){
          makePopup(evt,feat)
          
          }
      }
      else{
        console.log('notPSAlayer')
      }

    });
    var info = document.getElementById('info');
  }
 )