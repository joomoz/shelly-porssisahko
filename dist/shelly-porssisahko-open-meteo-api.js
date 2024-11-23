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
const CNST={INST_COUNT:"undefined"==typeof INSTANCE_COUNT?3:INSTANCE_COUNT,HIST_LEN:"undefined"==typeof HIST_LEN?24:HIST_LEN,ERR_LIMIT:3,ERR_DELAY:120,DEF_INST_ST:{chkTs:0,st:0,str:"",cmd:-1,configOK:0,fCmdTs:0,fCmd:0},DEF_CFG:{COM:{g:"fi",vat:25.5,day:0,night:0,names:[]},INST:{en:0,mode:0,m0:{c:0},m1:{l:0},m2:{p:24,c:0,l:-999,s:0,m:999,ps:0,pe:23,ps2:0,pe2:23,c2:0},b:0,e:0,o:[0],f:0,fc:0,i:0,m:60,oc:0}}};let _={s:{v:"3.1.0",dn:"",configOK:0,timeOK:0,errCnt:0,errTs:0,upTs:0,tz:"+02:00",tzh:0,enCnt:0,p:[{ts:0,now:0,low:0,high:0,avg:0},{ts:0,now:0,low:0,high:0,avg:0}]},si:[CNST.DEF_INST_ST],p:[[],[]],h:[],c:{c:CNST.DEF_CFG.COM,i:[CNST.DEF_CFG.INST]}},_i=0,_j=0,_k=0,_inc=0,_cnt=0,_start=0,_end=0,cmd=[],prevEpoch=0,loopRunning=!1;function getKvsKey(e){let t="porssi";return t=0<=e?t+"-"+(e+1):t}function isCurrentHour(e,t){t-=e;return 0<=t&&t<3600}function limit(e,t,n){return Math.min(n,Math.max(e,t))}function epoch(e){return Math.floor((e?e.getTime():Date.now())/1e3)}function getDate(e){return e.getDate()}function updateTz(e){let t=e.toString(),n=0;"+0000"==(t=t.substring(3+t.indexOf("GMT")))?(t="Z",n=0):(n=+t.substring(0,3),t=t.substring(0,3)+":"+t.substring(3)),t!=_.s.tz&&(_.s.p[0].ts=0),_.s.tz=t,_.s.tzh=n}function log(e){console.log("shelly-porssisahko: "+e)}function addHistory(e){for(var t=0<_.s.enCnt?CNST.HIST_LEN/_.s.enCnt:CNST.HIST_LEN;0<CNST.HIST_LEN&&_.h[e].length>=t;)_.h[e].splice(0,1);_.h[e].push([epoch(),cmd[e]?1:0,_.si[e].st])}function reqLogic(){for(let e=0;e<CNST.INST_COUNT;e++)_.si[e].chkTs=0}function updateState(){var e=new Date,t=(_.s.timeOK=null!=Shelly.getComponentStatus("sys").unixtime&&2e3<e.getFullYear(),_.s.dn=Shelly.getComponentConfig("sys").device.name,epoch(e));for(_.s.timeOK&&300<Math.abs(t-prevEpoch)&&(log("Time changed 5 min+ -> refresh"),_.s.p[0].ts=0,_.s.p[0].now=0,_.s.p[1].ts=0,_.p[0]=[],_.p[1]=[]),prevEpoch=t,_.s.enCnt=0,_i=0;_i<CNST.INST_COUNT;_i++)_.c.i[_i].en&&_.s.enCnt++;!_.s.upTs&&_.s.timeOK&&(_.s.upTs=epoch(e))}function getConfig(l){var e=getKvsKey(l);Shelly.call("KVS.Get",{key:e},function(t,e,n){l<0?_.c.c=t?JSON.parse(t.value):{}:_.c.i[l]=t?JSON.parse(t.value):{},"function"==typeof USER_CONFIG&&USER_CONFIG(l,!0);{t=l;var s=function(e){l<0?_.s.configOK=e?1:0:(log("config for #"+(l+1)+" read, enabled: "+_.c.i[l].en),_.si[l].configOK=e?1:0,_.si[l].chkTs=0),loopRunning=!1,Timer.set(500,!1,loop)};let e=0;if(CNST.DEF_CFG.COM||CNST.DEF_CFG.INST){var o,i=t<0?CNST.DEF_CFG.COM:CNST.DEF_CFG.INST,r=t<0?_.c.c:_.c.i[t];for(o in i)if(void 0===r[o])r[o]=i[o],e++;else if("object"==typeof i[o])for(var c in i[o])void 0===r[o][c]&&(r[o][c]=i[o][c],e++);t>=CNST.INST_COUNT-1&&(CNST.DEF_CFG.COM=null,CNST.DEF_CFG.INST=null),0<e?(t=getKvsKey(t),Shelly.call("KVS.Set",{key:t,value:JSON.stringify(r)},function(e,t,n,s){t&&log("failed to set config: "+t+" - "+n),s(0==t)},s)):s(!0)}else s(!0)}})}function loop(){try{if(!loopRunning)if(loopRunning=!0,updateState(),_.s.configOK)if(pricesNeeded(0))getPrices(0);else if(pricesNeeded(1))getPrices(1);else{for(let e=0;e<CNST.INST_COUNT;e++)if(!_.si[e].configOK)return void getConfig(e);for(let e=0;e<CNST.INST_COUNT;e++)if(function(e){var t=_.si[e],n=_.c.i[e];if(1!=n.en)return void(_.h[e]=[]);var e=new Date,s=new Date(1e3*t.chkTs);return 0==t.chkTs||s.getHours()!=e.getHours()||s.getFullYear()!=e.getFullYear()||0<t.fCmdTs&&t.fCmdTs-epoch(e)<0||0==t.fCmdTs&&n.m<60&&e.getMinutes()>=n.m&&t.cmd+n.i==1}(e))return void Timer.set(500,!1,logic,e);"function"==typeof USER_LOOP?USER_LOOP():loopRunning=!1}else getConfig(-1)}catch(e){log("error at main loop:"+e),loopRunning=!1}}function pricesNeeded(e){var t=new Date;let n=!1;return n=1==e?_.s.timeOK&&0===_.s.p[1].ts&&15<=t.getHours():((e=getDate(new Date(1e3*_.s.p[0].ts))!==getDate(t))&&(_.s.p[1].ts=0,_.p[1]=[]),_.s.timeOK&&(0==_.s.p[0].ts||e)),_.s.errCnt>=CNST.ERR_LIMIT&&epoch(t)-_.s.errTs<CNST.ERR_DELAY?n=!1:_.s.errCnt>=CNST.ERR_LIMIT&&(_.s.errCnt=0),n}function getPrices(c){try{log("fetching prices for day "+c);let i=new Date;updateTz(i);var t=1==c?new Date(864e5+new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime()):i;let e=t.getFullYear()+"-"+(t.getMonth()<9?"0"+(1+t.getMonth()):1+t.getMonth())+"-"+(getDate(t)<10?"0"+getDate(t):getDate(t))+"T00:00:00"+_.s.tz.replace("+","%2b");var n=e.replace("T00:00:00","T23:59:59");let r={url:"https://dashboard.elering.ee/api/nps/price/csv?fields="+_.c.c.g+"&start="+e+"&end="+n,timeout:5,ssl_ca:"*"};i=null,e=null,Shelly.call("HTTP.GET",r,function(t,e,n){r=null;try{if(0!==e||null==t||200!==t.code||!t.body_b64)throw Error(e+"("+n+") - "+JSON.stringify(t));{t.headers=null,n=t.message=null,_.p[c]=[],_.s.p[c].avg=0,_.s.p[c].high=-999,_.s.p[c].low=999,t.body_b64=atob(t.body_b64),t.body_b64=t.body_b64.substring(1+t.body_b64.indexOf("\n"));let e=0;for(;0<=e;){t.body_b64=t.body_b64.substring(e);var s=[e=0,0];if(0===(e=1+t.body_b64.indexOf('"',e)))break;s[0]=+t.body_b64.substring(e,t.body_b64.indexOf('"',e)),e=2+t.body_b64.indexOf('"',e),e=2+t.body_b64.indexOf(';"',e),s[1]=+(""+t.body_b64.substring(e,t.body_b64.indexOf('"',e)).replace(",",".")),s[1]=s[1]/10*(100+(0<s[1]?_.c.c.vat:0))/100;var o=new Date(1e3*s[0]).getHours();s[1]+=7<=o&&o<22?_.c.c.day:_.c.c.night,_.p[c].push(s),_.s.p[c].avg+=s[1],s[1]>_.s.p[c].high&&(_.s.p[c].high=s[1]),s[1]<_.s.p[c].low&&(_.s.p[c].low=s[1]),e=t.body_b64.indexOf("\n",e)}if(t=null,_.s.p[c].avg=0<_.p[c].length?_.s.p[c].avg/_.p[c].length:0,_.s.p[c].ts=epoch(i),_.p[c].length<23)throw Error("invalid data received")}}catch(e){log("error getting prices: "+e),_.s.errCnt+=1,_.s.errTs=epoch(),_.s.p[c].ts=0,_.p[c]=[]}0==c&&reqLogic(),loopRunning=!1,Timer.set(500,!1,loop)})}catch(e){log("error getting prices: "+e),_.s.errCnt+=1,_.s.errTs=epoch(),_.s.p[c].ts=0,_.p[c]=[],0==c&&reqLogic(),loopRunning=!1,Timer.set(500,!1,loop)}}function logic(i){try{"function"==typeof USER_CONFIG&&USER_CONFIG(i,!1),cmd[i]=!1;var e,t,n=new Date;updateTz(n),!function(){if(_.s.timeOK&&0!=_.s.p[0].ts){var t=epoch();for(let e=0;e<_.p[0].length;e++)if(isCurrentHour(_.p[0][e][0],t))return _.s.p[0].now=_.p[0][e][1];_.s.timeOK=!1,_.s.p[0].ts=0,_.s.errCnt+=1,_.s.errTs=epoch()}else _.s.p[0].ts,_.s.p[0].now=0}();let s=_.si[i],o=_.c.i[i];function r(e){if(null==e)loopRunning=!1;else if(cmd[i]!=e&&(s.st=12),cmd[i]=e,o.i&&(cmd[i]=!cmd[i]),log("logic for #"+(i+1)+" done, cmd: "+e+" -> output: "+cmd[i]),1==o.oc&&s.cmd==cmd[i])log("outputs already set for #"+(i+1)),addHistory(i),s.cmd=cmd[i]?1:0,s.chkTs=epoch(),loopRunning=!1;else{let t=0,n=0;for(let e=0;e<o.o.length;e++)!function(e,o,i){e="{id:"+o+",on:"+(cmd[e]?"true":"false")+"}",Shelly.call("Switch.Set",e,function(e,t,n,s){0!=t&&log("setting output "+o+" failed: "+t+" - "+n),i(0==t)},i)}(i,o.o[e],function(e){t++,e&&n++,t==o.o.length&&(n==t&&(addHistory(i),s.cmd=cmd[i]?1:0,s.chkTs=epoch(),Timer.set(500,!1,loop)),loopRunning=!1)})}}0===o.mode?(cmd[i]=1===o.m0.c,s.st=1):_.s.timeOK&&0<_.s.p[0].ts&&getDate(new Date(1e3*_.s.p[0].ts))===getDate(n)?1===o.mode?(cmd[i]=_.s.p[0].now<=("avg"==o.m1.l?_.s.p[0].avg:o.m1.l),s.st=cmd[i]?2:3):2===o.mode&&(cmd[i]=function(e){var t=_.c.i[e],n=(t.m2.ps=limit(0,t.m2.ps,23),t.m2.pe=limit(t.m2.ps,t.m2.pe,24),t.m2.ps2=limit(0,t.m2.ps2,23),t.m2.pe2=limit(t.m2.ps2,t.m2.pe2,24),t.m2.c=limit(0,t.m2.c,0<t.m2.p?t.m2.p:t.m2.pe-t.m2.ps),t.m2.c2=limit(0,t.m2.c2,t.m2.pe2-t.m2.ps2),[]);for(_inc=t.m2.p<0?1:t.m2.p,_i=0;_i<_.p[0].length;_i+=_inc)if(!((_cnt=-2==t.m2.p&&1<=_i?t.m2.c2:t.m2.c)<=0)){var s=[];for(_start=_i,_end=_i+t.m2.p,t.m2.p<0&&0==_i?(_start=t.m2.ps,_end=t.m2.pe):-2==t.m2.p&&1==_i&&(_start=t.m2.ps2,_end=t.m2.pe2),_j=_start;_j<_end&&!(_j>_.p[0].length-1);_j++)s.push(_j);if(t.m2.s){for(_avg=999,_startIndex=0,_j=0;_j<=s.length-_cnt;_j++){for(_sum=0,_k=_j;_k<_j+_cnt;_k++)_sum+=_.p[0][s[_k]][1];_sum/_cnt<_avg&&(_avg=_sum/_cnt,_startIndex=_j)}for(_j=_startIndex;_j<_startIndex+_cnt;_j++)n.push(s[_j])}else{for(_j=0,_k=1;_k<s.length;_k++){var o=s[_k];for(_j=_k-1;0<=_j&&_.p[0][o][1]<_.p[0][s[_j]][1];_j--)s[_j+1]=s[_j];s[_j+1]=o}for(_j=0;_j<_cnt;_j++)n.push(s[_j])}if(-1==t.m2.p||-2==t.m2.p&&1<=_i)break}let i=epoch(),r=!1;for(let e=0;e<n.length;e++)if(isCurrentHour(_.p[0][n[e]][0],i)){r=!0;break}return r}(i),s.st=cmd[i]?5:4,!cmd[i]&&_.s.p[0].now<=("avg"==o.m2.l?_.s.p[0].avg:o.m2.l)&&(cmd[i]=!0,s.st=6),cmd[i])&&_.s.p[0].now>("avg"==o.m2.m?_.s.p[0].avg:o.m2.m)&&(cmd[i]=!1,s.st=11):_.s.timeOK?(s.st=7,e=1<<n.getHours(),(o.b&e)==e&&(cmd[i]=!0)):(cmd[i]=1===o.e,s.st=8),_.s.timeOK&&0<o.f&&(t=1<<n.getHours(),(o.f&t)==t)&&(cmd[i]=(o.fc&t)==t,s.st=10),cmd[i]&&_.s.timeOK&&n.getMinutes()>=o.m&&(s.st=13,cmd[i]=!1),_.s.timeOK&&0<s.fCmdTs&&(0<s.fCmdTs-epoch(n)?(cmd[i]=1==s.fCmd,s.st=9):s.fCmdTs=0),"function"==typeof USER_OVERRIDE?USER_OVERRIDE(i,cmd[i],r):r(cmd[i])}catch(e){log("error running logic: "+JSON.stringify(e)),loopRunning=!1}}let _avg=999,_startIndex=0,_sum=0;log("v."+_.s.v),log("URL: http://"+(Shelly.getComponentStatus("wifi").sta_ip??"192.168.33.1")+"/script/"+Shelly.getCurrentScriptId()),_.c.i.pop(),_.si.pop();for(let e=0;e<CNST.INST_COUNT;e++)_.si.push(Object.assign({},CNST.DEF_INST_ST)),_.c.i.push(Object.assign({},CNST.DEF_CFG.INST)),_.c.c.names.push("-"),_.h.push([]),cmd.push(!1);CNST.DEF_INST_ST=null,prevEpoch=epoch(),HTTPServer.registerEndpoint("",function(n,s){try{if(loopRunning)return n=null,s.code=503,void s.send();var o=function(e){var t={},n=e.split("&");for(let e=0;e<n.length;e++){var s=n[e].split("=");t[s[0]]=s[1]}return t}(n.query),i=parseInt(o.i);n=null;let e="application/json",t=(s.code=200,!0);var r="text/html",c="text/javascript";if("s"===o.r)updateState(),0<=i&&i<CNST.INST_COUNT&&(s.body=JSON.stringify({s:_.s,si:_.si[i],c:_.c.c,ci:_.c.i[i],p:_.p})),t=!1;else if("c"===o.r)updateState(),0<=i&&i<CNST.INST_COUNT?s.body=JSON.stringify(_.c.i[i]):s.body=JSON.stringify(_.c.c),t=!1;else if("h"===o.r)0<=i&&i<CNST.INST_COUNT&&(s.body=JSON.stringify(_.h[i])),t=!1;else if("r"===o.r){if(0<=i&&i<CNST.INST_COUNT)log("config changed for #"+(i+1)),_.si[i].configOK=!1;else{log("config changed");for(let e=0;e<CNST.INST_COUNT;e++)_.si[e].configOK=!1}_.s.configOK=!1,reqLogic(),loopRunning||(loopRunning=!0,getConfig(i)),_.s.p[0].ts=0,_.s.p[1].ts=0,s.code=204,t=!1}else"f"===o.r&&o.ts?(0<=i&&i<CNST.INST_COUNT&&(_.si[i].fCmdTs=+(""+o.ts),_.si[i].fCmd=+(""+o.c),_.si[i].chkTs=0),s.code=204,t=!1):o.r?"s.js"===o.r?(s.body=atob("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"),e=c):"s.css"===o.r?(s.body=atob("H4sIAAAAAAAAA41WTW/jNhD9K4MNFsh6LVmK16lDoUF7WqBoi17aS9EDRY0s1hRJkONEXsP/vSD1YcVJsL0YJjnD+XjzHrVaLGABvkGljok1znvpebM3ELZvxSf45eC9BOkNcWUggYbIstXq32EnrSUs4qZnq9VOUnMoU2HayWD1zt2/SoHaI4Ovv/8JP9c1OgNfUaPjCv44lEqK0QSe1mkGixUs4ASl6RIvv0m9Y1AaV6FLStMVcIbSVMclcDiBMMo4Bjco6qzOx7PgzMV+58xBVwxu7sQaN1kBSmpMGpS7hhjk6RdsC6iNphAGGWTpw7RT81aqI4O/0FVc8wJa3iXPsqKGwZcHF+yGVZ5lH8Ox20nNIAN+IFOA5VUVM9/YDvLMxrxvSJJCOM2DDmn0/klpiEwbvaKDMPb40j5Lt8GeK7nTiUdVM6gVdgnqqgDCjpJ4xMCFMsMlaa06OEElvVX82JvHfeKlhxNY4yVJE1xQcZJPWLxsX85L8SAmF8ZKrI3D5bjkNaGLYGhCTQw+fCgu4YiXCmfOk7VC7gKy1IynoVJlODFQWPe5k19C2szT10ZP1yWKl6jmp6UyYn+F9F36wyb0bMIkgzy9CzvDWLnBznbgjZIV3OT3PNtuChAH58OAWSM1oZviDqXC6eUUXFrJS2/UgbCAb4nUFXYM8gLI2Es6oUYG2SyvPM7Vi97XdV1MUz7OsbFcSDpG59gjJhoUe6w+v2jK9y/q63/jnnjF56tSp7D5rKq73tXYOQo7J6si/iaErVWcMBFGHVrtGeS1iyQJf6Kzt3rWyPQuduFC0349pRrXA07kuPaWO9Q0gTnWOE7tsE3GjkfPjQzAjODzSh48g00AkGvZ8h7BkFXu4yRxB1LXUke3qUip45QNE3eGn/Z4rB1v0UNfUZgJOPVJ1sa1DJwhTni7vs8q3H2CM5x7eqRCPFJQrkdyj1SxWjpPiWikqpaQlrvlYOZbIDc/HbXheehWaVRVwBM6koKrUQrI2PcpXasuaU3AWUX+YZdU0qEYJME8x9parCS/nYvgNrPdJzi9rVH3AbK5GvWEHlQu0iDZ2m42O98ZltHyEZimpi/+dh3irxbwG99LvQNqENaugt4ZdgbIgMaOIoiLVR+jP2WQwwqS+GT0vW3nCCzhptw/vqcuLzj/pv8VRkPdA+ND3ZepjOyb3rde/rPZta8Rn/vmtoNScbHvGfE/EO3rvzZ8rOTTlOiQwJDCJaIPAhAFdM42xW143Md/r9tzyfmNfOcPZQ+yCJyZjY7ASXprOZfcj0VP5ZgXhpfh2XEbDZ/zbTaz3I6Xt5RnFzz6Dg6Pc+hGPvQrSlwwd5t5U+Jjng1q2arNNbJjlHIJNz4R7Tv0PIPU9kB/09Hij+WByOh/rj8K8kCg84X2pzc+VIbqRnpcJCLEnfq6Dkm93U9/aFvuAnlfv3P/AXPmnH4uCgAA"),e="text/css"):"status"===o.r?(s.body=atob("H4sIAAAAAAAAA5WSS26DMBRFt2IxaiMBYVCpA8cLqCp10GzgYTvC4A/FjyTshzV0A2ys4mclbfqbeOB773n3WaYIuZaEa/B+FxnCecQoNoyiYM+gUJISiCtKaD1FQZTY+VjY1bLkTtnjlr1MJmI7DEZuRogABLBJkqzcyVl5aYmXWqEMfo9h9uvQF9XwbkmhLMIV1boTu0J57Lq6VsFgnJDBsVcagqLswTGaTjszKtRxXfygz+Sgz7Fxecydjq5E5KOWEdM8fBEMZtuI0XwtTHDo7dAPvaVpzmgq1JHR+Y2nBrXa3ixwido7lC22Bn6AzTHkC/UCOrtu1dd/qF+0zkhr4bv22T/a/8LKPneeT9/WbLOpoapcvHy8dLyb5k3JY9g+ZHijamSNfHvydxFCHnsEbH1S+uiepov8ARap9CvsAgAA"),e=r):"status.js"===o.r?(s.body=atob("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"),e=c):"history"===o.r?(s.body=atob("H4sIAAAAAAAAA2WNOw7CMBBEr2K5gsJY9JuVaGkoOIF/IRuMDN5NlNweEQWElGaK90YzEGlUITvmRrd5Um2ezKN4E0rWCH9SwscdNYI4nxOCVASJP638TeOJ7m4DL13vBt7ga8okCeyy40ucFcWGTUcsCHY9sZHGb3Ko9BSs6XXmnRbnl26p86FnvQe7+jdGEOBV0gAAAA=="),e=r):"history.js"===o.r?(s.body=atob("H4sIAAAAAAAAA1WS0WrbMBSGX0U9ZEOaHbdd2E0cOWxrYRctg8a7MmY9cY5jbaqVSSctwfXb9E36YsMOGynoRgfp+38+qbPEwuiiTCvXBhZrzTrr/gQJYdqYwKAS07bkv+W3NxoW7LMFb0TlbNhhq2fZtRHDMecN4uKcN9ninH0GffqIXlQaw6GtxIAc9l6fglP2h87Ukp+f2721WgdGJuWJ974Va6lSU0tgXE+PCQfQGis2j5TjWo1AilHjExoWW+IrZJQ/7m5WESy9bt4bDZFpA48cTNxvNaSdSaMx2SCjSiy1W25OEnuygYSp5aeL2ZnWmFRu86aRP7UBae28JOFqYZLgPEvJsVc688VFOeXiolTHmuFoDuKg5bAifT9atBiChtowZJOudv4BOTcPJFt6ElfIJC9p9oFGTj/KvVfReDPwwZKGylnn55OOistyCVtP1MIcPG2gH4jH8ffmF+6D2L2+vL5YSzD/P3EmwBtuNulW+ef8+ucqvyuo+FiWy8TTzmJFEoR8FwQGNgpigH+FIjg++KmZSIe+7yvkqpGsuuFjOUsJee+8ZBWfSuS+Tyup4q9fVsluHxpZqf4v8DUOEZQCAAA="),e=c):"config"===o.r?(s.body=atob("H4sIAAAAAAAAA5VWS27jRhC9SoNBMPaC+tDOjGFQDXDhgWXLUhDJDrIskW2zzO4mh12Uo6xzFJ7BF+DFAv4kkbbszEYCu36vX9Ur0g1wwzCY+I9PtmS+BGMm5PMZBEAAejAYuMMAN9zd+zFDWykmAZpEwvZSx1rU5jraIp+trdrnMdZkG/xHXI4HjlD8r9nVdHm1Yt7yanV/u7xaNckJ1lK08Yr5vsVdSrlLAb8DKP9cI6TwqYTwxN04IYw124DMxOQR+TKLFXZPheAPmMbdQ7nhM6ANQu+Y+AwFUQbusK7Tlm8wvYwvRnxZ5GFUvGrmzR4qSKiTrEK0AWLlLSdnnP3aAl8iphQriExG5fPom+04l2wfFcB2F+UPoz/DAxIVjUfccezRt8MIjU8h9WJqAocVg/02lFmO9mJxfePdL9kvrklAV61F7g7LB/5pVw5puS3yLRWvxhR5xYqEtZAtObRNxMQPhR+t47/LIkJztpgPF9+/u8PGs+Frjgq7tOqdbRE+Q2YIkv4sqDgQvN+0yp0IyrbIIg+D4pW6meOMTM3j+S5oVntqFlfFeoVivzd1I+6hBkaQRmgIhDG9oRrzB0DNVJYRZZX5PZiZUaizjLCHUKHeNVqhbkNui7zINQnUogP0CNuoN7tqD5CqLDOUaV0VK+3raGe+LnIqckIJB2k/6WWaHmvm7xBFsV1lioyo7xYIApSmnXD5G3dNphSkWz6vZigfJogyppKpxtDMIAaTx7CdRKOqwbb2Uz9sUr+rg0YE/Lb4dzmth/6n5nvxf+lQI9tXwRtGPoB0PZ2vvD+8G++nAF2jJkjhGXoTM7Ylqv52OF78xrtdLubs2ps9TO/uvBVb3c/n08838iEU7xn0M0Qm7svSsROR9hTjnHPnPOyJxOFjp3d2wS96J1/5197JOe9nOuNnvROH9zPbYx4rKB9KCtnJmFXgT3teTtfLqb3gdCdgVu/MmoiQA0awKXKJ7CSS8ellu0UpbWfdsf1a8QoYdDjbt8+xE9N273I0YjbrGsWBsZXZKtOEqtwJabN9D0N8vX9ZhF00zls4zHkHkPMhIqcL6U3+Drx38vuanA7CeneItMijqMix3RzHBOfY5sdu5VTrOCmLSVnkzO4ppC7ThElUrUJ2nxmRQYVh2fJjUeoDVTVvW+vgggY2oga9zoh247UCKYXWwA8+rN68svlqMb2bzueL1Rsv8tsa+0+FTplyWcapL5p6B6vYcHedfhIda1+iH02+vKAO4pdBnAh9Yg2t0y91OmsZCim3moUgK4FY7UXqX+OnmBBPxY8bc2IRrG0/1o/4NHg2Vqmg2vwfbuoFencKAAA="),e=r):"config.js"===o.r?(s.body=atob("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"),e=c):s.code=404:(s.body=atob("H4sIAAAAAAAAA6VTwW7bMAz9FU0DhgSL7fU2NJKKYS2w9bIdhl4LRWJiNorkiXSCYNjf7Bv6A/2xwXbS1e0KdNiFNvkeH58oW73yyfG+gZo3waguimDjSkM0agNshattJmDd8rJ4bxQjBzBf724zEdLdr3p9d6uqoTo0RLsBvUXYNSmzcCkyRNZyh55r7WGLDoo+mWFERhsKcjaAPpFGedwKFyyR5tQMKXr915kHjBqMhxZqolGVx+0x9oEggOOOipHYqNQwpii2NrSg35kv9Y1tSbw+UdXAfNDcNbnU7M2bLs7FZUuE4jMltiGJibKizrDUNXNDp1V1gwNSLlGwzStgfb0INq7NA0RV1kwfuzye2S7oUW4UxqZl0V2RztZjGvZr+73YRUFsuSXhanBr8PrwPAqQESrYBQSxTHnEPw4oeth8w2BVNbyPHRSHG+yXUfyReLLqfzBdI3HK++ddPiLc2/zU1/HFVg86/+PVpbjE1fNWx/i90w8E3K4J+KVWB52x0yGSy9iwcSkSi/OLK73D6NOuDMnZ7lsuU8YVxhKjC60HmsgOCXUiltN5ABZe++TaDUSeuQyW4SJAl2nQxpej0gSmM9s0EP3HGoMfGIvk9+WDakfK8P2SOvjH1mZBeqwiB9NyOqeSstPnF1dncCrPspZvoczQBOtgIruDy5mUo5kTmv6cOXoiGTCu5XTuiMoMQUvifQCqAVh29LL/GbtBkkpHJPtxw+tI3hEd7E8klTckp6o67Pg3taztjQ8FAAA="),e=r);s.headers=[["Content-Type",e]],t&&s.headers.push(["Content-Encoding","gzip"])}catch(e){log("server error: "+e),s.code=500}s.send()}),Timer.set(1e4,!0,loop),loop();
//end

