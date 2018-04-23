var e = [
		{
			
				"PSA": "GB01",
				"name": "Payette",
				"RAWS": {
					"101402": "Catfish",
					"101224": "Taylor Ranch",
					"101109": "Snake",
					"101220": "Teapot",
					"101108": "Weiser",
					"101223": "Ski Hill",
					"101044": "Lodgepole"
				}
			
		},
		{
			 
				"PSA" : "GB02",
				"name": "Central Idaho",
				"RAWS": {
					"101303": "Indianola",
					"101805": "Little Creek",
					"101310": "Salmon",
					"101311": "Skull",
					"101315": "Kriley Creek",
					"101803": "Challis",
					"101312": "Leadore",
					"101314": "Ezra",
					"101316": "Red Rock Peak"
				}
			
		}
	];




var j = {
    "RAWS":[{
    "name":"ezra",
    "lat":44.849,
    "lon":-114.026,
    "id":101314,
    "highest":98,
    "p97":93,
    "p90":88,
    "p80":83,
    "p70":78,
    "p50":70
  },
  {
    "name":"kriley creek",
    "lat":45.356,
    "lon":-113.895,
    "id":101315,
    "highest":97,
    "p97":92,
    "p90":87,
    "p80":83,
    "p70":77,
    "p50":68
  },
  {
    "name":"Red Rock Peak",
    "lat":44.988,
    "lon":-114.418,
    "id":101316,
    "highest":98,
    "p97":91,
    "p90":86,
    "p80":78,
    "p70":68,
    "p50":57
  }]};

  // var k = 
  var newAr = []
  var f = j.RAWS;
  // f.map((curr)=>{
  // 	var arPush = {
  // 		curr.id + ':' 

  // 	}
  // })

  e.map((curr)=>{
  	var gbInfo = curr;
  	var stns = gbInfo.RAWS;
  	var stnAr = Object.keys(stns);
  	// console.log('e curr', curr)
  	for(let val of stnAr){
  		f.map((curr, i)=>{
  			if(curr.id == val){
	  			// console.log(curr.id, 'va', val, 'i', i, 'curr', curr, 'gbInfo', gbInfo)
	  			// console.log(gbInfo.RAWS[val])
	  			// var arOjb = gbInfo;
	  			var name = gbInfo.RAWS[val];
	  			gbInfo.RAWS[val] = {
	  				"name" : name,
	  				"lat" : curr.lat,
	  				"lon" : curr.lon,
				    "highest":curr.highest,
				    "p97": curr.p97,
				    "p90": curr.p90,
				    "p80": curr.p80,
				    "p70": curr.p70,
				    "p50": curr.p50
	  			}
  			}
  		})
  	}
  })
  console.log(e[1].RAWS[101314])
  console.log(JSON.stringify(e))

  
