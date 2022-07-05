/**
 * @Description: 数字处理函数
 */

// 千分符格式化(不自动补位)
function formatter(val, tail = 2) {
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  const num = String(val);
  if (/\.{1}/g.test(num)) {
    const arr = num.split('.');
    return `${arr[0].replace(reg, ',')}.${arr[1].substring(0, tail)}`;
  }
  return num.replace(reg, ',');
}

// 千分符格式化(自动补位)
function formatTail(val, tail = 2) {
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  const num = String(val);
  const suffix = Array(tail).fill(0).join('');
  if (/\.{1}/g.test(num)) {
    const arr = num.split('.');
    return `${arr[0].replace(reg, ',')}.${`${arr[1]}${suffix}`.substring(
      0,
      tail,
    )}`;
  }
  const dot = suffix ? '.' : '';
  return `${num.replace(reg, ',')}${dot}${suffix}`;
}
// 金额数字大写函数
function digitUppercase(price) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(price);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      '',
    );
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

// 去除,
function parser(val, tail = 2) {
  const index = val.lastIndexOf('.') + 1;
  const reg = /\$\s?|(,*)/g;
  if (index !== 0) {
    return val.substring(0, index + tail).replace(reg, '');
  }
  return val.replace(reg, '');
}

// 验证电话号码
function telNoFormat(val) {
  const reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
  const num = String(val);
  return num.replace(reg, '');
}

// 计算精度 乘
const accMul = (arg1, arg2) => {
  if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) return;
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    // continue regardless of error
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    // continue regardless of error
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
};

// 计算精度 除
const accDiv = (arg1, arg2) => {
  if ((!arg1 && arg1 !== 0) || (!arg2 && arg2 !== 0)) return;
  let t1 = 0;
  let t2 = 0;
  let r1 = 0;
  let r2 = 0;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    // continue regardless of error
  }
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    // continue regardless of error
  }
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * 10 ** (t2 - t1);
};

const accAdd = (arg1, arg2) => {
  let newArg1 = arg1;
  let newArg2 = arg2;
  let r1 = 0;
  let r2 = 0;
  let m = 0;
  let c = 0;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = 10 ** Math.max(r1, r2);
  if (c > 0) {
    const cm = 10 ** c;
    if (r1 > r2) {
      newArg1 = Number(arg1.toString().replace('.', ''));
      newArg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      newArg1 = Number(arg1.toString().replace('.', '')) * cm;
      newArg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    newArg1 = Number(arg1.toString().replace('.', ''));
    newArg2 = Number(arg2.toString().replace('.', ''));
  }
  return (newArg1 + newArg2) / m;
};

export {
  formatter,
  parser,
  formatTail,
  digitUppercase,
  telNoFormat,
  accMul,
  accAdd,
  accDiv,
};
