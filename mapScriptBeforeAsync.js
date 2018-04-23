
      function ajax(options) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(options.method, options.url);
          xhr.responseType = '';
          xhr.onload = function() {
            if (this.status <= 200 && this.status < 300) {
              resolve(xhr.response);
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

      var result;
      
      ajax({
        method: 'GET',
        url: './data/rawsAllInfo.json'
      })
      // .then(function(firstValue) {
      //   result = JSON.parse(firstValue);
      //   return ajax({
      //     method: 'GET',
      //     url: 'getMatrices.php'
      //   }); 
      // })
      .then(function(firstValue) {
        result = JSON.parse(firstValue);
        return result
        // document.getElementById('timestamp').innerHTML = "<strong>RAWS observations updated " + secondValue + "</strong>";
        // console.log('firstValue', JSON.parse(firstValue))
      })
      .catch(function(error) {
        console.error('damnit.', error.statusText);
      });
      console.log('result', result)

      var infoArea = document.getElementById('infoArea');
      var matrixArea = document.getElementById('matrixArea');

      var highlightStyleCache = {};
      var psaNm;

      var featureOverlay = new ol.layer.Vector({
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


      var displayFeatureInfo = function(pixel) {
        var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });
        console.log('feature', feature)

        // var info = document.getElementById('info');
        if (feature) {
          var testT = document.getElementById('test');
          psaNm = feature.get('NUMBER');
          testT.innerHTML = '<img class="card-img-top" src="data/'+ psaNm +'.jpg" alt="Card image cap" id="matrixImage">';
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
        } else {
          infoArea.innerHTML = '&nbsp;';
        }
        console.log('highlight', highlight)
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

      



      var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          // url: 'layers/agai.geojson',
          url: 'layers/gbccPSAs3857.geojson',
          projection: 'EPSG:3857',
          format: new ol.format.GeoJSON()
        }),
        minResolution: 0,
        maxResolution: 5000,
        visible: true,
        style: function(feature, resolution) {
          style.getText().setText(resolution < 5000 ? feature.get('NUMBER') : '');
          return style;
        }
      });

      // var vectorLayer = new ol.layer.Vector({
      //   title: 'added Layer',
      //   source: new ol.source.GeoJSON({
      //      projection : 'EPSG:3857',
      //      url: 'layers/convert.geojson'
      //   })
      // })

      // var gbProjection = new ol.proj.Projection({
      //   code: 'EPSG:4269',
      //   // The extent is used to determine zoom level 0. Recommended values for a
      //   // projection's validity extent can be found at https://epsg.io/.
      //   extent: [-172.54 , 23.81, -47.74, 86.46],
      //   units: 'degrees'
      // });
      // ol.proj.addProjection(gbProjection);

      var overallView = new ol.View({
        // center: ol.proj.transform([-114.012036, 40.440194], 'EPSG:4326','EPSG:3857'),
        center: [-12753260.184760537, 4948659.629345282],
        zoom: 5.55,
        // minZoom: 5,
        // maxZoom: 9.8,
        extent:[ -13385849.855545742, 4164163.9360093023, -12120670.513975333, 5733155.322681262 ]
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
          vectorLayer
        ],
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
        displayFeatureInfo(evt.pixel);
        // flyToDispatch(evt.pixel);
      });

      // Get the modal

      var info = document.getElementById('info');

