function eachRow(context, n, options) {
  let subContext = [];
  let out = "";
  if (context && context.length > 0) {
    for (let i = 0; i < context.length; ++i) {
      if (i > 0 && i % n == 0) {
        out += options.fn(subContext);
        subContext = [];
      }
      subContext.push(context[i]);
    }
    out += options.fn(subContext);
  }
  return out;
}

function select(value, options) {
  return options.fn(this).replace(new RegExp(`value="${value}"`), "$& selected");
}

function selectBirthDay(birthday, type, options) {
  if (birthday === null)
    return options.fn(this);
  let [birthDay, birthMonth, birthYear] = birthday.split('/');
  if (type === "day")
    return options.fn(this).replace(new RegExp(`value="${birthDay}"`), "$& selected");
  else if (type === "month") {
    if (birthMonth.startsWith('0'))
      birthMonth = birthMonth.slice(1);
    return options.fn(this).replace(new RegExp(`value="${birthMonth}"`), "$& selected");
  }
  else
    return options.fn(this).replace(new RegExp(`value="${birthYear}"`), "$& selected");
}

function servantsByClass(servantsByClass, options) {
  let out = "";
  for (const servants of servantsByClass) {
    out += options.fn(servants);
  }
  return out;
}

function generateClassTab(servantsByClass, options) {
  let out = "";
  for (const servants of servantsByClass) {
    servants.avatarURL = `/img/class avatar/${servants["class"]}.webp`;
    if (servants["class"] === "Moon Cancer")
      servants.avatarURL = "/img/class avatar/MoonCancer.webp";
    else if (servants["class"] === "Alter Ego")
      servants.avatarURL = "/img/class avatar/Alterego.webp";
    out += options.fn(servants);
  }
  return out;
}

module.exports = { eachRow, select, selectBirthDay, servantsByClass, generateClassTab };