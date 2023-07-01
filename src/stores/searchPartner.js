import { ref } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import countries from "../storage/countries.json";

export const useSearchPartner = defineStore("searchPartner", () => {
  const country = ref(Cookies.get("country") || "");
  const countryIndex = ref(Cookies.get("countryIndex" || 0));
  const gender = ref(Cookies.get("gender") || "male");
  const showCountrySearch = ref(false);
  const loading = ref(false);
  var counta = ref(['all']);//ref(JSON.parse(Cookies.get("countries").c) || []);

  const toggleCountrySearch = (v) => {
	  if(v){
	  document.body.style.overflow="hidden";
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
	if (Cookies.get("countries")) {
      Cookies.remove("countries");
      Cookies.set("countries", JSON.stringify({c: v}));
    } else {
      Cookies.set("countries", JSON.stringify({c: v}));
    }
    
};
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
  };
});
