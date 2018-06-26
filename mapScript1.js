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
  // let ercDay1 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day3'}) 
  let ercDay1 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day1'}) 
  let ercDay2 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day2'}) 
  let ercDay3 = await ajax({method: 'GET',url: 'https://www.ercserver.us/day3'}) 
  let psaThresh = await ajax({method: 'GET',url: './data1/rawsAllInfo.json'})
  let psaInfo = await ajax({method: 'GET',url: './data1/psaRawsInfo.json'})
  let rawsInfo = await ajax({method: 'GET',url: './data1/rawsAllInfoElev.json'})
  var geojsonObject =  await ajax({method: 'GET',url: './data1/geoJsonObject.json'});
  var realThresh =  await ajax({method: 'GET',url: './data1/rawsInfoPercentiles.json'});

  var stnInfo = {}
 
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
        // dateDiv.innerHTML = 'RAWS Observations from ' + date + ' at 1800 MDT';

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

  // var pointAr = geojsonObject.features;
  var pointAr = realThresh.RAWS;
  console.log(pointAr)
  var percentileOb = {};

    pointAr.map((curr)=>{
      // console.log(curr)
      var id = curr.id;
      var percentileObAr = [curr.highest, curr.p97, curr.p90,curr.p80,curr.p70,curr.p50];
      assignValue(id,percentileObAr)
      
    })

  var dataArray = [ercDay1,ercDay2,ercDay3,psaThresh,psaInfo,rawsInfo,stnInfo,geojsonObject];
  // console.log('ercDat', day1)
  return dataArray
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

    var stnInfo = g[6];
    var geojsonObject = g[7];
    var infoArea = document.getElementById('infoArea');
    var matrixArea = document.getElementById('matrixArea');
    var detailDiv = document.getElementById('details');
    var dateDiv = document.getElementById('date');

    
    var pos = ['highest','p97','p90','p80','p70','p50'];

    var colorAr = [['highest','purple'],['p97','pink'],['p90','red'],['p80','orange'],['p70','yellow'],['p50','green']];
    var colorMap = new Map(colorAr);

    var percNameAr = [['highest','highest'],['p97','97th percentile'],['p90','90th percentile'],['p80','80th percentile'],['p70','70th percentile'],['p50','50th percentile']];
    var percNameMap = new Map(percNameAr);

    var average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    var getPSAAvg = function(stnInfo,psa) {
      var psaInfo = g[4];
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
      // console.log("psaDataArray", psaDataArray)
        // console.log(psa,average(psaErcArray1),psaErcArray1)
      
      return psaDataArray
      // console.log(ercAvg)
    }

    var getPSAAvg1 = function(stnInfo,psa) {
      // console.log('psa',psa)
      var psaInfo = g[4];
      // console.log(JSON.parse(JSON.stringify(stnInfo)))
      var rawsObj = psaInfo[psa].RAWS;
      var psaErcArray1 = [];
      var psaHunArray = [];
      for(var prop in rawsObj){
        var stnData = stnInfo[prop];
        // console.log('prop',prop)
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
      console.log("psaErcArray1", psaErcArray1)
        // console.log(psa,average(psaErcArray1),psaErcArray1)
      
      return psaDataArray
      // console.log(ercAvg)
    }

    console.log(getPSAAvg1(stnInfo,"GB35"))

    var getPsaColor = function(stnInfo,layerPsa){
      var psaThresh = g[3];
      var psaColor;
      // console.log(stnInfo)
      psaThresh.map((curr)=>{
        var psa = curr.PSA;
        if(layerPsa == psa){
          // console.log('here')
          if(curr.matrix!==undefined){
            var attempt = getPSAAvg(stnInfo,psa)
          
            // console.log(g)
            var erc = attempt[0];
            // var erc = 10;
            var fm = attempt[1];
            // var fm = 13;
            // console.log('erc',erc,'fm',fm)
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
              // console.log("green erc",psa,erc,fm)
              layerColor = "rgba(139,197,108,0.8)";
              psaColor = layerColor;
            }
            else if((erc >= greenErc2[0] && fm >= greenFm2[0]) && (erc <= greenErc2[1] && fm <= greenFm2[1])){
              // console.log("green erc",psa,erc,fm)
              layerColor = "rgba(139,197,108,0.8)";
              psaColor = layerColor;
            }
            else if((erc >= yellowErc1[0] && fm >= yellowFm1[0]) && (erc <= yellowErc1[1] && fm <= yellowFm1[1])){
              // console.log("yellow erc")
              layerColor = "rgba(251,250,115,0.8)";
              psaColor = layerColor;
            }
            else if((erc >= yellowErc2[0] && fm >= yellowFm2[0]) && (erc <= yellowErc2[1] && fm <= yellowFm2[1])){
              // console.log("yellow erc")
              layerColor = "rgba(251,250,115,0.8)";
              psaColor = layerColor;
            }
            else if((erc >= brownErc[0] && fm >= brownFm[0])&&( erc <= brownErc[1] && fm <= brownFm[1])){
              // console.log("brown erc")
              layerColor = "rgba(225,198,148,0.8)";
              psaColor = layerColor;
            }
            else{
              // console.log("green cause didn't fit",psa,erc,fm)
              layerColor = "grey";
              psaColor = layerColor;
            }

          
          // console.log(average1)
        }
        else{
             layerColor = "grey";
              psaColor = layerColor;
        }
        return psaColor
        }
        
      })
      return psaColor
      // console.log(psaThresh,"GB35")
    }

   var col = getPsaColor(stnInfo,"GB35")
   console.log('col',col)

   getPsaColor1 = function(stnInfo,layerPsa){
      var psaThresh = g[3];
      var b;
      psaThresh.map((curr)=>{
        if(layerPsa == curr.PSA){
          b = layerPsa
        }
      })
      // console.log(psaThresh)
      return b
    }
   var col1 = getPsaColor1(stnInfo,"GB35");
   console.log(col1)

    
    
    // console.log('stnInfo',stnInfo)
    var highlightStyleCache = {};
    var psaNm;

    var ercDay1 = g[0];
    var ercDay2 = g[1];
    var ercDay3 = g[2];
    // console.log('day1', ercDay1)
    var obDate = ercDay1[Object.keys(ercDay1)[0]]
    dateDiv.innerHTML='Observations from ' + obDate.obDate ;
    console.log('day1', obDate)
    
    
    

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


    window.app = {};
    var app = window.app;

    app.RotateNorthControl = function(opt_options) {

        var options = opt_options || {};

        var button = document.createElement('div');
        button.innerHTML = '<div><input id="checkBox" type="checkbox" checked> RAWS Percentiles</div>';

        var this_ = this;
        var handleRotateNorth = function() {
          this_.getMap().getView().setRotation(0);
        };
 
        button.addEventListener('click', toggleLayer);

        var element = document.createElement('div');
        element.className = 'rotate-north ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
          element: element,
          target: options.target
        });

      };
      ol.inherits(app.RotateNorthControl, ol.control.Control);

    // var toggleBtn = document.getElementById('toggleRaws');
    // toggleBtn.addEventListener('click',toggleLayer(rawsPoints))
    // toggleBtn.addEventListener('click',toggleLayer)
    // toggleBtn.innerHTML='hi'

    function toggleLayer() {
      // console.log(layerName)
      // var layerNm = layerName.get('name');
      // console.log(layerNm)
      // console.log(layerName.get('name').getVisible())
      var visibility = rawsPoints.getVisible();
      console.log(visibility)
      if(visibility == true){
        console.log('visible')
        rawsPoints.setVisible(false)
      }
      else if(visibility == false){
        console.log('false')
        rawsPoints.setVisible(true)
        }
      // if (layerName.getVisibility() == true) {
      //     layerName.setVisibility(false);
      // } else {
      //     layerName.setVisibility(true);
      // }
    }

    var iconFeature = new ol.Feature(new ol.geom.Point([0, 0]));
    iconFeature.set('style', createStyle(undefined));


    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([44.169, -114.926], -1e6)));
    // vectorSource.addFeature(new ol.Feature(new ol.geom.Circle(ol.proj.transform([-114.012036, 40.440194], 'EPSG:4326','EPSG:3857'), 1e6)));
    var rawsPoints = new ol.layer.Vector({
      // projection: 'EPSG:3857',
      source: vectorSource,
      name: 'rawsPoints',
      visible: true,
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
    
    // getPSAAvg(stnInfo,"GB03")
    var displayFeatureInfo =  function(pixel,feat) {
      // console.log('pixel', pixel)
      let rawsInfo = g[5];
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
        var psaAvg = getPSAAvg(stnInfo,psaNm);
        var ercDiv = document.getElementById('avgERC');
        // ercDiv.innerHTML = 'PSA Average ERC: ' + psaAvg + '<br />PSA Average 100 hr: ' + psaAvg;
        // console.log('observerd erc/fm',val)
        
        console.log(psaAvg)
        
        testT.innerHTML = '<img class="card-img-top" src="data/'+ psaNm +'.jpg" alt="Card image cap" id="matrixImage">';
        var tablehtml = '<div id = "avgERC">Average ERC: ' + psaAvg[0] + ' Average FM100: ' + psaAvg[1] + '</div> RAWS Info<br /><table class="table table-hover"><thead>';
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
          color: 'rgba(0,0,0,0.3)',
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
        }).extend([
          new app.RotateNorthControl()
        ]),
      view: overallView
    });

    map.on('click', function(evt) {
      // toggleLayer(rawsPoints)
      // rawsPoints.setVisible(false)
      console.log(rawsPoints.getVisible())
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