/**
 * @license
 * 
 * shelly-porssisahko
 * shelly-porssisahko-en
 * 
 * (c) Jussi isotalo - http://jisotalo.fi
 * https://github.com/jisotalo/shelly-porssisahko
 * https://github.com/jisotalo/shelly-porssisahko-en
 * 
 * License: GNU Affero General Public License v3.0 
 */
const CNST={INST_COUNT:"undefined"==typeof INSTANCE_COUNT?3:INSTANCE_COUNT,HIST_LEN:"undefined"==typeof HIST_LEN?24:HIST_LEN,ERR_LIMIT:3,ERR_DELAY:120,DEF_INST_ST:{chkTs:0,st:0,str:"",cmd:-1,configOK:0,fCmdTs:0,fCmd:0},DEF_CFG:{COM:{g:"fi",vat:25.5,day:0,night:0,names:[]},INST:{en:0,mode:0,m0:{c:0},m1:{l:0},m2:{p:24,c:0,l:-999,s:0,m:999,ps:0,pe:23,ps2:0,pe2:23,c2:0},b:0,e:0,o:[0],f:0,fc:0,i:0,m:60,oc:0}}};let _={s:{v:"3.1.0",dn:"",configOK:0,timeOK:0,errCnt:0,errTs:0,upTs:0,tz:"+02:00",tzh:0,enCnt:0,p:[{ts:0,now:0,low:0,high:0,avg:0},{ts:0,now:0,low:0,high:0,avg:0}]},si:[CNST.DEF_INST_ST],p:[[],[]],h:[],c:{c:CNST.DEF_CFG.COM,i:[CNST.DEF_CFG.INST]}},_i=0,_j=0,_k=0,_inc=0,_cnt=0,_start=0,_end=0,cmd=[],prevEpoch=0,loopRunning=!1;function getKvsKey(t){let e="porssi";return e=0<=t?e+"-"+(t+1):e}function isCurrentHour(t,e){e-=t;return 0<=e&&e<3600}function limit(t,e,n){return Math.min(n,Math.max(t,e))}function epoch(t){return Math.floor((t?t.getTime():Date.now())/1e3)}function getDate(t){return t.getDate()}function updateTz(t){let e=t.toString(),n=0;"+0000"==(e=e.substring(3+e.indexOf("GMT")))?(e="Z",n=0):(n=+e.substring(0,3),e=e.substring(0,3)+":"+e.substring(3)),e!=_.s.tz&&(_.s.p[0].ts=0),_.s.tz=e,_.s.tzh=n}function log(t){console.log("shelly-porssisahko: "+t)}function addHistory(t){for(var e=0<_.s.enCnt?CNST.HIST_LEN/_.s.enCnt:CNST.HIST_LEN;0<CNST.HIST_LEN&&_.h[t].length>=e;)_.h[t].splice(0,1);_.h[t].push([epoch(),cmd[t]?1:0,_.si[t].st])}function reqLogic(){for(let t=0;t<CNST.INST_COUNT;t++)_.si[t].chkTs=0}function updateState(){var t=new Date,e=(_.s.timeOK=null!=Shelly.getComponentStatus("sys").unixtime&&2e3<t.getFullYear(),_.s.dn=Shelly.getComponentConfig("sys").device.name,epoch(t));for(_.s.timeOK&&300<Math.abs(e-prevEpoch)&&(log("Time changed 5 min+ -> refresh"),_.s.p[0].ts=0,_.s.p[0].now=0,_.s.p[1].ts=0,_.p[0]=[],_.p[1]=[]),prevEpoch=e,_.s.enCnt=0,_i=0;_i<CNST.INST_COUNT;_i++)_.c.i[_i].en&&_.s.enCnt++;!_.s.upTs&&_.s.timeOK&&(_.s.upTs=epoch(t))}function getConfig(p){var t=getKvsKey(p);Shelly.call("KVS.Get",{key:t},function(e,t,n){p<0?_.c.c=e?JSON.parse(e.value):{}:_.c.i[p]=e?JSON.parse(e.value):{},"function"==typeof USER_CONFIG&&USER_CONFIG(p,!0);{e=p;var s=function(t){p<0?_.s.configOK=t?1:0:(log("config for #"+(p+1)+" read, enabled: "+_.c.i[p].en),_.si[p].configOK=t?1:0,_.si[p].chkTs=0),loopRunning=!1,Timer.set(500,!1,loop)};let t=0;if(CNST.DEF_CFG.COM||CNST.DEF_CFG.INST){var o,i=e<0?CNST.DEF_CFG.COM:CNST.DEF_CFG.INST,r=e<0?_.c.c:_.c.i[e];for(o in i)if(void 0===r[o])r[o]=i[o],t++;else if("object"==typeof i[o])for(var c in i[o])void 0===r[o][c]&&(r[o][c]=i[o][c],t++);e>=CNST.INST_COUNT-1&&(CNST.DEF_CFG.COM=null,CNST.DEF_CFG.INST=null),0<t?(e=getKvsKey(e),Shelly.call("KVS.Set",{key:e,value:JSON.stringify(r)},function(t,e,n,s){e&&log("failed to set config: "+e+" - "+n),s(0==e)},s)):s(!0)}else s(!0)}})}function loop(){try{if(!loopRunning)if(loopRunning=!0,updateState(),_.s.configOK)if(pricesNeeded(0))getPrices(0);else if(pricesNeeded(1))getPrices(1);else{for(let t=0;t<CNST.INST_COUNT;t++)if(!_.si[t].configOK)return void getConfig(t);for(let t=0;t<CNST.INST_COUNT;t++)if(function(t){var e=_.si[t],n=_.c.i[t];if(1!=n.en)return void(_.h[t]=[]);var t=new Date,s=new Date(1e3*e.chkTs);return 0==e.chkTs||s.getHours()!=t.getHours()||s.getFullYear()!=t.getFullYear()||0<e.fCmdTs&&e.fCmdTs-epoch(t)<0||0==e.fCmdTs&&n.m<60&&t.getMinutes()>=n.m&&e.cmd+n.i==1}(t))return void Timer.set(500,!1,logic,t);"function"==typeof USER_LOOP?USER_LOOP():loopRunning=!1}else getConfig(-1)}catch(t){log("error at main loop:"+t),loopRunning=!1}}function pricesNeeded(t){var e=new Date;let n=!1;return n=1==t?_.s.timeOK&&0===_.s.p[1].ts&&15<=e.getHours():((t=getDate(new Date(1e3*_.s.p[0].ts))!==getDate(e))&&(_.s.p[1].ts=0,_.p[1]=[]),_.s.timeOK&&(0==_.s.p[0].ts||t)),_.s.errCnt>=CNST.ERR_LIMIT&&epoch(e)-_.s.errTs<CNST.ERR_DELAY?n=!1:_.s.errCnt>=CNST.ERR_LIMIT&&(_.s.errCnt=0),n}function getPrices(c){try{log("fetching prices for day "+c);let i=new Date;updateTz(i);var e=1==c?new Date(864e5+new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime()):i;let t=e.getFullYear()+"-"+(e.getMonth()<9?"0"+(1+e.getMonth()):1+e.getMonth())+"-"+(getDate(e)<10?"0"+getDate(e):getDate(e))+"T00:00:00"+_.s.tz.replace("+","%2b");var n=t.replace("T00:00:00","T23:59:59");let r={url:"https://dashboard.elering.ee/api/nps/price/csv?fields="+_.c.c.g+"&start="+t+"&end="+n,timeout:5,ssl_ca:"*"};i=null,t=null,Shelly.call("HTTP.GET",r,function(e,t,n){r=null;try{if(0!==t||null==e||200!==e.code||!e.body_b64)throw Error(t+"("+n+") - "+JSON.stringify(e));{e.headers=null,n=e.message=null,_.p[c]=[],_.s.p[c].avg=0,_.s.p[c].high=-999,_.s.p[c].low=999,e.body_b64=atob(e.body_b64),e.body_b64=e.body_b64.substring(1+e.body_b64.indexOf("\n"));let t=0;for(;0<=t;){e.body_b64=e.body_b64.substring(t);var s=[t=0,0];if(0===(t=1+e.body_b64.indexOf('"',t)))break;s[0]=+e.body_b64.substring(t,e.body_b64.indexOf('"',t)),t=2+e.body_b64.indexOf('"',t),t=2+e.body_b64.indexOf(';"',t),s[1]=+(""+e.body_b64.substring(t,e.body_b64.indexOf('"',t)).replace(",",".")),s[1]=s[1]/10*(100+(0<s[1]?_.c.c.vat:0))/100;var o=new Date(1e3*s[0]).getHours();s[1]+=7<=o&&o<22?_.c.c.day:_.c.c.night,_.p[c].push(s),_.s.p[c].avg+=s[1],s[1]>_.s.p[c].high&&(_.s.p[c].high=s[1]),s[1]<_.s.p[c].low&&(_.s.p[c].low=s[1]),t=e.body_b64.indexOf("\n",t)}if(e=null,_.s.p[c].avg=0<_.p[c].length?_.s.p[c].avg/_.p[c].length:0,_.s.p[c].ts=epoch(i),_.p[c].length<23)throw Error("invalid data received")}}catch(t){log("error getting prices: "+t),_.s.errCnt+=1,_.s.errTs=epoch(),_.s.p[c].ts=0,_.p[c]=[]}0==c&&reqLogic(),loopRunning=!1,Timer.set(500,!1,loop)})}catch(t){log("error getting prices: "+t),_.s.errCnt+=1,_.s.errTs=epoch(),_.s.p[c].ts=0,_.p[c]=[],0==c&&reqLogic(),loopRunning=!1,Timer.set(500,!1,loop)}}function logic(i){try{"function"==typeof USER_CONFIG&&USER_CONFIG(i,!1),cmd[i]=!1;var t,e,n=new Date;updateTz(n),!function(){if(_.s.timeOK&&0!=_.s.p[0].ts){var e=epoch();for(let t=0;t<_.p[0].length;t++)if(isCurrentHour(_.p[0][t][0],e))return _.s.p[0].now=_.p[0][t][1];_.s.timeOK=!1,_.s.p[0].ts=0,_.s.errCnt+=1,_.s.errTs=epoch()}else _.s.p[0].ts,_.s.p[0].now=0}();let s=_.si[i],o=_.c.i[i];function r(t){if(null==t)loopRunning=!1;else if(cmd[i]!=t&&(s.st=12),cmd[i]=t,o.i&&(cmd[i]=!cmd[i]),log("logic for #"+(i+1)+" done, cmd: "+t+" -> output: "+cmd[i]),1==o.oc&&s.cmd==cmd[i])log("outputs already set for #"+(i+1)),addHistory(i),s.cmd=cmd[i]?1:0,s.chkTs=epoch(),loopRunning=!1;else{let e=0,n=0;for(let t=0;t<o.o.length;t++)!function(t,o,i){t="{id:"+o+",on:"+(cmd[t]?"true":"false")+"}",Shelly.call("Switch.Set",t,function(t,e,n,s){0!=e&&log("setting output "+o+" failed: "+e+" - "+n),i(0==e)},i)}(i,o.o[t],function(t){e++,t&&n++,e==o.o.length&&(n==e&&(addHistory(i),s.cmd=cmd[i]?1:0,s.chkTs=epoch(),Timer.set(500,!1,loop)),loopRunning=!1)})}}0===o.mode?(cmd[i]=1===o.m0.c,s.st=1):_.s.timeOK&&0<_.s.p[0].ts&&getDate(new Date(1e3*_.s.p[0].ts))===getDate(n)?1===o.mode?(cmd[i]=_.s.p[0].now<=("avg"==o.m1.l?_.s.p[0].avg:o.m1.l),s.st=cmd[i]?2:3):2===o.mode&&(cmd[i]=function(t){var e=_.c.i[t],n=(e.m2.ps=limit(0,e.m2.ps,23),e.m2.pe=limit(e.m2.ps,e.m2.pe,24),e.m2.ps2=limit(0,e.m2.ps2,23),e.m2.pe2=limit(e.m2.ps2,e.m2.pe2,24),e.m2.c=limit(0,e.m2.c,0<e.m2.p?e.m2.p:e.m2.pe-e.m2.ps),e.m2.c2=limit(0,e.m2.c2,e.m2.pe2-e.m2.ps2),[]);for(_inc=e.m2.p<0?1:e.m2.p,_i=0;_i<_.p[0].length;_i+=_inc)if(!((_cnt=-2==e.m2.p&&1<=_i?e.m2.c2:e.m2.c)<=0)){var s=[];for(_start=_i,_end=_i+e.m2.p,e.m2.p<0&&0==_i?(_start=e.m2.ps,_end=e.m2.pe):-2==e.m2.p&&1==_i&&(_start=e.m2.ps2,_end=e.m2.pe2),_j=_start;_j<_end&&!(_j>_.p[0].length-1);_j++)s.push(_j);if(e.m2.s){for(_avg=999,_startIndex=0,_j=0;_j<=s.length-_cnt;_j++){for(_sum=0,_k=_j;_k<_j+_cnt;_k++)_sum+=_.p[0][s[_k]][1];_sum/_cnt<_avg&&(_avg=_sum/_cnt,_startIndex=_j)}for(_j=_startIndex;_j<_startIndex+_cnt;_j++)n.push(s[_j])}else{for(_j=0,_k=1;_k<s.length;_k++){var o=s[_k];for(_j=_k-1;0<=_j&&_.p[0][o][1]<_.p[0][s[_j]][1];_j--)s[_j+1]=s[_j];s[_j+1]=o}for(_j=0;_j<_cnt;_j++)n.push(s[_j])}if(-1==e.m2.p||-2==e.m2.p&&1<=_i)break}let i=epoch(),r=!1;for(let t=0;t<n.length;t++)if(isCurrentHour(_.p[0][n[t]][0],i)){r=!0;break}return r}(i),s.st=cmd[i]?5:4,!cmd[i]&&_.s.p[0].now<=("avg"==o.m2.l?_.s.p[0].avg:o.m2.l)&&(cmd[i]=!0,s.st=6),cmd[i])&&_.s.p[0].now>("avg"==o.m2.m?_.s.p[0].avg:o.m2.m)&&(cmd[i]=!1,s.st=11):_.s.timeOK?(s.st=7,t=1<<n.getHours(),(o.b&t)==t&&(cmd[i]=!0)):(cmd[i]=1===o.e,s.st=8),_.s.timeOK&&0<o.f&&(e=1<<n.getHours(),(o.f&e)==e)&&(cmd[i]=(o.fc&e)==e,s.st=10),cmd[i]&&_.s.timeOK&&n.getMinutes()>=o.m&&(s.st=13,cmd[i]=!1),_.s.timeOK&&0<s.fCmdTs&&(0<s.fCmdTs-epoch(n)?(cmd[i]=1==s.fCmd,s.st=9):s.fCmdTs=0),"function"==typeof USER_OVERRIDE?USER_OVERRIDE(i,cmd[i],r):r(cmd[i])}catch(t){log("error running logic: "+JSON.stringify(t)),loopRunning=!1}}let _avg=999,_startIndex=0,_sum=0;log("v."+_.s.v),log("URL: http://"+(Shelly.getComponentStatus("wifi").sta_ip??"192.168.33.1")+"/script/"+Shelly.getCurrentScriptId()),_.c.i.pop(),_.si.pop();for(let t=0;t<CNST.INST_COUNT;t++)_.si.push(Object.assign({},CNST.DEF_INST_ST)),_.c.i.push(Object.assign({},CNST.DEF_CFG.INST)),_.c.c.names.push("-"),_.h.push([]),cmd.push(!1);CNST.DEF_INST_ST=null,prevEpoch=epoch(),HTTPServer.registerEndpoint("",function(n,s){try{if(loopRunning)return n=null,s.code=503,void s.send();var o=function(t){var e={},n=t.split("&");for(let t=0;t<n.length;t++){var s=n[t].split("=");e[s[0]]=s[1]}return e}(n.query),i=parseInt(o.i);n=null;let t="application/json",e=(s.code=200,!0);var r="text/html",c="text/javascript";if("s"===o.r)updateState(),0<=i&&i<CNST.INST_COUNT&&(s.body=JSON.stringify({s:_.s,si:_.si[i],c:_.c.c,ci:_.c.i[i],p:_.p})),e=!1;else if("c"===o.r)updateState(),0<=i&&i<CNST.INST_COUNT?s.body=JSON.stringify(_.c.i[i]):s.body=JSON.stringify(_.c.c),e=!1;else if("h"===o.r)0<=i&&i<CNST.INST_COUNT&&(s.body=JSON.stringify(_.h[i])),e=!1;else if("r"===o.r){if(0<=i&&i<CNST.INST_COUNT)log("config changed for #"+(i+1)),_.si[i].configOK=!1;else{log("config changed");for(let t=0;t<CNST.INST_COUNT;t++)_.si[t].configOK=!1}_.s.configOK=!1,reqLogic(),loopRunning||(loopRunning=!0,getConfig(i)),_.s.p[0].ts=0,_.s.p[1].ts=0,s.code=204,e=!1}else"f"===o.r&&o.ts?(0<=i&&i<CNST.INST_COUNT&&(_.si[i].fCmdTs=+(""+o.ts),_.si[i].fCmd=+(""+o.c),_.si[i].chkTs=0),s.code=204,e=!1):o.r?"s.js"===o.r?(s.body=atob("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"),t=c):"s.css"===o.r?(s.body=atob("H4sIAAAAAAAACo1WTW/jNhD9K4MNFsh6LVmK16lDoUF7WqBoi17aS9EDRY0s1hRJkONEXsP/vSD1YcVJsL0YJjnD+XjzHrVaLGABvkGljok1znvpebM3ELZvxSf45eC9BOkNcWUggYbIstXq32EnrSUs4qZnq9VOUnMoU2HayWD1zt2/SoHaI4Ovv/8JP9c1OgNfUaPjCv44lEqK0QSe1mkGixUs4ASl6RIvv0m9Y1AaV6FLStMVcIbSVMclcDiBMMo4Bjco6qzOx7PgzMV+58xBVwxu7sQaN1kBSmpMGpS7hhjk6RdsC6iNphAGGWTpw7RT81aqI4O/0FVc8wJa3iXPsqKGwZcHF+yGVZ5lH8Ox20nNIAN+IFOA5VUVM9/YDvLMxrxvSJJCOM2DDmn0/klpiEwbvaKDMPb40j5Lt8GeK7nTiUdVM6gVdgnqqgDCjpJ4xMCFMsMlaa06OEElvVX82JvHfeKlhxNY4yVJE1xQcZJPWLxsX85L8SAmF8ZKrI3D5bjkNaGLYGhCTQw+fCgu4YiXCmfOk7VC7gKy1IynoVJlODFQWPe5k19C2szT10ZP1yWKl6jmp6UyYn+F9F36wyb0bMIkgzy9CzvDWLnBznbgjZIV3OT3PNtuChAH58OAWSM1oZviDqXC6eUUXFrJS2/UgbCAb4nUFXYM8gLI2Es6oUYG2SyvPM7Vi97XdV1MUz7OsbFcSDpG59gjJhoUe6w+v2jK9y/q63/jnnjF56tSp7D5rKq73tXYOQo7J6si/iaErVWcMBFGHVrtGeS1iyQJf6Kzt3rWyPQuduFC0349pRrXA07kuPaWO9Q0gTnWOE7tsE3GjkfPjQzAjODzSh48g00AkGvZ8h7BkFXu4yRxB1LXUke3qUip45QNE3eGn/Z4rB1v0UNfUZgJOPVJ1sa1DJwhTni7vs8q3H2CM5x7eqRCPFJQrkdyj1SxWjpPiWikqpaQlrvlYOZbIDc/HbXheehWaVRVwBM6koKrUQrI2PcpXasuaU3AWUX+YZdU0qEYJME8x9parCS/nYvgNrPdJzi9rVH3AbK5GvWEHlQu0iDZ2m42O98ZltHyEZimpi/+dh3irxbwG99LvQNqENaugt4ZdgbIgMaOIoiLVR+jP2WQwwqS+GT0vW3nCCzhptw/vqcuLzj/pv8VRkPdA+ND3ZepjOyb3rde/rPZta8Rn/vmtoNScbHvGfE/EO3rvzZ8rOTTlOiQwJDCJaIPAhAFdM42xW143Md/r9tzyfmNfOcPZQ+yCJyZjY7ASXprOZfcj0VP5ZgXhpfh2XEbDZ/zbTaz3I6Xt5RnFzz6Dg6Pc+hGPvQrSlwwd5t5U+Jjng1q2arNNbJjlHIJNz4R7Tv0PIPU9kB/09Hij+WByOh/rj8K8kCg84X2pzc+VIbqRnpcJCLEnfq6Dkm93U9/aFvuAnlfv3P/AXPmnH4uCgAA"),t="text/css"):"status"===o.r?(s.body=atob("H4sIAAAAAAAACpWSS26DMBRFt2IxaiMBYVCpA8cLqCp10GzgYTvC4A/FjyTshzV0A2ys4mclbfqbeOB773n3WaYIuZaEa/B+FxnCecQoNoyiYM+gUJISiCtKaD1FQZTY+VjY1bLkTtnjlr1MJmI7DEZuRogABLBJkqzcyVl5aYmXWqEMfo9h9uvQF9XwbkmhLMIV1boTu0J57Lq6VsFgnJDBsVcagqLswTGaTjszKtRxXfygz+Sgz7Fxecydjq5E5KOWEdM8fBEMZtuI0XwtTHDo7dAPvaVpzmgq1JHR+Y2nBrXa3ixwido7lC22Bn6AzTHkC/UCOrtu1dd/qF+0zkhr4bv22T/a/8LKPneeT9/WbLOpoapcvHy8dLyb5k3JY9g+ZHijamSNfHvydxFCHnsEbH1S+uiepov8ARap9CvsAgAA"),t=r):"status.js"===o.r?(s.body=atob("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"),t=c):"history"===o.r?(s.body=atob("H4sIAAAAAAAACmWNOw7CMBBEr2K5gsJY9JuVaGkoOIF/IRuMDN5NlNweEQWElGaK90YzEGlUITvmRrd5Um2ezKN4E0rWCH9SwscdNYI4nxOCVASJP638TeOJ7m4DL13vBt7ga8okCeyy40ucFcWGTUcsCHY9sZHGb3Ko9BSs6XXmnRbnl26p86FnvQe7+jdGEOBV0gAAAA=="),t=r):"history.js"===o.r?(s.body=atob("H4sIAAAAAAAAClWS0WrbMBSGX0U9ZEOaHbdd2E0cOWxrYRctg8a7MmY9cY5jbaqVSSctwfXb9E36YsMOGynoRgfp+38+qbPEwuiiTCvXBhZrzTrr/gQJYdqYwKAS07bkv+W3NxoW7LMFb0TlbNhhq2fZtRHDMecN4uKcN9ninH0GffqIXlQaw6GtxIAc9l6fglP2h87Ukp+f2721WgdGJuWJ974Va6lSU0tgXE+PCQfQGis2j5TjWo1AilHjExoWW+IrZJQ/7m5WESy9bt4bDZFpA48cTNxvNaSdSaMx2SCjSiy1W25OEnuygYSp5aeL2ZnWmFRu86aRP7UBae28JOFqYZLgPEvJsVc688VFOeXiolTHmuFoDuKg5bAifT9atBiChtowZJOudv4BOTcPJFt6ElfIJC9p9oFGTj/KvVfReDPwwZKGylnn55OOistyCVtP1MIcPG2gH4jH8ffmF+6D2L2+vL5YSzD/P3EmwBtuNulW+ef8+ucqvyuo+FiWy8TTzmJFEoR8FwQGNgpigH+FIjg++KmZSIe+7yvkqpGsuuFjOUsJee+8ZBWfSuS+Tyup4q9fVsluHxpZqf4v8DUOEZQCAAA="),t=c):"config"===o.r?(s.body=atob("H4sIAAAAAAAACpVWS27jRhC9SoNBMPaC+tDOjGFQDXDhgWXLUhDJDrIskW2zzO4mh12Uo6xzFJ7BF+DFAv4kkbbszEYCu36vX9Ur0g1wwzCY+I9PtmS+BGMm5PMZBEAAejAYuMMAN9zd+zFDWykmAZpEwvZSx1rU5jraIp+trdrnMdZkG/xHXI4HjlD8r9nVdHm1Yt7yanV/u7xaNckJ1lK08Yr5vsVdSrlLAb8DKP9cI6TwqYTwxN04IYw124DMxOQR+TKLFXZPheAPmMbdQ7nhM6ANQu+Y+AwFUQbusK7Tlm8wvYwvRnxZ5GFUvGrmzR4qSKiTrEK0AWLlLSdnnP3aAl8iphQriExG5fPom+04l2wfFcB2F+UPoz/DAxIVjUfccezRt8MIjU8h9WJqAocVg/02lFmO9mJxfePdL9kvrklAV61F7g7LB/5pVw5puS3yLRWvxhR5xYqEtZAtObRNxMQPhR+t47/LIkJztpgPF9+/u8PGs+Frjgq7tOqdbRE+Q2YIkv4sqDgQvN+0yp0IyrbIIg+D4pW6meOMTM3j+S5oVntqFlfFeoVivzd1I+6hBkaQRmgIhDG9oRrzB0DNVJYRZZX5PZiZUaizjLCHUKHeNVqhbkNui7zINQnUogP0CNuoN7tqD5CqLDOUaV0VK+3raGe+LnIqckIJB2k/6WWaHmvm7xBFsV1lioyo7xYIApSmnXD5G3dNphSkWz6vZigfJogyppKpxtDMIAaTx7CdRKOqwbb2Uz9sUr+rg0YE/Lb4dzmth/6n5nvxf+lQI9tXwRtGPoB0PZ2vvD+8G++nAF2jJkjhGXoTM7Ylqv52OF78xrtdLubs2ps9TO/uvBVb3c/n08838iEU7xn0M0Qm7svSsROR9hTjnHPnPOyJxOFjp3d2wS96J1/5197JOe9nOuNnvROH9zPbYx4rKB9KCtnJmFXgT3teTtfLqb3gdCdgVu/MmoiQA0awKXKJ7CSS8ellu0UpbWfdsf1a8QoYdDjbt8+xE9N273I0YjbrGsWBsZXZKtOEqtwJabN9D0N8vX9ZhF00zls4zHkHkPMhIqcL6U3+Drx38vuanA7CeneItMijqMix3RzHBOfY5sdu5VTrOCmLSVnkzO4ppC7ThElUrUJ2nxmRQYVh2fJjUeoDVTVvW+vgggY2oga9zoh247UCKYXWwA8+rN68svlqMb2bzueL1Rsv8tsa+0+FTplyWcapL5p6B6vYcHedfhIda1+iH02+vKAO4pdBnAh9Yg2t0y91OmsZCim3moUgK4FY7UXqX+OnmBBPxY8bc2IRrG0/1o/4NHg2Vqmg2vwfbuoFencKAAA="),t=r):"config.js"===o.r?(s.body=atob("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"),t=c):s.code=404:(s.body=atob("H4sIAAAAAAAACqVTwW7bMAz9FU0DhgSL7fU2NJKKYS2w9bIdhl4LRWJiNorkiXSCYNjf7Bv6A/2xwXbS1e0KdNiFNvkeH58oW73yyfG+gZo3waguimDjSkM0agNshattJmDd8rJ4bxQjBzBf724zEdLdr3p9d6uqoTo0RLsBvUXYNSmzcCkyRNZyh55r7WGLDoo+mWFERhsKcjaAPpFGedwKFyyR5tQMKXr915kHjBqMhxZqolGVx+0x9oEggOOOipHYqNQwpii2NrSg35kv9Y1tSbw+UdXAfNDcNbnU7M2bLs7FZUuE4jMltiGJibKizrDUNXNDp1V1gwNSLlGwzStgfb0INq7NA0RV1kwfuzye2S7oUW4UxqZl0V2RztZjGvZr+73YRUFsuSXhanBr8PrwPAqQESrYBQSxTHnEPw4oeth8w2BVNbyPHRSHG+yXUfyReLLqfzBdI3HK++ddPiLc2/zU1/HFVg86/+PVpbjE1fNWx/i90w8E3K4J+KVWB52x0yGSy9iwcSkSi/OLK73D6NOuDMnZ7lsuU8YVxhKjC60HmsgOCXUiltN5ABZe++TaDUSeuQyW4SJAl2nQxpej0gSmM9s0EP3HGoMfGIvk9+WDakfK8P2SOvjH1mZBeqwiB9NyOqeSstPnF1dncCrPspZvoczQBOtgIruDy5mUo5kTmv6cOXoiGTCu5XTuiMoMQUvifQCqAVh29LL/GbtBkkpHJPtxw+tI3hEd7E8klTckp6o67Pg3taztjQ8FAAA="),t=r);s.headers=[["Content-Type",t]],e&&s.headers.push(["Content-Encoding","gzip"])}catch(t){log("server error: "+t),s.code=500}s.send()}),Timer.set(1e4,!0,loop),loop();
//end

