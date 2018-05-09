var assignValue = function(id,obAr){
      // console.log('obAr',obAr)
      if (ercDay1[id]!==undefined){
        var erc = ercDay1[id].erc;
        var oneHr = ercDay1[id].oneHr;
        var tenHr = ercDay1[id].tenHr;
        var hunHr = ercDay1[id].hunHr;
        var thouHr = ercDay1[id].thouHr;
        var date = ercDay1[id].obDate;
        dateDiv.innerHTML = 'RAWS Observations from ' + date + ' at 1800 MDT';
       }
      else {
        var erc = 'missing';
        }

      if (ercDay3[id]!==undefined){
        var erc3 = ercDay3[id].erc
        // console.log('erc3',erc - erc3)
       }
      else {
        var erc3 = 'missing';
        } 

      if(erc!=='missing'){
        var b = obAr.reduce((prev,curr,i)=>{
          var len = obAr.length;
          var last = prev[i-1]
          var trend = (erc3 !=='missing') ? erc - erc3 : 'missing';
          var trendText;
          if(trend>0){
            trendText = "increasing";
          }
          else if (trend<0){
            trendText = "decreasing";
          }
          else{
            trendText = "missing";
          }

          if(hunHr>=50) {
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'green',
                'trend' : trendText
              }
          }
          else if (hunHr<50 && hunHr>=25){
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'yellow',
                'trend' : trendText
              }
          }
          else if (hunHr<25 && hunHr>=15){
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'orange',
                'trend' : trendText
              }
          }
          else if (hunHr<15 && hunHr>=10){
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'pink',
                'trend' : trendText
              }
          }
          else if (hunHr<10 && hunHr>=5){
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'red',
                'trend' : trendText
              }
          }
          else if (hunHr<5 && hunHr>=0){
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'purple',
                'trend' : trendText
              }
          }
          else{
            stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : 'grey',
                'trend' : trendText
              }
          }
          // console.log('id',id,'curr',curr,'last' ,last,'erc',erc,'i',i)
          if(i == 0){
          // console.log('i is 0')
            var last = curr
              if(erc>curr){
                // console.log('highest!',pos[i], 'curr',curr,'last',last,'erc',erc)
                stnInfo[id] = {
                'erc' : erc, 
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr, 
                'upper' : pos[i], 
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : colorMap.get(pos[i]),
                'trend' : trendText
              };
              }
              else{
                if(erc>curr && erc<last){
              // console.log('hi!',i,pos[i],'curr',curr,'last',last,'erc',erc)
              stnInfo[id] = {
                'erc' : erc,
                'oneHr': oneHr,
                'tenHr' : tenHr,
                'hunHr': hunHr,
                'thouHr' : thouHr,   
                'upper' : pos[i],
                'upperVal' : last,
                'lower' : pos[i],
                'lowerVal' : curr,
                'color' : colorMap.get(pos[i]),
                'trend' : trendText
              };
            }}
          }
          else if(i == len-1){
          // console.log('last')
            if(erc<curr){
              // console.log('lowest!',pos[i],'curr',curr,'last',last,'erc',erc)
              stnInfo[id] = {
              'erc' : erc,
              'oneHr': oneHr,
              'tenHr' : tenHr,
              'hunHr': hunHr,
              'thouHr' : thouHr,   
              'upper' : pos[i-1],
              'upperVal' : last,
              'lower' : pos[i],
              'lowerVal' : curr,
              'color' : colorMap.get(pos[i]),
              'trend' : trendText
            };
            }
            else{if(erc>curr && erc<last){
            // console.log('hi!',i,pos[i],'curr',curr,'last',last,'erc',erc)
            stnInfo[id] = {
              'erc' : erc,
              'oneHr': oneHr,
              'tenHr' : tenHr,
              'hunHr': hunHr,
              'thouHr' : thouHr,   
              'upper' : pos[i-1],
              'upperVal' : last,
              'lower' : pos[i],
              'lowerVal' : curr,
              'color' : colorMap.get(pos[i]),
              'trend' : trendText
            };
          }}
          }
          else{
          // console.log('middle')
          if(erc>curr && erc<last){
            // console.log('hi!',i,pos[i],'curr',curr,'last',last,'erc',erc)
            stnInfo[id] = {
              'erc' : erc,
              'oneHr': oneHr,
              'tenHr' : tenHr,
              'hunHr': hunHr,
              'thouHr' : thouHr,   
              'upper' : pos[i-1],
              'upperVal' : last,
              'lower' : pos[i],
              'lowerVal' : curr,
              'color' : colorMap.get(pos[i]),
              'trend' : trendText
            };
          }}
          prev.push(curr)
          return prev
        },[])
      }
      else{
        console.log('missing ERC', id)
          var trend = 'missing';
          stnInfo[id] = {
              'erc' : 'missing',
              'oneHr': 'missing',
              'tenHr' : 'missing',
              'hunHr': 'missing',
              'thouHr' : 'missing',   
              'upper' : 'missing',
              'lower' : 'missing',
              'color' : 'grey',
              'trend' : 'missing'
            };
      }
    }