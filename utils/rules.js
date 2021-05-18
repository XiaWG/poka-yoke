// 正整数
const positiveInteger = {
  pattern: /^[1-9]\d*$/,
};

// 负整数
const negativeInteger = {
  pattern: /^-[1-9]\d*$/,
};

// 正整数、0
const positiveIntegerAndZero = {
  pattern: /^[1-9]\d*$|^0$/,
};

// 负整数、0
const negativeIntegerAndZero = {
  pattern: /^-[1-9]\d*|0$/,
};

// 英文字母
const englishChar = {
  pattern: /^[A-Za-z]+$/,
};
// 英文字母 空格
const englishCharAndSpace = {
  pattern: /^[A-Za-z ]+$/,
};
// 大写英文字符
const uppercase = {
  pattern: /^[A-Z]+$/,
};

// 小写英文字符
const lowercase = {
  pattern: /^[a-z]+$/,
};

// 汉字
const chineseChar = {
  pattern: /^[\u4e00-\u9fa5]{0,}$/,
};

// 数字，字母
const numberAndChar = {
  pattern: /^[A-Za-z0-9]+$/,
};
// 数字，字母，空格
const numberAndCharAndSpace = {
  pattern: /^[A-Za-z0-9 ]+$/,
};
// 数字，字母，空格,特殊字符
const numberAndCharAndSpecialEn = {
  pattern: /^[A-Za-z0-9`~!@#$%^&*()_+-<>?:"{},.\\/;'[\] ]+$/,
};
// 数字，字母，下划线
const numberAndCharAndUnderLine = {
  pattern: /^\w+$/,
};

// 手机号码
const mobileNumber = {
  pattern: /^1\d{10}$/,
};

// 电话号码（座机）
const telNumber = {
  pattern: /\d{3}-\d{8}|\d{4}-\{7,8}/,
};

// 18位身份证号
const cardId2 = {
  pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
};
// 原验证置空
const cardId = {
  pattern: /\S/,
};
// qq号
const qq = {
  pattern: /^[1-9][0-9]{4,}$/,
};

// 英文特殊字符
const specialEn = {
  pattern: /^[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]$/,
};

// 中文特殊字符
const specialCn = {
  pattern: /^[·！#￥（——）：；“”‘、，|《。》？、【】[\]]$/,
};
// 网址
const address = {
  pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~])+$/,
};
// 数字
const number = {
  pattern: /^[0-9].*$/,
};
// 密码(必须包含大写，小写，数字)
const password = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/,
};
// 金额(正数，可以有小数点，小数点后最多3位)
const money = {
  pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4}|[1-9][0-9]*\.\d{1,4}|[1-9][0-9]*\.\d{1,4}|[1-9][0-9]*\.)))$/,
};
// 金额(正数，可以有小数点，小数点后最多3位)
const percent = {
  pattern: /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,3})?$|^100$/,
};

const mobileNumberNew = {
  pattern: /^[0-9][0-9][0-9]\d{4,11}$/,
};
const bankId = {
  pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
};
const phoneNew = {
  pattern: /^[0-9-]+$/,
};

export default {
  positiveInteger,
  negativeInteger,
  positiveIntegerAndZero,
  negativeIntegerAndZero,
  englishChar,
  uppercase,
  lowercase,
  chineseChar,
  numberAndChar,
  numberAndCharAndSpace,
  numberAndCharAndUnderLine,
  mobileNumber,
  telNumber,
  number,
  cardId,
  cardId2,
  qq,
  specialEn,
  specialCn,
  address,
  password,
  money,
  percent,
  englishCharAndSpace,
  numberAndCharAndSpecialEn,
  mobileNumberNew,
  phoneNew,
  bankId,
};