/**
 * Tämä käyttäjäskripti hyödyntää Shelly H&T:n (Gen 1, Plus, Gen 3) lähettämää lämpötilaa pörssisähköohjausten asetuksissa
 * Mitä kylmempi lämpötila, sitä useampi halvempi tunti ohjataan ja samalla myös ohjausminuuttien määrää kasvatetaan.
 * 
 * Tämä muuttaa ainoastaan #1 ohjauksen asetuksia, muihin ei kosketa.
 * 
 * Käyttöönotto:
 * -----
 * Shelly H&T gen 1
 * -----
 * Lisää Shelly H&T-asetuksiin "actions >- sensor reports" -osoitteisiin osoite
 *    http://ip-osoite/script/1/update-temp
 * missä ip-osoite on tämän shellyn osoite. 
 * Muista myös ottaa "sensor reports" -ominaisuus käyttöön
 * 
 * -----
 * Shelly H&T Plus ja H&T gen 3
 * -----
 * Lisää uusi Action->Temperature
 * Laita Then Do -kohdalla alle uusi osoite
 *    http://ip-osoite/script/1/update-temp?temp=$temperature
 * missä ip-osoite on tämän Shellyn osoite. 
 */

//Mitä ohjausta hienosäädetään (0 = ohjaus #1, 1 = ohjaus #2 jne.)
let INSTANCE = 0;

