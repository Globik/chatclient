import{u as n,f as r,o as i,b as e,c as t,d as l,e as o}from"./index-21a1d939.js";const _={class:"loading-page h-screen flex flex-col items-center justify-center"},d={key:0},f=o("h1",{class:"title text-xl font-bold flex flex-col items-center justify-center"}," Загрузка... ",-1),h=o("p",{class:"description"},"Ваша информация обрабатывается...",-1),u=[f,h],p={key:1},y={__name:"GoogleView",setup(x){const c=n(),{getUserData:a}=r();return i(async()=>{try{await a()}catch(s){alert(s)}}),(s,g)=>(e(),t("div",_,[l(c).loading?(e(),t("div",d,u)):(e(),t("div",p,"Завершенный!"))]))}};export{y as default};