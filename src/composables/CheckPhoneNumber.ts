import i18n from "@/app/config/i18n";
export const useCheckPhoneNumber = () => {
  let regex = /[(),-]/g;
  const set = (value: string) => {
    return value.toString().split(" ").join("").replace(regex, "");
  };
  const phoneNumberRules = [
    (value: any) => {
      if (value) {
        const newValue = String(value).split("+998");
        const phone = set(newValue[1]);
        if (phone.length !== 9) {
          // @ts-ignore
          return i18n.global.t("invalidFormatPhoneNumber");
        }
        return true;
      }

      return i18n.global.t("fieldNotEmpty");
    }
  ];

  return {
    phoneNumberRules,
    set
  };
};
