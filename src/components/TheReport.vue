<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import html2canvas from "html2canvas";

const reportVisible = ref(false);
const image = ref();

const emits = defineEmits(["closeReport"]);

const target = REMOTE;//document.body;

const capture = () => {
  html2canvas(target).then((canvas) => {
    image.value.src = canvas.toDataURL("image/jpeg");
  });
};

capture();

const toggleReport = () => {
  reportVisible.value = false;
  emits("closeReport", false);
};
</script>
<template>

    <div
      @click.self="toggleReport"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen bg-black register-comp bg-opacity-70"
    >
      <form
        class="register-form bg-white rounded relative border p-4 w-[400px]"
        lass="register-form bg-white rounded relative border p-4 w-full h-[99vh]"
      >
        <div class="flex justify-end x-mark">
          <XMarkIcon
            @click="toggleReport"
            class="w-5 h-5 cursor-pointer"
          ></XMarkIcon>
        </div>
        <h1 class="mb-5 text-2xl font-bold text-center form-title">Жалоба</h1>

        <div class="space-y-4 form-info">
          <div class="flex items-center space-x-4 form-reason">
            <label for="reason" class="font-semibold text-md">Причина:</label>
            <select
              class="px-2 py-1 border-2 border-gray-300 rounded-md"
              name="reason"
              id="reason"
            >
              <option value="0">Оскорбление</option>
              <option value="1">Пропаганда</option>
              <option value="2">Обнажённое тело</option>
              <option value="3">Другое</option>
            </select>
          </div>
          <div class="flex space-x-4 form-screenshot">
            <p class="font-semibold text-md">Скриншот:</p>
            <div class="screenshot">
              <img ref="image" alt="screenshot" />
            </div>
          </div>
          <div class="flex space-x-4 form-description">
            <label for="form-description" class="font-semibold text-md"
              >Описание:</label
            >
            <textarea
              class="p-1 border rounded-sm outline-none form-description"
              name="form-description"
              id="form-description"
              cols="30"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-center w-full mt-4 form-send">
          <button class="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg">
            Пожаловаться
          </button>
        </div>
      </form>
    </div>

</template>

<style scoped>


/* planshet 451x641      */
	
	@media screen and (max-width: 452px) and (orientation: portrait){
	.register-form{
	overflow:auto;
	
	width:99vw;
	font-size:4vw;
}
.screenshot{
	
	width:50%;
	height:50%;
	overflow:auto;
}
.screenshot img{
	width:100%;
	height:100%;
	overflow:auto;
}
.form-reason{
	dsplay:block;

}
	}
	
	@media screen and (max-height: 642px) and (orientation: landscape){
		.register-form{
	overflow:auto;
	
	width:99vw;
	font-size:2.5vw;
}
.screenshot{

	width:50%;
	height:50%;
	overflow:auto;
}
.screenshot img{
	width:100%;
	height:100%;
	overflow:auto;
}
		
	}









@media screen and (max-height: 286px) and (orientation: landscape){
.register-form{
	overflow:auto;
	
	width:99vw;
	font-size:2.5vw;
}
.screenshot{

	width:50%;
	height:50%;
	overflow:auto;
}
.screenshot img{
	width:100%;
	height:100%;
	overflow:auto;
}

}
@media screen and (max-width: 384px) and (orientation: portrait){
.register-form{
	overflow:auto;
	
	width:99vw;
	font-size:4vw;
}
.screenshot{
	
	width:50%;
	height:50%;
	overflow:auto;
}
.screenshot img{
	width:100%;
	height:100%;
	overflow:auto;
}
.form-reason{
	dsplay:block;
	
}
}
</style>
