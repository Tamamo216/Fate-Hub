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
function generatePageLink(currentPage, totalPage, options) {
  let out = "";
  const pagePerGroup = 4;
  if (totalPage - currentPage < pagePerGroup) {
    for (let i = (totalPage < pagePerGroup) ? 1 : totalPage-pagePerGroup+1; i < totalPage+1; ++i) {
      let renderedHTML = options.fn({currentPage: i});
    if (i === currentPage)
      renderedHTML = renderedHTML.replace("page-link", "page-link active");
    out += renderedHTML;
    }
  }
  else {
    for (let i = currentPage; i < currentPage+4 && i < totalPage+1; ++i) {
      let renderedHTML = options.fn({currentPage: i});
      if (i === currentPage)
        renderedHTML = renderedHTML.replace("page-link", "page-link active");
      out += renderedHTML;
    }
  }
  return out;
}
module.exports = { 
  eachRow, 
  select, 
  selectBirthDay, 
  servantsByClass, 
  generateClassTab,
  generatePageLink
};