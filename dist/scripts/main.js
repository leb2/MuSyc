"use strict";function Visualization(t,e,n,a){this.name=t,this.start=e,this.clean=a,this.update=n}function BackgroundVisualization(t,e){this.name=t,this.update=e}function hexToRgb(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]:null}function Complex(t,e){this.re=t,this.im=e||0}function fft(t){var e=t.length;if(e<=1)return t;var n=e/2,a=[],r=[];a.length=n,r.length=n;for(var o=0;o<n;++o)a[o]=t[2*o],r[o]=t[2*o+1];a=fft(a),r=fft(r);for(var i=-2*Math.PI,l=0;l<n;++l){a[l]instanceof Complex||(a[l]=new Complex(a[l],0)),r[l]instanceof Complex||(r[l]=new Complex(r[l],0));var s=l/e,u=new Complex(0,i*s);u.cexp(u).mul(r[l],u),t[l]=a[l].add(u,r[l]),t[l+n]=a[l].sub(u,a[l])}return t}function getFft(){for(var t=new Array(POINTS),e=0;e<POINTS;e++)t[e]=musicData[-e*EXPAND+Math.floor(time*sampleRate)];for(var n=fft(t),a=new Array(TAKE),e=0;e<TAKE;e++)a[e]=Math.sqrt(n[e].re*n[e].re+n[e].im*n[e].im);return a}function decodedDone(t){musicData=new Float32Array(t.length),musicData=t.getChannelData(0)}function getMaxOfArray(t){return Math.max.apply(null,t)}function playFile(t){var e=document.getElementById("sound"),n=new FileReader;n.onload=function(t){return function(e){t.src=e.target.result}}(e),n.readAsDataURL(t.files[0])}var visOptions=[],bgVisOptions=[],getFreq=function(t,e){var n=e+t/12;return n-=4,440*Math.pow(2,n)},getNote=function(t){var e=Math.log2(t/440);return 12*((e+100)%1)},getOctave=function(t){var e=Math.log2(freq/440);return 4+Math.floor(e)},getColor=function(t){var e=JSON.parse(localStorage.getItem("notes"));e||(e=["#bfbf40","#a3cb62","#40bf40","#3cb4b4","#4040bf","#8747c2","#b485d6","#b03b83","#bf4040","#bf6240","#bf9140","#bfa640"]);var n=new Array(12);if(n=e,null==n)return[255,0,0];var a=Math.floor(t),r=(a+1)%12;a=hexToRgb(n[a]),r=hexToRgb(n[r]);for(var o=new Array(3),i=0;i<3;i++)o[i]=t%1*r[i]+(1-t%1)*a[i];return o};Complex.prototype.add=function(t,e){return e.re=this.re+t.re,e.im=this.im+t.im,e},Complex.prototype.sub=function(t,e){return e.re=this.re-t.re,e.im=this.im-t.im,e},Complex.prototype.mul=function(t,e){var n=this.re*t.re-this.im*t.im;return e.im=this.re*t.im+this.im*t.re,e.re=n,e},Complex.prototype.cexp=function(t){var e=Math.exp(this.re);return t.re=e*Math.cos(this.im),t.im=e*Math.sin(this.im),t},Complex.prototype.log=function(){this.re?this.im<0?console.log(this.re.toString()+this.im.toString()+"j"):console.log(this.re.toString()+"+"+this.im.toString()+"j"):console.log(this.im.toString()+"j")};var POINTS=1024,EXPAND=4,TAKE=512,MULTIPLIER=11.7,canvas=document.getElementById("graph");visOptions.push(new Visualization("Bar Visualization",function(t,e){console.log("init");for(var n=new Array(TAKE),a=0;a<TAKE;a++)n[a]=a;d3.select("svg").selectAll("rect").data(n).enter().append("rect").attr("x",function(e){return e*t/n.length}).attr("y",0).attr("width",t/n.length).attr("height",function(t){})},function(t,e,n){var a=new Array(TAKE);a[0]=n[0],a[TAKE-1]=n[TAKE-1];for(var r=1;r<TAKE-1;r++)a[r]=(2*n[r]+n[r-1]+n[r+1])/4,a[r]*=Math.pow(r/TAKE*2,.7);if(Math.floor(time*sampleRate)>POINTS*EXPAND){for(var o=[],r=1;r<n.length;r++)o.push([r,2*Math.pow(a[r]*r/TAKE*2,.7)]);d3.select("svg").selectAll("rect").data(o).attr("x",function(e){return e[0]*t/o.length}).attr("y",function(t){return e-10*t[1]}).attr("width",t/o.length).attr("height",function(t){return 10*t[1]}).attr("fill",function(t){var e=(getNote(MULTIPLIER*t[0]),getColor(getNote(MULTIPLIER*t[0])));return"rgb("+Math.floor(e[0])+","+Math.floor(e[1])+","+Math.floor(e[2])+")"})}},function(){var t=document.getElementById("graph");t.innerHTML=""}));var canvas=document.getElementById("graph");visOptions.push(new Visualization("Ball Visualization",function(t,e){for(var n=new Array(TAKE),a=0;a<TAKE;a++)n[a]=a;d3.select("svg").selectAll("circle").data(n).enter().append("circle").attr("cx",function(e){return e*t/n.length}).attr("cy",0).attr("r",10)},function(t,e,n){var a=new Array(TAKE);a[0]=n[0],a[TAKE-1]=n[TAKE-1];for(var r=1;r<TAKE-1;r++)a[r]=(2*n[r]+n[r-1]+n[r+1])/4,a[r]*=Math.pow(r/TAKE*2,.7);if(Math.floor(time*sampleRate)>POINTS*EXPAND){for(var o=[],r=1;r<a.length;r++)o.push([r,a[r]]);d3.select("svg").selectAll("circle").data(o).attr("cx",function(e){return e[0]*t/o.length}).attr("cy",function(t){return e-10*t[1]}).attr("r",function(t){return Math.pow(1.5*t[1],.7)+2}).attr("fill",function(t){var e=(getNote(MULTIPLIER*t[0]),getColor(getNote(MULTIPLIER*t[0])));return"rgb("+Math.floor(e[0])+","+Math.floor(e[1])+","+Math.floor(e[2])+")"})}},function(){var t=document.getElementById("graph");t.innerHTML=""}));var clears=0;visOptions.push(new Visualization("Note Visualization",function(t,e){clears=0},function(t,e){if(Math.floor(time*sampleRate)>POINTS*EXPAND){var n=getFft(),a=new Array(TAKE);a[0]=n[0],a[TAKE-1]=n[TAKE-1];for(var r=1;r<TAKE-1;r++)a[r]=(2*n[r]+n[r-1]+n[r+1])/4,a[r]*=Math.pow(r/TAKE*2,.7);var o=new Array(TAKE);o[0]=[!1,0],o[TAKE-1]=[!1,0];for(var r=1;r<TAKE-1;r++)a[r]>a[r-1]&&a[r]>a[r+1]&&a[r]>3?o[r]=[!0,a[r]]:o[r]=[!1,0];var i=Math.floor(100*time/t);clears!=i&&(this.clean(),clears=i);for(var l=[],r=1;r<o.length;r++)o[r][0]&&l.push([r,o[r][1]]);for(var r=0;r<l.length;r++)d3.select("svg").append("circle").attr("cx",function(e){return 100*time%t}).attr("cy",function(t){return e-l[r][0]*e/TAKE}).attr("r",function(t){return Math.pow(l[r][1],.85)}).attr("fill",function(t){var e=(getNote(MULTIPLIER*l[r][0]),getColor(getNote(MULTIPLIER*l[r][0])));return"rgb("+Math.floor(e[0])+","+Math.floor(e[1])+","+Math.floor(e[2])+")"})}},function(){var t=document.getElementById("graph");t.innerHTML=""}));var canvas=document.getElementById("graph");bgVisOptions.push(new BackgroundVisualization("Average Pitch",function(t){for(var e=0,n=[0,0,0],a=1;a<TAKE;a++){e+=t[a];var r=getColor(Math.floor(getNote(MULTIPLIER*a)));n[0]+=r[0]*t[a],n[1]+=r[1]*t[a],n[2]+=r[2]*t[a]}e/=getMaxOfArray(t)/300;var o="rgb("+Math.floor(n[0]/e)+","+Math.floor(n[1]/e)+","+Math.floor(n[2]/e)+")";$("body").css("background",o)}));var canvas=document.getElementById("graph");console.log("BG"),bgVisOptions.push(new BackgroundVisualization("Max Pitch",function(t){function e(t,n,a){return n==t.length-1?a:t[n]>t[a]?e(t,n+1,n):e(t,n+1,a)}var t=t.splice(1,t.length);console.log("called");var n=e(t,0,0);0===n&&(n=1);var a=getColor(Math.floor(getNote(MULTIPLIER*n))),r="rgb("+Math.floor(a[0])+","+Math.floor(a[1])+","+Math.floor(a[2])+")";$("body").css("background",r)}));var hasInput=!1,musicData,sampleRate,openFile=function(){var t=document.getElementById("myFile"),e=new AudioContext,n=new FileReader;n.onload=function(){var t=n.result;e.decodeAudioData(t,decodedDone)};n.readAsArrayBuffer(t.files[0]);sampleRate=e.sampleRate,hasInput=!0,$(".card.choose-sound").hide()},time=0,playing=!1,lasttime=0,vis,bgVis,PADDING_BOT=60,playpause=function(){playing=!playing,playing&&(lasttime=Date.now())},cycle=function t(){playing&&update(),setTimeout(t,25)};cycle(),$(function(){for(var t=document.getElementById("vis-sel"),e=0;e<visOptions.length;e++){var n=document.createElement("option");n.appendChild(document.createTextNode(visOptions[e].name)),n.value=e,t.add(n)}for(var a=document.getElementById("bg-vis-sel"),e=0;e<bgVisOptions.length;e++){var n=document.createElement("option");n.appendChild(document.createTextNode(bgVisOptions[e].name)),n.value=e,a.add(n)}vis=visOptions[0],bgVis=bgVisOptions[0],$("#vis-sel").change(function(){vis.clean(),vis=visOptions[$(this).val()],vis.start($(window).width(),$(window).height()-PADDING_BOT)}),$("#bg-vis-sel").change(function(){bgVis=bgVisOptions[$(this).val()]}),vis.start($(window).width(),$(window).height()-PADDING_BOT)});var update=function(){if(hasInput){var t=Date.now()-lasttime;time+=t/1e3,time>musicData.length/sampleRate&&(time=0,$("#playpause").find("i").text("play_arrow"),playing=!1),lasttime+=t,$(".play-bar-progress").css("width",100*time/(musicData.length/sampleRate)+"%");var e=getFft();vis.update($(window).width(),$(window).height()-PADDING_BOT,e),bgVis.update(e)}};$(function(){$("#playpause").click(function(){$(this).find("i").text(playing?"play_arrow":"pause"),playpause();var t=document.getElementById("sound");t.paused?t.play():t.pause()})});