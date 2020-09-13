document.addEventListener("DOMContentLoaded", () => {
  let mess = document.getElementById("mess");
  if (mess.innerHTML) {
    handleNotify(true, "Update success");
  }
});
