<script setup lang="ts">
import { useAuth } from "@/app/config/store/auth";
import UiParentCard from "@/components/UiParentCard.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CircleDotIcon, UserIcon } from "vue-tabler-icons";

interface ITabs {
  title: string;
  visible: string;
  icon: any;
  component: any;
}

const tabs: ITabs[] = [
  {
    title: "newApplications",
    visible: "ElderlyVerificationCreate",
    icon: UserIcon,
    component: () => import("./SocialEmployee/CanCreateVrf.vue")
  },
  {
    title: "ElderlyVerification",
    visible: "ElderlyVerificationView",
    icon: CircleDotIcon,
    component: () => import("./verification/index.vue")
  }
];

type Tab = "newApplications" | "ElderlyVerification";
const { can } = useAuth();

const router = useRouter();
const route = useRoute();
const active = ref<Tab>(route.name == "Verification" ? "ElderlyVerification" : "newApplications");

const setTab = (value: any) => {
  if (value.includes("newApplications")) {
    router.replace({
      name: "CreateVerification"
    });
  } else if (value.includes("ElderlyVerification")) {
    router.replace({
      name: "Verification"
    });
  }
};
</script>

<template>
  <div>
    <UiParentCard variant="outlined" class="border-none" elevation="0" v-if="!route.params.id">
      <v-tabs v-model="active" align-tabs="center" class="" @update:model-value="setTab">
        <template v-for="tab in tabs">
          <v-tab v-if="can(tab.visible)" :value="tab.title" color="success" :prepend-icon="tab.icon">
            {{ $t(tab.title) }}
          </v-tab>
        </template>
      </v-tabs>
    </UiParentCard>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>
