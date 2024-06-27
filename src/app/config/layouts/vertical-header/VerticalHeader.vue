<script setup lang="ts">
import { ref, watch } from "vue";
import { Menu2Icon,MoonIcon,SunIcon } from "vue-tabler-icons";
import LanguageDD from "./LanguageDD.vue";
import ProfileDD from "./ProfileDD.vue";
import { useAuth } from "../../store/auth";
import { useCustomizerStore } from "../store/customizer";
import { useTheme } from "vuetify";
import AppsDD from "./AppsDD.vue";
const theme = useTheme();

const customer = useCustomizerStore();
const priority = ref(customer.setHorizontalLayout ? 0 : 0);
const auth = useAuth();
const valueIn = ref(false);

watch(priority, (newPriority) => {
  priority.value = newPriority;
});
watch(
  () => valueIn.value,
  () => {
    theme.global.name.value = theme.global.current.value.dark ? "ORANGE_THEME" : "DARK_RED_THEME";
  }
);
</script>

<template>
  <v-app-bar elevation="0" :priority="priority" color="background" id="top" class="vertical-header pt-5 pb-2 mb-3">
    <v-card class="px-5 py-5" rounded="10" elevation="0">
      <v-row align="center">
        <v-card-title>
          <v-row>
            <v-btn class="hidden-lg-and-up" icon variant="text" @click.stop="customer.SET_SIDEBAR_DRAWER" size="small">
              <Menu2Icon size="25" />
            </v-btn>
            <div class="title-organization">
              <h4 class="font-weight-bold text-grey200">
                {{ $t("title") }}
              </h4>
              <h5 class="text-grey200 font-weight-medium">
                {{ $t("username") }}:
                {{ auth.user_info ? auth.user_info.fullName : "-" }}
              </h5>
            </div>
          </v-row>
        </v-card-title>

        <v-spacer />
        <label>
          <input type="checkbox" v-model="valueIn" />
          <MoonIcon class="moon" />
          <SunIcon class="sun" />
          <span class="toggle"></span>
          <span class="change-bg"></span>
        </label>
        <LanguageDD />
        <AppsDD />
        <div class="ml-2">
          <ProfileDD />
        </div>
      </v-row>
    </v-card>
  </v-app-bar>
</template>
<style scoped lang="scss">
h5,
h5 {
  white-space: pre-wrap;
}
.v-card-title {
  white-space: pre-wrap !important;
  .title-organization {
    @media screen and (max-width: 600px) {
      display: none;
    }
  }
}

label {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.2s linear;

  input {
    opacity: 0;
    position: absolute;
    z-index: -2;
  }

  .sun {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
    transform: scale(0);
    transition: 1s ease;
  }

  input:checked ~ .sun {
    transition-delay: 0.3s;
    transform: scale(1) rotate(360deg);
  }

  .moon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
    transition: 1s ease;
    transition-delay: 0.3s;
  }

  input:checked ~ .moon {
    transition-delay: 0s;
    transform: rotate(360deg) scale(0);
  }

  .toggle {
    position: absolute;
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    box-shadow: inset 0px 0px 9px rgba(0, 0, 0, 0.5);
    z-index: -1;
    transition: 1s;
  }

  input:checked ~ .toggle {
    box-shadow: inset 0px 0px 9px rgba(0, 0, 0, 0.5);
    background: #f8f8f8;
  }

  .change-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    background: #f8f8f8;
    left: 0;
    z-index: -2;
    clip-path: circle(0% at 100% 100%);
    transition: 1s ease-out;
  }

  input:checked ~ .change-bg {
    background: #171c23;
    clip-path: circle(150% at 50% 50%);
  }
}
</style>
