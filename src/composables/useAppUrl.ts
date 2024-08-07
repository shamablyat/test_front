import { ref } from "vue";

interface ITrustedHosts {
  host: string;
  sts_domain: string;
  EIMZO_URL: string;
}

const trustedHosts: ITrustedHosts[] = [
  {
    host: "https://eld.ihmatest.uz",
    sts_domain: "https://auth.ihmatest.uz",
    EIMZO_URL: "https://timzo.ihmatest.uz"
  },
  {
    host: "https://teld.ihmatest.uz",
    sts_domain: "https://tauth.ihmatest.uz",
    EIMZO_URL: "https://timzo.ihmatest.uz"
  },
  {
    host: "https://teld.ihma.uz",
    sts_domain: "https://tauth.ihma.uz",
    EIMZO_URL: "https://timzo.ihma.uz"
  },
  {
    host: "https://eld.ihma.uz",
    sts_domain: "https://auth.ihma.uz",
    EIMZO_URL: "https://imzo.ihma.uz"
  }
];

export const useAppUrl = () => {
  const STS_DOMAIN = ref<string>("https://tauth.ihmatest.uz");
  const API_URL = ref<string>("https://teld.ihmatest.uz/api");
  const DOMAIN = ref<string>("https://teld.ihmatest.uz");
  const EIMZO_URL = ref<string>("https://timzo.ihmatest.uz");

  trustedHosts.forEach((el) => {
    if (window.location.href.indexOf(el.host) > -1) {
      STS_DOMAIN.value = el.sts_domain;
      API_URL.value = `${el.host}/api`;
      DOMAIN.value = `${el.host}`;
      EIMZO_URL.value = el.EIMZO_URL;
    }
  });

  return {
    STS_DOMAIN,
    API_URL,
    DOMAIN,
    EIMZO_URL
  };
};
