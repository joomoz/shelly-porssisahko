let C_HIST=24,C_ERRC=3,C_ERRD=120,C_DEF={mode:0,m0:{cmd:0},m1:{lim:0},m2:{per:24,cnt:0,lim:-999,sq:0,m:999},vat:24,day:0,night:0,bk:0,err:0,out:0,fh:0,inv:0},l={s:{v:"2.8.0",dn:"",st:0,cmd:0,chkTs:0,errCnt:0,errTs:0,upTs:0,timeOK:0,configOK:0,fCmdTs:0,tz:"+02:00",p:{ts:0,now:0,low:0,high:0,avg:0}},p:[],h:[],c:C_DEF},c=!1,r=!1;function o(t,s){s-=t;return 0<=s&&s<3600}function a(t){return Math.floor((t?t.getTime():Date.now())/1e3)}function n(t,s,e){let n=t.toString();for(;n.length<s;)n=e?e+n:" "+n;return n}function f(t){return t.getDate()}function i(t){let s=t.toString();(s="+0000"==(s=s.substring(3+s.indexOf("GMT")))?"Z":s.substring(0,3)+":"+s.substring(3))!=l.s.tz&&(l.s.p.ts=0),l.s.tz=s}function b(t,s){console.log((new Date).toISOString().substring(11)+": "+(s?s+" - ":""),t)}function u(){var t=new Date;l.s.timeOK=2e3<t.getFullYear()?1:0,l.s.dn=Shelly.getComponentConfig("sys").device.name,!l.s.upTs&&l.s.timeOK&&(l.s.upTs=a(t))}function d(t){Shelly.call("KVS.Get",{key:"porssi-config"},function(s,t,e,n){l.c=s?s.value:{},"function"==typeof USER_CONFIG&&(l.c=USER_CONFIG(l.c));{s=function(t){l.s.configOK=t?1:0,l.s.chkTs=0,n&&(c=!1,p())};let t=0;if(C_DEF){for(var r in C_DEF)if(void 0===l.c[r])l.c[r]=C_DEF[r],t++;else if("object"==typeof C_DEF[r])for(var o in C_DEF[r])void 0===l.c[r][o]&&(l.c[r][o]=C_DEF[r][o],t++);C_DEF=null,0<t?Shelly.call("KVS.Set",{key:"porssi-config",value:l.c},function(t,s,e,n){n&&n(0===s)},s):s&&s(!0)}else s&&s(!0)}},t)}function p(){if(!c)if(c=!0,u(),l.s.configOK)if(function(){let t=new Date,s=!1;s=l.s.timeOK&&(0===l.s.p.ts||f(new Date(1e3*l.s.p.ts))!==f(t)),l.s.errCnt>=C_ERRC&&a(t)-l.s.errTs<C_ERRD?(C_ERRD,a(t),l.s.errTs,s=!1):l.s.errCnt>=C_ERRC&&(l.s.errCnt=0);return s}()){let s=new Date;i(s);try{let t=s.getFullYear()+"-"+n(1+s.getMonth(),2,"0")+"-"+n(f(s),2,"0")+"T00:00:00"+l.s.tz.replace("+","%2b");var e=t.replace("T00:00:00","T23:59:59");let c={url:"https://dashboard.elering.ee/api/nps/price/csv?fields=fi&start="+t+"&end="+e,timeout:5,ssl_ca:"*"};s=null,t=null,Shelly.call("HTTP.GET",c,function(s,t,e){c=null;try{if(0!==t||null==s||200!==s.code||!s.body_b64)throw Error("conn.err ("+e+") "+JSON.stringify(s));{s.headers=null,e=s.message=null,l.p=[],l.s.p.high=-999,l.s.p.low=999,s.body_b64=atob(s.body_b64),s.body_b64=s.body_b64.substring(1+s.body_b64.indexOf("\n"));let t=0;for(;0<=t;){s.body_b64=s.body_b64.substring(t);var n=[t=0,0];if(0===(t=1+s.body_b64.indexOf('"',t)))break;n[0]=+s.body_b64.substring(t,s.body_b64.indexOf('"',t)),t=2+s.body_b64.indexOf('"',t),t=2+s.body_b64.indexOf(';"',t),n[1]=+(""+s.body_b64.substring(t,s.body_b64.indexOf('"',t)).replace(",",".")),n[1]=n[1]/10*(100+(0<n[1]?l.c.vat:0))/100;var r=new Date(1e3*n[0]).getHours();n[1]+=7<=r&&r<22?l.c.day:l.c.night,l.p.push(n),l.s.p.avg+=n[1],n[1]>l.s.p.high&&(l.s.p.high=n[1]),n[1]<l.s.p.low&&(l.s.p.low=n[1]),t=s.body_b64.indexOf("\n",t)}s=null,l.s.p.avg=0<l.p.length?l.s.p.avg/l.p.length:0;var o=new Date,i=new Date(1e3*l.p[0][0]);if(f(i)!==f(o))throw Error("date err "+o.toString()+" - "+i.toString());l.s.p.ts=a(o),l.s.p.now=v()}}catch(t){l.s.errCnt+=1,l.s.errTs=a(),l.s.p.ts=0,l.p=[],b(t)}A()})}catch(t){b(t),A()}}else!function(){if(0==l.s.chkTs)return 1;var t=new Date,s=new Date(1e3*l.s.chkTs);return s.getHours()!=t.getHours()||s.getFullYear()!=t.getFullYear()||0<l.s.fCmdTs&&l.s.fCmdTs-a(t)<0}()?c=!1:A();else d(!0)}function A(){var t,s,e=new Date;i(e),r=!1;try{function n(t){var s;r!=t&&(l.s.st=12,b("Note: command edited by user script")),r=t,t=function(t){t&&(l.s.chkTs=a()),c=!1},l.c.inv&&(r=!r),s="{id:"+l.c.out+",on:"+(r?"true":"false")+"}",Shelly.call("Switch.Set",s,function(t,s,e,n){if(0===s){for(l.s.cmd=r?1:0;l.h.length>=C_HIST;)l.h.splice(0,1);l.h.push([a(),r?1:0]),n&&n(!0)}else n&&n(!1)},t)}0===l.c.mode?(r=1===l.c.m0.cmd,l.s.st=1):l.s.timeOK&&0<l.s.p.ts&&f(new Date(1e3*l.s.p.ts))===f(e)?(l.s.p.now=v(),1===l.c.mode?(r=l.s.p.now<=("avg"==l.c.m1.lim?l.s.p.avg:l.c.m1.lim),l.s.st=r?2:3):2===l.c.mode&&(r=function(){if(0!=l.c.m2.cn){var n=[];for(g=0;g<l.p.length;g+=l.c.m2.per){var r=[];for(ind=g;ind<g+l.c.m2.per&&!(ind>l.p.length-1);ind++)r.push(ind);if(l.c.m2.sq){let s=999,e=0;for(h=0;h<=r.length-l.c.m2.cnt;h++){let t=0;for(m=h;m<h+l.c.m2.cnt;m++)t+=l.p[r[m]][1];t/l.c.m2.cnt<s&&(s=t/l.c.m2.cnt,e=h)}for(h=e;h<e+l.c.m2.cnt;h++)n.push(r[h])}else{for(h=1;h<r.length;h++){var t=r[h];for(m=h-1;0<=m&&l.p[t][1]<l.p[r[m]][1];m--)r[m+1]=r[m];r[m+1]=t}for(h=0;h<l.c.m2.cnt;h++)n.push(r[h])}}var e=a();let s=!1;for(let t=0;t<n.length;t++)if(o(l.p[n[t]][0],e)){s=!0;break}return g=null,h=null,m=null,s}}(),l.s.st=r?5:4,!r&&l.s.p.now<=("avg"==l.c.m2.lim?l.s.p.avg:l.c.m2.lim)&&(r=!0,l.s.st=6),r)&&l.s.p.now>("avg"==l.c.m2.m?l.s.p.avg:l.c.m2.m)&&(r=!1,l.s.st=11)):l.s.timeOK?(l.s.st=7,t=1<<e.getHours(),(l.c.bk&t)==t&&(r=!0)):(r=1===l.c.err,l.s.st=8),l.s.timeOK&&(0<l.c.fh&&(s=1<<e.getHours(),(l.c.fh&s)==s)&&(r=!0,l.s.st=10),0<l.s.fCmdTs)&&(0<l.s.fCmdTs-a(e)?(r=!0,l.s.st=9):l.s.fCmdTs=0),"function"==typeof USER_OVERRIDE?USER_OVERRIDE(r,l,n):n(r)}catch(t){b(t),c=!1}}let g=0,h=0,m=0;function v(){var s=a();for(let t=0;t<l.p.length;t++)if(o(l.p[t][0],s))return l.p[t][1];throw l.p.length<24&&(l.s.p.ts=0),Error("no price for this hour")}b("shelly-porssisahko v."+l.s.v),b("URL: http://"+(Shelly.getComponentStatus("wifi").sta_ip??"192.168.33.1")+"/script/"+Shelly.getCurrentScriptId()),HTTPServer.registerEndpoint("",function(e,n){try{if(c)return e=null,n.code=503,void n.send();var r=function(t){var s={},e=t.split("&");for(let t=0;t<e.length;t++){var n=e[t].split("=");s[n[0]]=n[1]}return s}(e.query);e=null;let t="application/json",s=(n.code=200,!0);var o="text/html",i="text/javascript";"s"===r.r?(u(),n.body=JSON.stringify(l),s=!1):"r"===r.r?(d(l.s.configOK=!1),l.s.p.ts=0,n.code=204,s=!1):"f"===r.r&&r.ts?(l.s.fCmdTs=+(""+r.ts),l.s.chkTs=0,n.code=204,s=!1):r.r?"s.js"===r.r?(n.body=atob("H4sIAAAAAAAACo1W4W7bNhB+FYXrAhJmCKft/thTjbbJ1nVJM9RegaEoFkaiI9o06ZAnt4art8mb5MV2lGRHCdx2f+KY/O7uu7vvjjYKkr/fn6WEcPwYx8+bkEL6IndZuVAWxE2p/HqsjMrAeQqMn7z6PaUsfbGp+HjycnL673jyPv1I/ry7XVurAyi4u727tYTHo6BdMZNlwG9vtAWZSGNU4uVM2t3R2uhHJ0onhTQrvVhqmaA7Y+5uk4iYyXlwxsgd8n/C6qhSW5ksI7kaeLSN+UH6RVkGKC20bBMaGaClm0mOdnN0r1XuQpAs+ry7xWigjdzCawjadFF/yfncHW0RP4dEBtAPLwDKpA77oBYLZK8XeksvFhYw3gyLmoS518sdTUTPtZ85DSAl+cTPL0467Xhc++gQ/38bi2Pbyi0kRAZWA5oHkKDSldN50uevX43Tj5/4QtXNRl24pbITeZXKsLZZghLZNMiDNIXDQ0Li59evFFIC8uoo+sLQjH/WNnefhXGZRN5WFDIUKQxX0icyvQmU/ER6wIby8JBKkRUqm6s8PegzTkiaNoDsKEKEtlb5N5Pzs8ND+VlqSJZuWRqkfLK2cqGzEwmSQo+IAhYGE23tKq5W0rx2WAGNDsZZrOBEXoeUttycNU7mTWK1sttU6T7uIpRXAby21/S4txeAZ+rLxTRmxhiG3z9KL42hRACWSEydP5VZgaV7AULm+ekK0WdxlJAvJVkh7bUiHDrMQGA/rxUInbOKMY5OY4g/csSgOxrLG+pMQ6zh7prtIdHgsFU67Q/1r62ZMMpeQzHUvR5rjz7qT00TJuoLjGJV6b4bNpgqwHQ6d8FnTEChLJ2WNoulojl2i23iXwFoRB/fe7apI3jMr2K842wpPebyzuVKeLVwK/W60CbvhIv4PdpoGwxcxh6DX29OTj/Uio2rr0dGPkW9oM+lkZmitYxRRtig3dFWWtjYWsEqbZSInWjUxw+O2VAJNx9RLLvsiDZVIib7LTEilg0em5BT752P3gH1lkT7QUJ6SsAXqFByUTNskzmL204JFcF4UFW85dNmjEHjRLVJR9665d00SrKhnlKNrNnG4IMAqS2NGXoFpbfJ0/5zHG0tmonGMYVUjRpzLWa4SigbbL82nUQltWi+cfPBQZ9n2KzB7hDZ775EwfA6MaiqNuLDhGSPxKS7Bqzxe7zH7+WTjawGyZNNF18lFI8fcKzYZRM2plrdF3MvhdYpOnk7vngnmvHX03UsNrt8yObouMvjGybd0BXHgcU9fBKXL844WoJoGqjiVLhxs20YCj8f49gDfcpJn7BKPNlQQnq4h2qDc1RVgdXfA7xsEL9hwH+U9JS1MSc67necCNRHFMkxiysIkW9c6cN3o2NXSBtX2xLUD9BUjnYGY4Xlzb9vMCDRSI2I2EUxRofvWj7bWXZKui/F+1tsR4+guu7LEaFcMV4usUfqzLll52Gon6Ow1BaXQoA1CmSlg77SRsM6JfX/RpHhdszg0XrY7Rnc+kOIW6J5cqFeDYNf+s/iIyqijnDOmrsoEhZf4wfPBLb52wuA31tWU/zRY8z6B8wLnecKf2wEVdfAlUDv8+fH6jkulSFuy5FXN2/RU65WOPpY63sUZcP/ABwXa3JNCgAA"),t=i):"s.css"===r.r?(n.body=atob("H4sIAAAAAAAACo1VS2/jNhD+K8QGBZJsJEvJOnUktGhPCxRF0Ut7KXqgyKHEmiIFkvJjA//3Dqmns1m0F1ucF795fMPN/T25J64Bpc5JZ6xz0tFmb0gQ37I78kuPIiKd8VQZkpDG+67YbP4ZJamQaBiEDqW19E1fpcy0s8HmG7F/lQy0g4J8/u0P8rMQYA35DBosVeT3vlKSTSbk8JRm5H6DTq+kMqfEyS9S1wV+Ww42QVFJLnji5wdC0YYZZWxBboCJTOSTLjhTtq+t6TVH7SN7gm1WEiU1JA3IuvEFydNP0JZEGO3DNQgvS19miaCtVOeC/AmWU01L0tJTcpTcNwX59GKD3XjKs+y7oLa11BiD0N6bknSU84h8253QpIu4b7z0ChDd6tIRxuCPCXpv2ugVHZjpztf2WboL9lTJWicOlCiIUHBKQPOSeDj5JKoKYkOaIUgq1AljcOk6Rc+DeZR7WjlUdMZJL01wAUW9PEB5Xb6cVuyFzS5FUYEwFh6mIxUebGyG9qCxtB8+lMt1aKNg5TxbK6A2dNY3kzZkqgzFCArEgN27NXRt9BwqUbQCtdZWyrD9my4/pt9vQ73mfmRY8ec81nAcKjtaYqOcUZJjws80221Lwnrrwnh1RmJmdr55TBTvvpqBpZCYqFG9R6xfEqk5nNAEu2O6BVDIENGskOVxqq4qL4Qo5xmfpth0lEl/js6xQgVrgO2Bf7wqy38HGvIvvgoTI3x8k+l8a75K6nFwNd26DbWVOIrhN/HQoswDxlF9qx16CxsZEj6is+t0nMFY4QQOeJubGj1VN32MpVmYO5xH/EiJcB6b5y3VrqMW48wdnhKfBnkUI+5JdWxk6NY0EZTLHlFsQ1epli0d2hqw5i4OGLVEaiF1dLuQn/ZwFpa24MiQUJgI/ItokCxIaYs70sPt03PGob5Dn8tAjZQx4nkhpHU+YY1UHIlV1RPrj2PSlVFY1QNYLxlVE8kxhW+TFXmftCY0UUVm4Zbg0gIbyW6OEXkLXNLb9Xrb4bq6C+AjvBbRvcOyq8m/rGzXmbxOe22c9rDVluLHCZ43+7D4sqtgdh0sPgmLb458rRSmPjT+f2Q8DOFbwx+5PJDXZYGXS2uWG12Y/rg+1kOlaBeetenr66IsmN/Bu34iBh6xUPTVCsc3cVo7Qq7XDUaPExtxQaDL0dIuGh7zXbay3I1PT9r6PJvTHCs46bAa+VivyO9gbrfroswYW7XIx65OqurhxiWs5e9P7gX50vX+L3/u4Ieqx27rv9++hHlg9eVfkoq6D6gIAAA="),t="text/css"):"status"===r.r?(n.body=atob("H4sIAAAAAAAACqVSS07DMBS8iuUVLJo2CyQWqSV2CFUqElzgxXbJax07xK8tuU/OwAVyMZxPU6UtbFjYi5nxvJmXJASp0Uwa8H7JcyYlFwmV4agBPMaPC7HOtrD3zFbUEqiWfiZzJVaggABsFEXDo16589oyrw2SHvWeTsbiramzXfNtWYaWYOJq3fFSxqipbVOHa1QpqMRkoKeqKgocBblTelSsAIl0SGQxP0uUHQXvaGDE0W6cSObdXkSi8HBazsZ8sXCCdzqTzvAJSbLlYpaXD1dETvEigKl4bWo8hB5tbwvEtsBclz6Zp2FkeBXi9HMnn4ATSz+4eMIdXIHP7Qqv0PVg29mkTlV9t+JcrJ92q4H5o0Hvm6EnVyL8I/YvAVvny4znpJ3kRq5e4WWJBYlSf774Ox4swi8HtPfR1vP7ZD7QP8yL/z3xAgAA"),t=o):"status.js"===r.r?(n.body=atob("H4sIAAAAAAAACoVW624iNxh9lcG7RXZnmEBaVUpmDGr3olS7q6wapFZCqHhnTMabwWZtQxqR+ZdHyZvwYv08F2Ao2SoEfPkux8fHn73JufWWtB+M4T+h/WjNtMcpMw8ywYQON1Y/bMQcr5VIvX6HUmOZ5cQNdaqmzbS6995prTRGUnkpswyRMo6urANBdWgCBt9JYGk/1uEyzLm8tVmgKP5mMHpleskiRSQUUnJ9Nf70kYoQRkbo8/Zp+/Tx4/YJXaLP17/foKBlb+xDzsNE5Uo3HreacwnWmqc744VKeSv6p+u37/6+Gf8xYaGbmzaGqTwCkcpmSqr71pwdCVgHjIZWvRf/8BSfEx95ydndnxmk3+U2tuWGLyiFuMaObsa/jisQrjsNNV/mLOEY/WBQMFd6wexboG8sFhxLfu+5Dh7wn34U4fzNIh0bEnQGhFwexSE+ZpBvPUIevts+b5+l5UJySRwoslsoezhazewDN3eC6bW69F5v3NrY+vZgbUW1tPiLHl6xfC1kY5a3KDgw+8DynO/tMnGb/ddwdkCVkHPVQjW7zr6ylfEs03fCWG7tCoJV3JziJcnugBYI3fNmPu7HLq01I5RBSGa9jJURkP9yBGcPnDoP0K7gVn1lpR9jMgzDPYHrNtAP2+cHKSuMDzuML+3falnBdBtUupntMzhhvDMk4S2vAJLeKef9NDmD4bNf+u5z/jPZMYwGCDIst89i7VRAgJM110YooEaE62AyJREc43OQY3UIul1LADZ2JQGOaWQPDmpkfWd1Hi65Jht3uBd0Mo0ac05txGPrNybdbgfz4d69NyAR932yCJcrk2FeZi6NzTeyqSJcXFwEEtI2MQ20TUwXTYjSPJE2MhBo04DcIzCAwPg7K5cOQAOGyWLCp9PJYBrZs2Y6htViQL0bgNSGFPtoEqLJdjRVgXfRSMFzw0+AGIBbg7h0Krky1DmVZpby3iDqx9R2uw6bccDiCqWtUfZ6BDr+YErdWFS3zQG6PqR5GVsB5EL4ZccVGifox8cxtNvaulIrbUA9m1rPy5aeEYrqPQBiOoPoO7qo15iWVNtpkNOWXtNJH4RWwz7QGvz2XcF+fBwcjKaODYoRlB5Ujg7CXCxGdTW6bAbI4+OhbhUgT/JVyg225ESQ87AVArpHAU54HKU9r9OCaudZdxDHllDqfqKy2JZq6nAS2CE1B8cAm/25cUzK6mbM6Cy2oAt3e1H0epMf7MgLGzVCcyVt755DFbWXX1SeRq6gF683coS+sOTuVquVTC9f8dT9VZNoOAsyit3HdylTL8mZMRTNhUXDViXN3WVSxGc2Hc6I72xh3vFyora3jfgI/VVmq8Z9BL96iKJTwvJpVixrVcKb4+RKnXx1mIGestAobTHmAbA9tKCkHndyCtwbIqsl2O0mIG7ow4ybbASdiaObFzTtZFy+cDw198Clkq6kKHaIYYOw/D+eWuKu0JwgjgNxI1TfXktXf+EqBJKaESXMS3wd4/apLJL9+oqiSJhNXBHdJEoaBe8fXr6+oKpCdaFDiMOP1v3CGwuNRc48Ljy46FJlDPvO66p6T9ndK6lulq+iul29surOcteqbvW649ZWFBHcW8Gb326a66D4F6jAkDOICgAA"),t=i):"config"===r.r?(n.body=atob("H4sIAAAAAAAACp1U7W6bMBR9FQtpavuDJqFRW03EEj9ahaSBaqGd9tMxbnEwNsUmXfd7j5Jn6AvwYjPhI4GtrToJhLi+x+f6nnNth3QDMENSTgyFwcqAP26u3OVVYA/0CrQVWjHSJCQAY0PHMv2GdfB5dDmEfrRGuVQoRXoB2pIwghWg4SQRIYH2oAo0yF26UmiDACu2kSpedyjK03wHEvoj6S8ysVrEvNgWW64I5YQDsWM7wKiXlExwRHC8Ej/LHSjftNClpoiLVw6cm/suzwa1POBLm05ppkSCYpmr8n94YVrWV7BHheilReFB/D2y9y1M1GgILcscXhwiOH2MVA9Td7fivEdZkuv+5ZzTkrQEreJ2eVpslX4oQx+fnGQZ9L2Bf33doG9RHAtzh4wlabZ/iLQsO3Gh3bVAeYbSB/Pi99L1pzPnbvkfXnivxmRo4iSEoK7z/TKmrhc435yZ86kippQrlKE16iqejExGk74U7/LPnPnS98BUu8ddLJwABHee535uPJw14mvtKNGfDstMic4WqaKCgw1iua5rDK1xNzSy4Mjqhi7hZTdwDs+7gTHs7XIGz3pM0GpHE0SNX4KcK5qU85YV2177LBPzvZNbyC3RqXFcbGllsLeVt0z51PraoRyBtGRi+h4AZk+viqaGadkavWr0QjeUJjQqlX4LlXyssXFwPok2pCp6lSvV9ilAjBHOEaxF/7dRAt9duJ7nB39lKdxw7G+JDk05jyLDpOY7mFgJ7VX2AVpwzCiOJ0fPlIfi+VSkhB8bA+PkqNpuGRHGXpriJc5oqmBGnmby2NBtMbHgD/TxdC2NE22HavkPMP/LnhcGAAA="),t=o):"config.js"===r.r?(n.body=atob("H4sIAAAAAAAACoVVbW/bNhD+KzZXuGStMLJW9INlxtiWAsWaLECdFf020/LJJqy3SLRbw9O/yT/JH9uRlB0pMdYvsu+54/F49zzkIQHdS0R/FO5k2QMhq30WUSauDrrcH1RMd7la9vy+EJWWGgaDfjIY2L/sYFZoh/MofKgo+SXNl0AYV1kG5af72xtxe3f98Z/Z/ReeyoJS8CSmnk/yQqs86+1ksgVB3hxkTa7eHKCeXDrP1Zx57XwuUHNjOke+1S0cLQerbIdwtIZoA0t0oD0ljUnGhLionWwvRsvBS7lvwWg5OFOrdTve2qHpmxSEhHFeUmOA8EOYBO9DGA6ZHIr5RGXFVvf0vsAz2hoW+Q/SU0tBvpnDmiNTQobAeCGXMy1LTQOP+ITVvblr52LTaabkJRSJjOC3JKHkG/HIgjSNitc/iYwJO1+q28iWcewb1XyxGYwmE2BCmJ9mj5dB8bod5EqGsuxMAO0zE0j9iyhddgJTnyN0LnZ0kai0zYIRR6BxBhcFlG1nwBE4OaNMd50InJzVQ7eCgFcP5woILtJukufNX1QW2MpQT35dR1JHa4o6ifKsyhMwrcABAKvrECjz/vh9xottZUJcukruDNnlcvlxB5m+UZUGHCglUaKiDfGsNnF4VwfgRQkm5hpiuU00ZaGRa1eQjqEYPnQsswqPDEDkbkWEwE2hqX1qobGkLQxzWsEJi3a1yDwruqOrpUbjQdWJ13Kcjsa+Z+V2XNbSoVmGijt6WlI0Hiu5o6+jR+NdbJDPz9w2vPx/gg8GluHCfP61DD5DcBuEmczHBYWWzeI1zZuTOQaLswQ/hljqiqhFa+/I2VOfO5Ru/EhbcSv1mqcqoyeWP69o8Zw1S6oHcY7ox0qC50qCdiUnDBFLmUrI71Lp3gr0tdSS/v3lZvj2siyiy89fZ3wGerqBvSBFXlaVukCyx2pFBk4Sb4d/zu7+4pUuVbZS8Z5qxsLA9/E54RHyadpKOhuSaSnMwfUaMmp4LhPAS5HcyyQBvNu03vaxTPNc1Xgep69T2PyrKtcw7pm7lc1ZzcYv8YrrH9r6TtpsdmhCcP48haqSK6PSIyvyMvq5Lu2b6d7QoszTwpS9zbRKnx6fHsunxzF2M9smCb6k+Ipi2f4EP4002dTONk5yZPG1kW+Wf6fscgS/Dj/47+DdB5/h1OD1JFzT4oGuhEnkufME/nvcxnWY3H3u413WOiE2gWF76v8A7GSWEfwHAAA="),t=i):n.code=404:(n.body=atob("H4sIAAAAAAAACo1SzY7TMBB+FeMDakWTihvajb1CsAf2xAFxRa49bWbr2sYzaVUh3oZn2Bfoi+E02Z8srODieOYbf983k2leuWj5mKDlnddNfwpvwkZB0M0O2AjbmkzAquN19U43jOxBfz7dZSKk0692e7prlkN2eBDMDtQe4ZBiZmFjYAis5AEdt8rBHi1U52CBARmNr8gaD+qt1I3DvbDeECmOaQjRqb9rFvChghKG8SGl4nwC2piO+nV/XoqbrlCITxTZ+ChmjRFthrVqmRNdLJe3OCD1GgWbvCl9f1uVeWz1E6RZGj0fJR6FRttmRc9i3WBIHYt+yiobh3EYkTm3ZlYVseGOyqDBbqHYHb73BKRF480KvFjHPKm/F6jOsP6C3jTL4T51UI0/4TyM6pFCv9zEP00XyjVuXjY5xR9Mvi+r1G3L8b9OB56p0+EkmzGxLgXE4uP1V3XA4OKh9tEaxhjqmHGDocZgfeeAZrJHfBuJ5fzSAwunyvJ3u6K3sBkMw7WHPlKgtKsnqRnMFyYlCO5Di94NFavojvWTbF+U4fsN9fCPvcmC1JRFDqaLPtWUrSq2r+BCXmUl30CdIXljYSb7xuVCyonmjOY/F5b+oPQYtoWwIIXAK0l89EAtAMu+vD4veC8kqS6xPMsN1wl9SYz2i836lmTZ8XHGvwHYLtlMJgQAAA=="),t=o),n.headers=[["Content-Type",t]],s&&n.headers.push(["Content-Encoding","gzip"])}catch(t){b(t),n.code=500}n.send()}),Timer.set(1e4,!0,p),p();