/**
 * Tämä käyttäjäskripti hyödyntää Open-Meteo-palvelun sääennustetta halvimpien tuntien määrän valintaan
 * Mitä kylmempi lämpötila, sitä useampi halvempi tunti ohjataan ja samalla myös ohjausminuuttien määrää kasvatetaan.
 * 
 * Muokkaa alle sijaintisi koordinaatit - esimerkkinä Tampere
 * Löydät koordinaatit esim. https://www.openstreetmap.org/ - klikkaa hiiren oikealla ja valitse "näytä osoite"
 * 
 * Sen jälkeen muokkaa alempaa toimintalogiikka haluamaksesi
 */
let LATITUDE = "60.5";
let LONGITUDE = "22.5";

//Mitä ohjausta hienosäädetään (0 = ohjaus #1, 1 = ohjaus #2 jne.)
let INSTANCE = 0;

/**
 * Alkuperäiset asetukset
 */
let originalConfig = {
  hours: 0,
  minutes: 60
};

/**
 * Päivä, jonka lämpötilat on haettu
 */
let activeDay = -1;

/**
 * Päivän matalin ja korkein lämpötila
 */
let tempData = {
  min: null,
  max: null
};

/**
 * Käytetään USER_CONFIG hyödyksi ja tallennetaan alkuperäiset asetukset
 */
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
    //Suoritetaan lämpötilalogiikka
    activeDay = -1;

    originalConfig.hours = config.m2.c;
    originalConfig.minutes = config.m;

    console.log("Alkuperäiset asetukset:", originalConfig);
  }
}

