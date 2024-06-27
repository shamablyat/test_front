<template>
  <div>
    <v-overlay v-model="auth.authLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate size="64" color="success" />
    </v-overlay>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from "@/app/config/store/auth";
import AccountService from "@/services/others/account.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

const auth = useAuth();
const { setError } = useErrorToast();

const getAuthInfo = () => {
  auth.authLoading = true;
  AccountService.GetAuthInfo()
    .then((res) => {
      localStorage.setItem("user_info", JSON.stringify(res.data));
      auth.LogIn(res.data);
    })
    .catch((e) => {
      setError(e);
      localStorage.removeItem("user_info");
    })
    .finally(() => {
      auth.authLoading = false;
    });
};
getAuthInfo();
</script>
