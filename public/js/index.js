document.addEventListener("DOMContentLoaded", () => {
  var btnCreateClass = document.getElementById("btn-create-class");
  var taskPanel = document.querySelector(".task-panel-create-class");
  var notify = document.getElementById("notify");

  if (btnCreateClass) {
    btnCreateClass.addEventListener("click", () => {
      taskPanel.style.display = "block";
      taskPanel.style.transform = "translate(-50%,-50%)";
    });
  }

  if (document.querySelector(".close-panel")) {
    document.querySelector(".close-panel").addEventListener("click", () => {
      taskPanel.style.transform = "translate(-50%,150%)";
      taskPanel.style.display = "none";
    });
  }

  var formClass = document.getElementById("panel-class");
  formClass.addEventListener("submit", (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/teacher/addnewclass", {
        name: document.getElementById("class-name").value,
        info: document.getElementById("class-info").value,
      })
      .then((res) => {
        if (res.data.success) {
          taskPanel.style.transform = "translate(-50%,150%)";
          taskPanel.style.display = "none";
          getAllClass();
          notify.innerHTML = "Create class success";
          notify.style.top = "12px";
          setTimeout(() => {
            notify.style.top = "-50px";
          }, 3000);
        } else {
          document.querySelector(".error-create-class").innerHTML =
            res.data.error;
        }
      })
      .catch((err) => {
        notify.innerHTML = "Something wrong !";
        notify.style.top = "12px";
        setTimeout(() => {
          notify.style.top = "-50px";
        }, 3000);
      });
  });

  //GET ALL CLASS
  var allClass = document.querySelector(".all-class");
  var getAllClass = async () => {
    try {
      let res = await axios.get("http://localhost:3000/api/class/all");
      if (res.status == 200) {
        let classHTML = ``;
        for (let i = res.data.classes.length - 1; i >= 0; i--) {
          classHTML += `
                    <div class="class" data-id="${
                      res.data.classes[i].id_class
                    }">
                        <div class="class-title">
                            <div class="info-class">
                                <div class="class-name">${
                                  res.data.classes[i].name_class
                                }</div>
                                <div class="class-info">Info: ${
                                  res.data.classes[i].info_class
                                }</div>
                            </div>
                            <div class="class-action">
                                <div class="number-student">student in class: ${
                                  res.data.classes[i].numberstudent_class
                                }</div>
                            </div>
                        </div>
                        <div class="info-teacher">
                            <div class="avatar-teacher"><img src="${
                              res.data.classes[i].image_teacher
                            }"/></div>
                            <div>
                            <div class="name-teacher">Teacher name: ${
                              res.data.classes[i].name_teacher
                            }</div>
                            <div class="email-teacher">Teacher email: ${
                              res.data.classes[i].email_teacher
                            }</div>
                            </div>
                        </div>
                        <div>
                            <a class="btn" href="/class/${
                              res.data.classes[i].id_class
                            }">JOIN CLASS</a>
                            ${
                              res.data.role &&
                              res.data.userLogin ==
                                res.data.classes[i].id_teacher
                                ? `<div class="btn btn-delete-class" data-deleteclass="${res.data.classes[i].id_class}">DELETE CLASS</div>`
                                : ``
                            }
                        </div>
                    </div>
                `;
        }
        allClass.innerHTML = classHTML;
      }
    } catch (err) {
      console.log(err);
      notify.style.color = "red";
      notify.innerHTML = "Something wrong !";
      notify.style.top = "12px";
      setTimeout(() => {
        notify.style.top = "-50px";
      }, 3000);
    }
  };

  getAllClass();

  //DELETE CLASS
  allClass.addEventListener("click", async (e) => {
    let idClassDelete = e.target.dataset.deleteclass;
    console.log(idClassDelete);
    if (idClassDelete) {
      try {
        let res = await axios.delete(
          `http://localhost:3000/api/teacher/class/${idClassDelete}`
        );
        if (res.status == 200) {
          await getAllClass();
          notify.innerHTML = "Delete success";
          notify.style.top = "12px";
          setTimeout(() => {
            notify.style.top = "-50px";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        notify.style.backgroundColor = "red";
        notify.innerHTML = "Something wrong !";
        notify.style.top = "12px";
        setTimeout(() => {
          notify.style.top = "-50px";
        }, 3000);
      }
    }
  });
});
