import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "axios";


export const useVkLogin = () => {
  // important urls to access user's info
  const rootUrl = ` https://oauth.vk.com/authorize`;
  const getUserUrl = `https://api.vk.com/method/users.get`;
var articleIntroduce = document.getElementById("introduce");
if(articleIntroduce){
	articleIntroduce.style.display = "none";
}
  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  // basic configuration for request
  const options = {
    client_id: import.meta.env.VITE_VK_ID,
    redirect_uri: import.meta.env.DEV ? import.meta.env.VITE_VK_REDIRECT : import.meta.env.VITE_VK_REDIRECT_PROD,
    response_type: "token",
    scope: "email",
    display: "page",
  };
VK.init({apiId: options.client_id});
  // making full url
  const qs = new URLSearchParams(options);

  const fullUrl = computed(() => {
    return `${rootUrl}?${qs.toString()}`;
  });

  // after this func runs, new window opens and user selects his account
  const vkLogin = async () => {
    try {
      await searchPartner.setLoading(true);

      const openedWindow = window.open(
        '',
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
      );
		openedWindow.location.href = fullUrl.value;
      let timer = setInterval(() => {
        if (openedWindow.closed) {
          window.location.reload();
          clearInterval(timer);
        } else {
          return;
        }
      }, 1);
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
console.log(result.value)
      // send request to get userinfo
      var user;
    /*  var user = await axios.get(
        `${getUserUrl}?access_token=${result.value.access_token}&user_ids=${result.value.user_id}&v=5.131`,
        {
         headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      */
 //user = await auth.post(`/vk-user`, { vkurl: getUserUrl, access_token: result.value.access_token, user_ids:result.value.user_id, head:"bla"});
 function getUserData2(url, obj){
	 return new Promise(function(res, rej){
		 VK.Api.call(url, obj, function(r){
			 console.warn(r.response);
			 if(r.response){
				 res(r.response);
			 }else{
				 rej(r.response);
			 }
		 });
	 });
 };
 user = await getUserData2('users.get', { user_ids: result.value.user_id, v: "5.131", access_token: result.value.access_token });
      const data = user;

      console.log('ANY VK DATA ', data);
     // if(data.error){
		 // alert(data.error.error_msg);
		//  return;
	 // }
      // // making userinfo object
      const userInfo = reactive({
        username: data[0].first_name ? data[0].first_name : "Аноним",
         email: result.value.email ? result.value.email : data[0].first_name+'@vk.com',
        firstname: data[0].first_name ? data[0].first_name : "Аноним",
        lastname: data[0].last_name ? data[0].last_name : "Аноним",
        gender: data[0].sex == 2 ? "male" : "female",
        vkontakteId: data[0].id,
      });

      // // added to store/cookie
      await userStore.setUser(userInfo);

      const response = await auth.post(`/vk-oauth`, { ...userInfo });

      // // set token which is from server (not from google)
       await userStore.setToken(
        response.data.access_token,
        response.data.expires,
        "acc"
      );
       searchPartner.toggleGender()
      // // update user info again
       await userStore.updateUser("userId", response.data.userId);

      await searchPartner.setLoading(false);
    
     setTimeout(function(){
		  window.close();
	  }, 1);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
      alert(error);
       setTimeout(function(){
		 window.close();
	  }, 1);
    }
  };

  return {
    fullUrl,
    vkLogin,
    getUserData,
  };
};