/**
 * Kun logiikka on suoritettu, katsotaan onko lämpötilan vaikutus jo tarkistettu tälle päivää
 * Jos ei ole, haetaan lämpötilat ja muutetaan tuntimääriä
 */
function USER_OVERRIDE(inst, cmd, callback) {
  //Jos kyseessä on jonkun muun asetukset niin ei tehdä mitään
  if (inst != INSTANCE) {
    callback(cmd);
    return;
  }

  //Vähän apumuuttujia
  const state = _;
  const config = state.c.i[inst];

  //Käytetää lähtökohtaisesti alkuperäisiin asetuksiin tallennettua tuntimäärää ja ohjausminuutteja
  //Näin ollen jos tallentaa asetukset käyttöliittymältä, tulee ne myös tähän käyttöön
  let hours = originalConfig.hours;
  let minutes = originalConfig.minutes;

  try {
    if (activeDay == new Date().getDate()) {
      console.log("Lämpötilat haettu jo tälle päivälle -> ei muutoksia:", tempData);
      callback(cmd);
      return;
    }

    let req = {
      url: "https://api.open-meteo.com/v1/forecast?latitude=" + LATITUDE + "&longitude=" + LONGITUDE + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1",
      timeout: 5,
      ssl_ca: "*"
    };

    console.log("Haetaan lämpötilatietoja:", req.url);
    
    Shelly.call("HTTP.GET", req, function (res, err, msg) {
      try {
        req = null;

        if (err === 0 && res != null && res.code === 200 && res.body) {
          let data = JSON.parse(res.body);
          res.body = null;

          //Tarkistetaan, onko vastaus validi
          if (data.daily.temperature_2m_min != undefined && data.daily.temperature_2m_max != undefined) {
            //Nyt meillä on alhaisin ja korkein lämpötila tälle päivälle
            tempData.min = data.daily.temperature_2m_min[0];
            tempData.max = data.daily.temperature_2m_max[0];

            console.log("Lämpötilat:", tempData);

            //------------------------------
            // Toimintalogiikka
            // muokkaa haluamaksesi
            //------------------------------

            //Muutetaan päivän alhaisimman lämpötilan perusteella lämmitystuntien määrää ja minuutteja
            if (tempData.min <= -15) {
              //Vuorokauden aikana alimmillaan alle -15 °C
              hours = 20;
              minutes = 60;

            } else if (tempData.min <= -10) {
              //Vuorokauden aikana alimmillaan -15...-10 °C
              hours = 18;
              minutes = 60;

            } else if (tempData.min <= -5) {
              //Vuorokauden aikana alimmillaan -10...-5 °C
              hours = 16;
              minutes = 60;

            } else if (tempData.min <= 0) {
              //Vuorokauden aikana alimmillaan alle 0 °C
              hours = 15;
              minutes = 60;

            } else {
              //Ei tehdä mitään --> käytetään käyttöliittymän asetuksia
            } 

            //------------------------------
            // Toimintalogiikka päättyy
            //------------------------------
            state.si[inst].str = "Kylmintä tänään: " + tempData.min.toFixed(1) + "°C -> halvat tunnit: " + hours + " h, ohjaus: " + minutes + " min";
            console.log("Kylmintä tänään:", tempData.min.toFixed(1), "°C -> asetettu halvimpien tuntien määräksi ", hours, "h ja ohjausminuuteiksi", minutes, "min");


            //Tänään ei enää tarvitse hakea
            activeDay = new Date().getDate();
            
          } else {
            throw new Error("Virheellinen lämpötiladata");
          }
        } else {
          throw new Error("Lämpötilojen haku epäonnistui:" + msg);
        }

      } catch (err) {
        state.si[inst].str = "Virhe lämpötilaohjauksessa:" + err;
        console.log("Virhe lämpötiloja käsitellessä:", err);
      }

      //Asetetaan arvot asetuksiin
      //HUOM: Jos käytät "oma valinta (2 jaksoa)", 2. jakson tunnit voit asettaa muuttujaan "state.c.m2.cnt2"
      config.m2.c = hours;
      config.m = minutes;

      //Pyydetään suorittamaan logiikka uusiksi
      callback(null);
      return;
    });

  } catch (err) {
    state.si[inst].str = "Virhe lämpötilaohjauksessa:" + err;
    console.log("Virhe tapahtui USER_CONFIG-funktiossa. Virhe:", err);
    
    config.m2.c = hours;
    config.m = minutes;

    callback(cmd);
  }
}