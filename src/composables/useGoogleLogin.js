import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "axios";

export const useGoogleLogin = () => {
  // important urls to access user's info
  var articleIntroduce = document.getElementById("introduce");
if(articleIntroduce){
	articleIntroduce.style.display = "none";
}
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const getUserUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=`;

  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  // basic configuration for request 4444
  const options = {
    client_id: import.meta.env.VITE_GOOGLE_APP,
    redirect_uri: "https://chat-roulet.ru/google",//import.meta.env.DEV ? import.meta.env.VITE_GOOGLE_REDIRECT : import.meta.env.VITE_GOOGLE_REDIRECT_PROD,
    response_type: "token",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.gender.read openid",

    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // making full url
  const qs = new URLSearchParams(options);

  const fullUrl = computed(() => {
    return `${rootUrl}?${qs.toString()}`;
  });

  // after this func runs, new window opens and user selects his account
  const googleLogin = async () => {
    try {
      await searchPartner.setLoading(true);
// if(navigator.platform.indexOf('Mac') > -1 && navigator.userAgent.indexOf('Safari')>-1 && navigator.userAgent.indexOf('Chrome') < 0
      const openedWindow = window.open(
        '',
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=SomeSize`
      );
  openedWindow.location.href = fullUrl.value;
      let timer = setInterval(() => {
        if (openedWindow.closed) {
          window.location.reload();
          clearInterval(timer);
        } else {
          return;
        }
      }, 0.1);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
      alert(error);
    }
  };

  // in the opened window, this func runs.
  const getUserData = async () => {
    try {
      await searchPartner.setLoading(true);

      // parsing hash to get access_token from url
      const hash = window.location.hash.substring(1);
      const result = computed(() => {
        return hash.split("&").reduce(function (result, item) {
          const parts = item.split("=");
          result[parts[0]] = parts[1];
          return result;
        }, {});
      });

      // send request to get userinfo
      var user;
      try{
      user = await axios.get(`${getUserUrl}${result.value.access_token}`);
}catch(e){
	alert("error 1"+e);
}
      const data = await user.data;

      // make username by cutting email (dasturchioka@gmail.com => dasturchioka)
      const username = computed(() => {
        return data.email.substring(0, data.email.lastIndexOf("@"));
      });

      // making userinfo object
      const userInfo = reactive({
        username: username.value,
        email: data.email,
        firstname: data.given_name ? data.given_name : username.value,
        lastname: data.family_name ? data.family_name : username.value,
        gender: data.gender ? data.gender : "male",
        googleId: data.sub,
      });

      // added to store/cookie
      await userStore.setUser(userInfo);
      var respid;
try{
      respid = await auth.post(`/google-oauth`, { ...userInfo });
}catch(e){
	alert("error 2 "+e);
	console.error(e);
} 
if(!respid) return;
      // set token which is from server (not from google) index-a4ce7641.js index-a4ce7641.js 
      console.log(respid.data.access_token);
      await userStore.setToken(
        respid.data.access_token,
        respid.data.expires,
        "acc"
      );

      searchPartner.toggleGender()

      // update user info again
      await userStore.updateUser("userId", respid.data.userId);

      await searchPartner.setLoading(false);
   //  setTimeout(function(){
		  window.close();
	// }, 1000);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error); 
      alert(error);
       setTimeout(function(){
		//  window.close();
	  }, 1000);
    } 
  };

  return {
    fullUrl,
    googleLogin,
    getUserData,
  };
};
