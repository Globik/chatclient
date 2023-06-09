import { computed, reactive } from "vue";
import { auth } from "../http/index";
import { useSearchPartner } from "../stores/searchPartner";
import { useUserStore } from "../stores/user";
import axios from "axios";

export const useYandexLogin = () => {
	var articleIntroduce = document.getElementById("introduce");
if(articleIntroduce){
	articleIntroduce.style.display = "none";
}
  // important urls to access user's info
  const tokenUrl = `https://oauth.yandex.com/authorize?response_type=token&client_id=${
    import.meta.env.VITE_YANDEX_ID
  }`;
  const getUserUrl = `https://login.yandex.ru/info?format=json`;
 
  const searchPartner = useSearchPartner();
  const userStore = useUserStore();

  // after this func runs, new window opens and user selects his account
  const yandexLogin = async () => {
    try {
      await searchPartner.setLoading(true);

      const openedWindow = window.open(
        '',
        "targetWindow",
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=SomeSize,height=SomeSize`
      );
		openedWindow.location.href = tokenUrl;
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

      // parsing hashes to get access_token from url
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
      
      /* user = await axios.get(getUserUrl, {
        headers: {
          Authorization: `OAuth ${result.value.access_token}`,
        },
      });
*/
user = await auth.post(`/yandex-user`, { vkurl: getUserUrl, head: result.value.access_token, access_token:"token", user_ids:"uui8"});
      const data = await user.data;
console.log("data", data)
      // making userinfo object
      const userInfo = reactive({
        username: data.login,
        email: data.default_email,
        firstname: data.first_name ? data.first_name : data.login,
        lastname: data.last_name ? data.last_name : data.login,
        gender: data.sex ? data.sex : "male",
        yandexId: data.id,
      });

      // added to store/cookie
      await userStore.setUser(userInfo);

      const response = await auth.post(`/yandex-oauth`, { ...userInfo });
console.log('yandex-oauth', response.data)
      // set token which is from server (not from yandex)
      await userStore.setToken(
        response.data.access_token,
        response.data.expires,
        "acc"
      );
        searchPartner.toggleGender()
      // update user info again
      await userStore.updateUser("userId", response.data.userId);

      await searchPartner.setLoading(false);
    
   //  setTimeout(function(){
		 window.close();
	//  }, 1);
    } catch (error) {
      await searchPartner.setLoading(false);
      console.log(error);
    //  alert(error);
    //  setTimeout(function(){
		 window.close();
	//  }, 1);
    } finally {
      await searchPartner.setLoading(false);
     // setTimeout(function(){
		window.close();
	//  }, 1);
    }
  };

  return {
    yandexLogin,
    getUserData,
  };
};
