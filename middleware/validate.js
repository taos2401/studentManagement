module.exports = {
  validateListString: (...list) => {
    const newList = list.map((item) => {
      return item || item.trim();
    });
    return newList.length === list.length ? true : false;
  },
  validateString: (string) => {
    return string.trim() != "";
  },
  validateNumber: (...list) => {
    const newList = list.map((item) => {
      return item > 0 && Number(item) === item;
    });
    return newList.length === list.length ? true : false;
  },
  validateEmail: (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePass: (pass) => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(String(pass));
  },
  filterXSS: (str) => {
    let value = str;
    var lt = /</g,
      gt = />/g,
      ap = /'/g,
      ic = /"/g;
    value = value
      .toString()
      .replace(lt, "")
      .replace(gt, "")
      .replace(ap, "")
      .replace(ic, "");
    return value;
  },
};