//Kuinka vanha lämpötilatieto sallitaan ohjauksessa (tunteina)
let TEMPERATURE_MAX_AGE_HOURS = 12;

//Viimeisin tiedossa oleva lämpötiladata
let data = null;

//Alkuperäiset muokkaamattomat asetukset
let originalConfig = {
  hours: 0,
  minutes: 60
};

function USER_CONFIG(inst, initialized) {
  //Jos kyseessä on jonkun muun asetukset niin ei tehdä mitään
  if (inst != INSTANCE) {
    return;
  }

  //Vähän apumuuttujia
  const state = _;
  const config = state.c.i[inst];

  //Jos asetuksia ei vielä ole, skipataan (uusi asennus)
  if (typeof config.m2 == "undefined") {
    console.log("Tallenna asetukset kerran käyttäjäskriptiä varten");
    return;
  }

  //Tallenentaan alkuperäiset asetukset muistiin
  if (initialized) {
    originalConfig.hours = config.m2.c;
    originalConfig.minutes = config.m;

    console.log("Alkuperäiset asetukset:", originalConfig);
  }

  //Käytetää lähtökohtaisesti alkuperäisiin asetuksiin tallennettua tuntimäärää ja ohjausminuutteja
  //Näin ollen jos tallentaa asetukset käyttöliittymältä, tulee ne myös tähän käyttöön
  let hours = originalConfig.hours;
  let minutes = originalConfig.minutes;

  try {

    if (data == null) {
      console.log("Lämpötilatietoa ei ole saatavilla");
      state.si[inst].str = "Lämpötila ei tiedossa -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";

    } else {
      let age = (Date.now() - data.ts) / 1000.0 / 60.0 / 60.0;
      console.log("Lämpötila on tiedossa (päivittynyt " + age.toFixed(2) + " h sitten):", data);

      if (age <= TEMPERATURE_MAX_AGE_HOURS * 60) {
        //------------------------------
        // Toimintalogiikka
        // muokkaa haluamaksesi
        //------------------------------

        //Muutetaan lämpötilan perusteella lämmitystuntien määrää ja minuutteja
        if (data.temp <= -15) {
          hours = 8;
          minutes = 60;

        } else if (data.temp <= -10) {
          hours = 7;
          minutes = 45;

        } else if (data.temp <= -5) {
          hours = 6;
          minutes = 45;

        } else {
          //Ei tehdä mitään --> käytetään käyttöliittymän asetuksia
        }

        //------------------------------
        // Toimintalogiikka päättyy
        //------------------------------
        state.si[inst].str = "Lämpötila " + data.temp.toFixed(1) + "°C (" + age.toFixed(1) + "h sitten) -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";
        console.log("Lämpötila:", data.temp.toFixed(1), "°C -> asetettu halvimpien tuntien määräksi ", hours, "h ja ohjausminuuteiksi", minutes, "min");

      } else {
        console.log("Lämpötilatieto on liian vanha -> ei käytetä");
        state.si[inst].str = "Lämpötilatieto liian vanha (" + age.toFixed(1) + " h) -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";
      }
    }
  } catch (err) {
    state.si[inst].str = "Virhe lämpötilaohjauksessa:" + err;
    console.log("Virhe tapahtui USER_CONFIG-funktiossa:", err);
  }

  //Asetetaan arvot asetuksiin
  config.m2.c = hours;
  config.m = minutes;
}

/**
 * Apufunktio, joka kerää parametrit osoitteesta
 */
function parseParams(params) {
  let res = {};
  let splitted = params.split("&");

  for (let i = 0; i < splitted.length; i++) {
    let pair = splitted[i].split("=");

    res[pair[0]] = pair[1];
  }

  return res;
}

/**
 * Takaisinkutsu, joka suoritetaan kun saadaan HTTP-pyyntö
 */
function onHttpRequest(request, response) {
  try {
    let params = parseParams(request.query);
    request = null;

    if (params.temp != undefined) {
      data = {
        temp: Number(params.temp),
        ts: Math.floor(Date.now())
      };

      console.log("Lämpötilatiedot päivitetty, pyydetään pörssisähkölogiikan ajoa. Data:", data);

      _.si[INSTANCE].chkTs = 0; //Requesting to run logic again

      response.code = 200;

    } else {
      console.log("Lämpötilatiedojen päivitys epäonnistui, 'temp' puuttuu parametreista:", params);
      response.code = 400;
    }

    response.send();

  } catch (err) {
    console.log("Virhe:", err);
  }
}

//Rekisteröidään /script/x/update-temp -osoite
HTTPServer.registerEndpoint('update-temp', onHttpRequest);