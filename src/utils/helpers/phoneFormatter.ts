export const usePhoneFormatter = () => {
  let regex = /[(),-]/g;
  const set = (value: string) => {
    return value.toString().split(" ").join("").replace(regex, "");
  };

  const get = (value: string) => {
    let countryCode = String(value).slice(0, 3);
    let phone = String(value).slice(3);
    countryCode = "998" + phone;
    value = countryCode;
    return value;
  };
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return;
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length === 12) {
      const countryCode = cleanNumber.substring(0, 3);
      const areaCode = cleanNumber.substring(3, 5);
      const firstPart = cleanNumber.substring(5, 8);
      const secondPart = cleanNumber.substring(8, 10);
      const thirdPart = cleanNumber.substring(10, 12);
      return `+${countryCode} ${areaCode} ${firstPart} ${secondPart} ${thirdPart}`;
    } else return phoneNumber;
  };

  return {
    set,
    get,
    formatPhoneNumber
  };
};
