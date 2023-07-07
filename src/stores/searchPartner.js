import { ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import countries from "../storage/countries.json";
import { state } from "../socket";

export const useSearchPartner = defineStore("searchPartner", () => {
  const country = ref(Cookies.get("country") || "");
  const countryIndex = ref(Cookies.get("countryIndex" || 0));
  const gender = ref(Cookies.get("gender") || "male");
  var mygender, suechgender;
  const showCountrySearch = ref(false);
  const loading = ref(false);
  var counta = ref(['all']);//ref(JSON.parse(Cookies.get("countries").c) || []);
  
  
  if(localStorage.getItem("yourgender") !=null){
	mygender = ref(localStorage.getItem("yourgender"));
}else{
	mygender = ref(gender);
}
if(localStorage.getItem("suechgender") !=null){
	suechgender = ref(localStorage.getItem("suechgender"));
}else{
	suechgender = ref("female");
}

  const toggleCountrySearch = (v) => {
	  if(v){
	  document.body.style.overflow="hidden";
	  state.isShow =false;
  }else{document.body.style.overflow="initial";}
    showCountrySearch.value = v;
  
  };

  const setCountryIndex = (c) => {
    countryIndex.value = c;

    if (Cookies.get("countryIndex")) {
      Cookies.remove("countryIndex");
      Cookies.set("countryIndex", c);
    } else {
      Cookies.set("countryIndex", c);
    }
  };

  const setCountry = (c) => {
    getCountryIndexAndSet(c);
    country.value = c;
    if (Cookies.get("country")) {
      Cookies.remove("country");
      Cookies.set("country", c);
    } else {
      Cookies.set("country", c);
    }
  };
const setCountries = (v)=>{
	v.forEach(function(el, i){
	counta.value[i] = el;	
	});
	
	
	console.log('countries: ', v[0] );
	
	try{
		if(localStorage.getItem("countries")){
			localStorage.removeItem("countries");
			localStorage.setItem("countries", JSON.stringify({"countries": counta.value}));
		}else{
				localStorage.removeItem("countries");
			localStorage.setItem("countries", JSON.stringify({"countries": counta.value}))
		}
	}catch(e){
		alert(e);
	}
    
};

const setGender = (v)=>{
	mygender.value = v;
	try{
		if(localStorage.getItem("yourgender")){
			localStorage.removeItem("yourgender");
			localStorage.setItem("yourgender", mygender.value);
		}else{
			localStorage.setItem("yourgender", mygender.value);
		}
	}catch(e){
		alert(e);
	} 
}

const setSuechGender = (v)=>{
	suechgender.value = v;
	try{
		if(localStorage.getItem("suechgender")){
			localStorage.removeItem("suechgender");
			localStorage.setItem("suechgender", suechgender.value);
		}else{
			localStorage.setItem("suechgender", suechgender.value);
		}
	}catch(e){
		alert(e);
	}
}
  const getCountryIndexAndSet = (alpha) => {
    const foundIndex = countries.findIndex((i) => i.alpha1 === alpha);

    setCountryIndex(foundIndex);

    return foundIndex;
  };

  const findCountryByIndex = (index) => {
    const country = countries[index];

    return country;
  };

  const setLoading = async (v) => {
    loading.value = v;
  };

  const toggleGender = () => {
    if (Cookies.get("gender")) {
      if (Cookies.get("gender") === "male") {
        Cookies.remove("gender");
        gender.value = "female";
        Cookies.set("gender", "female");
      } else {
        Cookies.remove("gender");
        gender.value = "male";
        Cookies.set("gender", "male");
      }
    } else {
      gender.value = "male";
      Cookies.set("gender", "male");
    }
  };

  return {
	 setCountries,
	 counta,
    country,
    gender,
    setCountry,
    toggleCountrySearch,
    showCountrySearch,
    loading,
    setLoading,
    toggleGender,
    findCountryByIndex,
    setCountryIndex,
    getCountryIndexAndSet,
    countryIndex,
    mygender,
    suechgender,
    setGender,
    setSuechGender,
  };
});
