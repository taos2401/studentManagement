const notify = document.getElementById("notify");

const handleNotify = (success, mess) => {
  if (success) {
    notify.innerHTML = mess;
    notify.style.top = "12px";
    setTimeout(() => {
      notify.style.top = "-50px";
    }, 3000);
  } else {
    notify.style.color = "red";
    notify.innerHTML = mess;
    notify.style.top = "12px";
    setTimeout(() => {
      notify.style.top = "-50px";
    }, 3000);
  }
};
