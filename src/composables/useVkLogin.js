import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "axios";


export const useVkLogin = () => {
  // important urls to access user's info
  const rootUrl = ` https://oauth.vk.com/authorize`;
  const getUserUrl = `https://api.vk.com/method/users.get`;

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
        fullUrl.value,
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
      );

      let timer = setInterval(() => {
        if (openedWindow.closed) {
          window.location.reload();
          clearInterval(timer);
        } else {
          return;
        }
      }, 700);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
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
    /*  const user = await axios.get(
        `${getUserUrl}?access_token=${result.value.access_token}&user_ids=${result.value.user_id}&v=5.131`,
        {
         headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      */ 
const user = await auth.post(`/vk-user`, { vkurl: `${getUserUrl}?access_token=${result.value.access_token}&user_ids=${result.value.user_id}&v=5.131`});
      const data = await user.data;

      console.log('ANY VK DATA ', data);
      // // making userinfo object
      const userInfo = reactive({
        username: data.first_name,
         email: data.first_name + "-" + data.last_name + "@vk.ru",
        firstname: data.first_name,
        lastname: data.last_name,
        gender: data.sex == 2 ? "male" : "female",
        vkontakteId: data.id,
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
		 // window.close();
	  }, 100);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
      alert(error);
       setTimeout(function(){
		//  window.close();
	  }, 3000);
    }
  };

  return {
    fullUrl,
    vkLogin,
    getUserData,
  };
};