function USER_CONFIG(config) {
  config = {
    /**  
     * Active mode
     * 0: manual mode (on/off toggle)
     * 1: price limit
     * 2: cheapest hours 
    */
    mode: 0,
    /** Settings for mode 0 (manual) */
    m0: {
      /** Manual relay output command [0/1] */
      cmd: 0
    },
    /** Settings for mode 1 (price limit) */
    m1: {
      /** Price limit limit - if price <= relay output command is set on [c/kWh] */
      lim: 0
    },
    /** Settings for mode 2 (cheapest hours) */
    m2: {
      /** Period length [h] (example: 24 -> cheapest hours during 24h) */
      per: 24,
      /** How many cheapest hours */
      cnt: 0,
      /** Always on price limit [c/kWh] */
      lim: -999,
      /** Should the hours be sequential / in a row [0/1] */
      sq: 0,
      /** Maximum price limit [c/kWh] */
      m: 999
    },
    /** VAT added to spot price [%] */
    vat: 24,
    /** Day (07...22) transfer price [c/kWh] */
    day: 0,
    /** Night (22...07) transfer price [c/kWh] */
    night: 0,
    /** Backup hours [binary] (example: 0b111111 = 00, 01, 02, 03, 04, 05) */
    bk: 0b0,
    /** Relay output command if clock time is not known [0/1] */
    err: 0,
    /** Output number to use [0..n] */
    out: 0,
    /** Forced ON hours [binary] (example: 0b110000000000001100000 = 05, 06, 19, 20) */
    fh: 0b0,
    /** Invert output [0/1] */
    inv: 0
  };

  return config;
}