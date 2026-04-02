/* eslint-disable array-element-newline */
/* eslint-disable array-bracket-newline */

// Вика, Надя, Наташа, Полина, Света, Антон, Рома, Денис, Артем
export const WHITELIST_VK = [
  61227517, 28893542, 62505402, 2699132, 186208341, 141634144, 865257190, 1033596907, 131636396,
];

// Вика, Надя, Наташа, Полина, Света, Антон, Рома (2 аккаунта), Денис, Артем
export const WHITELIST_OK = [
  590508846116, 579865282412, 576287748560, 591841515179, 606883982867, 583060032294, 587194614617,
  909989894967, 910106440900, 585070819282,
];

export const userInWhitelist = (userId: number) => {
  return WHITELIST_VK.includes(userId) || WHITELIST_OK.includes(userId);
};
