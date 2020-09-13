document.addEventListener("DOMContentLoaded", async () => {
  //lấy id class
  let idClass = window.location.pathname.split("/")[2];
  //XÓA CLASS
  if (document.getElementById("btn-delete-class"))
    document
      .getElementById("btn-delete-class")
      .addEventListener("click", async () => {
        try {
          let res = await axios.delete(
            `http://localhost:3000/api/teacher/class/${idClass}`
          );
          if (res.status == 200) {
            window.location.pathname = "/";
          }
        } catch (err) {
          console.log(err);
          handleNotify(false, "Something wrong !");
        }
      });

  //hide on panel tạo bài tập
  const panelCreateHW = document.getElementById("add-new-hw");
  const btnCreateHW = document.getElementById("btn-create-hw");
  if (btnCreateHW) {
    btnCreateHW.addEventListener("click", () => {
      panelCreateHW.style.display = "block";
    });
  }

  document.querySelector(".close-panel").addEventListener("click", () => {
    panelCreateHW.style.display = "none";
  });

  //Tạo Bài Tập Về nhà

  const formHW = document.getElementById("form-hw");
  formHW.addEventListener("submit", async (e) => {
    e.preventDefault();
    let fileHw = document.getElementById("file-hw");
    let formData = new FormData();
    formData.append("nameHw", document.getElementById("name-hw").value);
    formData.append("scoreHw", document.getElementById("score-hw").value);
    formData.append("homework", fileHw.files[0]);
    try {
      let res = await axios.post(
        `http://localhost:3000/api/teacher/addnewhw/${idClass}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        document.getElementById("name-hw").value = "";
        document.getElementById("score-hw").value = "";
        document.getElementById("file-hw").value = "";
        panelCreateHW.style.display = "none";
        await getHomework();
        handleNotify(true, res.data.mess);
      } else if (!res.data.success) {
        let errorHw = (document.getElementById("error-create-hw").innerHTML =
          res.data.error);
      }
    } catch (err) {
      handleNotify(false, "Something wrong !");
    }
  });

  //GET HOMEWOrK
  const taskHomework = document.getElementById("all-homework");
  var getHomework = async () => {
    try {
      let res = await axios.get(
        `http://localhost:3000/api/class/${idClass}/homework`
      );
      if (!res.data.homeworks.length) {
        taskHomework.innerHTML = `<div class="work homework">DONT' HAVE ANY HOME</div>`;
      } else {
        let homeworks = res.data.homeworks.map(async (item) => {
          if (res.data.role) {
            let hwStudent = await axios.get(
              `http://localhost:3000/api/teacher/homework/student/${item.id}`
            );
            var hwStudentHTML = hwStudent.data.map(
              (hw) => `
                        <div class="student-homework">
                            <div class="info-student">
                                <div class="name-student">${hw.name}</div>
                                <div class="email-student">${hw.email}</div>
                                <div class="phone-student">${hw.phone}</div>
                            </div>
                            <div>
                            <div class="time-student">${new Date(
                              hw.time
                            ).getDate()}/${
                new Date(hw.time).getMonth() + 1
              }/${new Date(hw.time).getYear()}</div>
                            <a class="btn" href="/users/${
                              hw.id_student
                            }">Xem thông tin</a> <br/>
                            <a class="link-hw" href="${
                              hw.file
                            }">DOWNLOAD FILE</a>
                            </div>
                            </div>
                        `
            );
          }
          return `
                    <div class="homework work" data-idclass="${item.id_class}">
                        <div class="content-hw">
                            <div>
                                <div class="name-homework">Homework name: ${
                                  item.name
                                }</div>
                                <div class="link-homework"><a href="${
                                  item.homework
                                }">Download homework</a></div>
                            </div>
                            <div class="action">
                            <div class="score-homework">Grade: ${
                              item.score
                            }</div>
                            <div>
                                <div  class="btn hw-edit" data-btnedit="${
                                  item.id
                                }">Edit</div>
                                <div class="btn hw-delete" data-deleteid="${
                                  item.id
                                }">Delete</div>
                            </div>
                        </div>                            
                        </div>

                        ${
                          res.data.role
                            ? `<div class="teacher-homework">
                            ${
                              res.data.userLogin
                                ? `
                            <div class="action-teacher">
                                
                                <form class="form-hw-edit" method="post" action="/api/teacher/homework/${
                                  item.id
                                }" data-editid="${item.id}" >
                                    <div class="title">EDIT HOMEWORK</div>
                                    <div class="form-group"><input type="text" class="name-hw-edit" name="name-hw"  /><label for="name-hw">Homework name</label></div>
                                    <div class="form-group"><input type="text" class="score-hw-edit"  /><label for="score-hw">Homework grade</label></div>
                                    <div class="form-group"><input class="file-hw-edit" type="file" name="homework" /></div>
                                    <div class="error ex-${
                                      item.id
                                    }" id="error-edit-hw"></div><input type="submit" value="EDIT" /></form>
                            </div>
                            <div class="homeworks-student" >
                                <div class="task-homework-student">
                                    <div>Student homework</div>
                                    <div class="icon"><i class="fas fa-angle-up"></i></div>
                                </div>
                                
                                    ${hwStudentHTML.join("")}
                              
                            </div>
                            `
                                : ``
                            }
                            
                        </div>`
                            : `<div class="student-homework">
                        <form method="post" action="/api/student/" class="student-hw-form" data-sendid="${
                          item.id
                        }">
                        <input class="student-hw" type="file"/>
                        <div class="error exsend-${
                          item.id
                        }" id="error-send-hw"></div>
                        <input type="submit" value="Upload homework" />
                        ${
                          res.data.hwDoneList.indexOf(item.id) == -1
                            ? `<div class="status">CHƯA NỘP</div>`
                            : `<div class="status">ĐÃ NỘP</div>`
                        }
                        </form>
                    </div>`
                        }    
                    </div>
                `;
        });
        taskHomework.innerHTML = await (await Promise.all(homeworks)).join("");

        //=============================ON OFF task Homework student==============================
        const homeworksStudent = document.getElementsByClassName(
          "homeworks-student"
        );
        const taskHomeworkStudent = document.getElementsByClassName(
          "task-homework-student"
        );
        for (let i = 0; i < taskHomeworkStudent.length; i++) {
          taskHomeworkStudent[i].addEventListener("click", (e) => {
            homeworksStudent[i].classList.toggle("task-homework-active");
          });
        }
      }

      //=========================ON OFF TEACHER ACTION EDIT================
      const actionTeachers = document.getElementsByClassName("action-teacher");
      const btnEdit = document.getElementsByClassName("hw-edit");
      for (let i = 0; i < btnEdit.length; i++) {
        btnEdit[i].addEventListener("click", () => {
          actionTeachers[i].classList.toggle("task-edit-active");
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  await getHomework();

  //DELETE HOMEWORK
  taskHomework.addEventListener("click", async (e) => {
    let id = e.target.dataset.deleteid;
    if (id) {
      let res = await axios.delete(
        `http://localhost:3000/api/teacher/homework/${id}`
      );
      if (res.status == 200) {
        await getHomework();
        handleNotify(true, res.data.mess);
      } else {
        handleNotify(false, res.data.mess);
      }
    }
  });

  //EDIT HOMEWORk
  taskHomework.addEventListener("submit", async (e) => {
    e.preventDefault();
    let editId = e.target.dataset.editid;
    if (editId) {
      // if(!e.target.elements[0].value &&!e.target.elements[1].value&& !e.target.elements[2].files[0] ) return;
      let formData = new FormData();
      formData.append("nameHw", e.target.elements[0].value);
      formData.append("scoreHw", e.target.elements[1].value);
      formData.append("homework", e.target.elements[2].files[0]);
      try {
        let res = await axios.put(
          `http://localhost:3000/api/teacher/homework/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.status == 200 && res.data.success) {
          await getHomework();
          handleNotify(true, res.data.mess);
        } else
          document.querySelector(`.error.ex-${editId}`).innerHTML =
            res.data.mess;
      } catch (err) {
        handleNotify(false, "Something wrong !");
      }
    }
    //=========================STUDENT SENDHOMEWORK======================
    let sendId = e.target.dataset.sendid;
    if (sendId) {
      try {
        let formData = new FormData();
        formData.append("homework", e.target.elements[0].files[0]);
        let res = await axios.post(
          `http://localhost:3000/api/student/homework/${idClass}/${sendId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.status == 200 && res.data.success) {
          handleNotify(true, res.data.mess);
        } else {
          document.querySelector(`.error.exsend-${sendId}`).innerHTML =
            res.data.mess;
        }
      } catch (err) {
        console.log(err);
        handleNotify(false, "Something wrong !");
      }
    }
  });
});
