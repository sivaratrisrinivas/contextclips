(function(){console.log("%c📋 v4.0 Content Script","color: blue; font-size: 16px");document.addEventListener("copy",()=>{setTimeout(()=>{navigator.clipboard.readText().then(o=>{o&&chrome.runtime.sendMessage({type:"SAVE",content:o,domain:location.hostname,title:document.title,url:location.href},t=>{t!=null&&t.ok&&console.log("✅ v4.0 Saved")})}).catch(o=>console.error("v4.0 Error:",o))},100)});
})()
