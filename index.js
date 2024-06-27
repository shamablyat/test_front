const fs = require("fs");
const axios = require("axios");
var oldTranslateRu = {
  passportParams: {
    documentType: "Тип документа",
    docSeries: "Серия документа",
    documentNumber: "Номер документа",
    pinfl: "ПИНФЛ",
    Search: "Поиск",
    birthOn: "Дата рождения"
  },
  passportData: {
    birthOn: "Дата рождения",
    nationalityName: "Национальность",
    fullName: "Полное имя",
    genderName: "Пол",
    pinfl: "ПИНФЛ",
    address: "Адрес",
    disabilityGroup: "Инвалидность",
    placeAndPositionWork: "Занятость",
    cadastralInformation: "Собственность на жильё",
    maritialStatus: "Семейное положение",
    womenNotebook: "Женская тетрадь",
    hasDebt: "Долг по налогу на имущества",
    ironNotebook: "Железная тетрадь",
    youthNotebook: "Молодежная тетрадь",
    hasDiploma: "Высшее образование",
    docIssueOn: "Дата выдачи",
    docExpireOn: "Срок действия",
    pensionType: "Тип пенсии",
    pensionAmount: "Сумма пенсии",
    has: "Имеется",
    married: "Женат / Замужем",
    yes: "Да",
    no: "Нет",
    isDeath: "Мёртв",
    isDivorce: "Разведен(а) / В браке",
    hasSalary: "Заработная плата",
    disabilityExtenal: "На учете психдиспансера",
    isAliment: "Удержание алиментов"
  }
};
var oldTranslateUz = {
  passportParams: {
    documentType: "Ҳужжат тури",
    docSeries: "Ҳужжат серияси",
    documentNumber: "Ҳужжат рақами",
    pinfl: "ЖШШИР",
    Search: "Қидирув",
    birthOn: "Туғилган санаси"
  },
  passportData: {
    birthOn: "Туғилган санаси",
    nationalityName: "Миллати",
    fullName: "Тўлиқ исми",
    genderName: "Жинси",
    pinfl: "ЖШШИР",
    address: "Манзил",
    disabilityGroup: "Ногиронлиги",
    placeAndPositionWork: "Бандлиги",
    cadastralInformation: "Уй - жойга эгалиги",
    ironNotebook: "Темир дафтари",
    youthNotebook: "Ёшлар дафтари",
    maritialStatus: "Оилавий ҳолати",
    womenNotebook: "Аёллар дафтари",
    hasDebt: "Мол мулк солиғидан қарзи",
    hasDiploma: "Олий маълумоти",
    docIssueOn: "Берилган вақти",
    docExpireOn: "Амал қилиш муддати",
    pensionType: "Пенсия тури",
    pensionAmount: "Пенсия суммаси",
    married: "Турмуш қурган",
    has: "Бор",
    yes: "Ха",
    no: "Йўқ",
    isDeath: "Вафот этган",
    isDivorce: "Ажрашган / Оилали",
    hasSalary: "Ойлик маош",
    disabilityExtenal: "Психдиспансер рўйхатида",
    isAliment: "Алимент ушланмаси"
  }
};
var oldTranslateOz = {
  passportParams: {
    documentType: "Hujjat turi",
    docSeries: "Hujjat seriyasi",
    documentNumber: "Hujjat raqami",
    pinfl: "JSHSHIR",
    Search: "Qidiruv",
    birthOn: "Tug‘ilgan sanasi"
  },
  passportData: {
    birthOn: "Tug‘ilgan sanasi",
    nationalityName: "Millati",
    genderName: "Jinsi",
    fullName: "To‘liq ismi",
    pinfl: "JSHSHIR",
    address: "Manzil",
    disabilityGroup: "Nogironligi",
    placeAndPositionWork: "Bandligi",
    cadastralInformation: "Uy - joyga egaligi",
    maritialStatus: "Oilaviy holati",
    womenNotebook: "Ayollar daftari",
    ironNotebook: "Temir daftari",
    youthNotebook: "Yoshlar daftari",
    hasDebt: "Mol mulk solig'idan qarzi",
    hasDiploma: "Oliy ma'lumoti",
    docIssueOn: "Berilgan vaqti",
    docExpireOn: "Amal qilish muddati",
    pensionType: "Pensiya turi",
    pensionAmount: "Pensiya summasi",
    married: "Turmush qurgan",
    has: "Bor",
    yes: "Ha",
    no: "Yo'q",
    isDeath: "Vafot etgan",
    isDivorce: "Ajrashgan / Oilali",
    hasSalary: "Oylik maosh",
    disabilityExtenal: "Psixdispanser ro'yxatida",
    isAliment: "Aliment ushlanmasi"
  }
};
var oldTranslateQr = {};
function myFunc() {
  try {
    axios
      .get(`https://opensheet.elk.sh/1Y4zYRa9nAiGC0GvYvPuRo1PWgpc0YB4wG8GgRhgOvRw/eld`)

      .then((res) => {
        var data = {
          ru: {},
          uz: {},
          oz: {},
          qr: {}
        };
        res.data.forEach(function (item) {
          if (item.key) {
            data.ru[item.key] = item.ru;
            data.oz[item.key] = item.oz;
            data.uz[item.key] = item.uz;
            data.qr[item.key] = item.qr;
          }
        });

        data.ru = { ...oldTranslateRu, ...data.ru };
        data.oz = { ...oldTranslateOz, ...data.oz };
        data.uz = { ...oldTranslateUz, ...data.uz };
        data.qr = { ...oldTranslateQr, ...data.qr };
        const jsonDataRu = JSON.stringify(data.ru, null, 2);
        const jsonDataOz = JSON.stringify(data.oz, null, 2);
        const jsonDataUz = JSON.stringify(data.uz, null, 2);
        const jsonDataQr = JSON.stringify(data.qr, null, 2);
        fs.writeFile("./src/app/config/i18n/locales/ru.json", jsonDataRu, (err) => {});
        fs.writeFile("./src/app/config/i18n/locales/uz-cyrl.json", jsonDataUz, (err) => {});
        fs.writeFile("./src/app/config/i18n/locales/uz-latn.json", jsonDataOz, (err) => {});
        fs.writeFile("./src/app/config/i18n/locales/qr.json", jsonDataQr, (err) => {});
        resolve("success");
      })
      .catch((e) => {})
      .finally(() => {});
  } catch (e) {
    new Error(`unexpected error: ${e}`);
  }
}
myFunc();
