document.addEventListener("DOMContentLoaded", async () => {
  var userId = document.querySelector(".user-item").getAttribute("data-id");
  console.log(userId);
  //GET COMMENT
  var cmts = document.querySelector(".cmts");
  let viewMore = document.getElementById("view-more");
  let limitItem = 2;

  var getAllCmt = async (isFirst) => {
    try {
      let res = await axios.get(`http://localhost:3000/api/cmt/${userId}`);
      if (res.status == 200) {
        let cmtsHTML = ``;
        if (res.data.comments.length > 2) viewMore.innerHTML = "SHOW MORE";
        if (limitItem >= res.data.comments.length && !isFirst) {
          viewMore.innerHTML = "SHOW LESS";
          limitItem = res.data.comments.length;
        }
        for (let i = 0; i < limitItem; i++) {
          cmtsHTML += `
                        <div class="cmt work">
                            <div>
                            <div class="user-cmt"> User: ${
                              res.data.comments[i].usercmt
                            }</div>
                            <div class="content-cmt-${
                              res.data.comments[i].id
                            }">${res.data.comments[i].cmt}</div>
                            ${
                              res.data.comments[i].idusercmt ==
                              res.data.userLogin
                                ? `
                            <form class="form-group form-${res.data.comments[i].id}">
                                <input type="text" value="${res.data.comments[i].cmt}">
                                <input type="submit" value="Edit"> 
                                
                            </form>`
                                : ``
                            }
                            </div>
                            ${
                              res.data.comments[i].idusercmt ==
                              res.data.userLogin
                                ? `
                            <div class="action-cmt">
                                <div class="delete-cmt btn" data-iddeletecmt=${res.data.comments[i].id}>Delete</div>
                                <div class="edit-cmt btn" data-ideditcmt=${res.data.comments[i].id}>Edit</div>
                            </div>
                            `
                                : ``
                            }
                        </div>
                    `;
        }
        cmts.innerHTML = cmtsHTML;
      }
    } catch (err) {
      console.log(err);
    }
  };

  viewMore.addEventListener("click", async () => {
    limitItem += 5;
    if (viewMore.innerHTML == "SHOW LESS") {
      limitItem = 2;
      viewMore.innerHTML = "SHOW MORE";
    }
    await getAllCmt();
  });

  //USER COMMENT
  document.getElementById("form-cmt").addEventListener("submit", async (e) => {
    e.preventDefault();
    let cmt = document.getElementById("input-cmt").value;
    if (cmt && cmt.trim() != "") {
      try {
        let res = await axios.post(`http://localhost:3000/api/cmt/${userId}`, {
          cmt: cmt,
        });
        if (res.status == 200) {
          console.log("cmt done");
          document.getElementById("input-cmt").value = "";
          await getAllCmt();
        } else throw new Error("cmt cant save");
      } catch (err) {
        console.log(err);
      }
    }
  });

  await getAllCmt(true);

  //DELETE CMT
  cmts.addEventListener("click", async (e) => {
    let idDelete = e.target.dataset.iddeletecmt;
    if (idDelete) {
      try {
        let res = await axios.delete(
          `http://localhost:3000/api/cmt/${idDelete}`
        );
        if (res.status == 200) {
          await getAllCmt();
          handleNotify(true, res.data.mess);
        }
      } catch (err) {
        handleNotify(false, "Something wrong");
      }
    }

    //get btn edit cmt AND UPDATE COMMENT
    let idEditCmt = e.target.dataset.ideditcmt;
    if (idEditCmt) {
      let formEdit = document.querySelector(`.form-group.form-${idEditCmt}`);
      let contentCmt = document.querySelector(`.content-cmt-${idEditCmt}`);
      if (e.target.innerHTML == "Edit") {
        e.target.innerHTML = "Delete";
        formEdit.style.display = "block";
        contentCmt.style.display = "none";
        formEdit.addEventListener("submit", async (e) => {
          e.preventDefault();
          let res = await axios.put(
            `http://localhost:3000/api/cmt/${idEditCmt}`,
            {
              cmt: e.target.childNodes[1].value,
            }
          );
          if (res.status == 200) {
            await getAllCmt();
            handleNotify(true, res.data.mess);
          } else {
            handleNotify(false, "Something wrong");
          }
        });
      } else {
        e.target.innerHTML = "Edit";
        formEdit.style.display = "none";
        contentCmt.style.display = "block";
      }
    }
  });

  const classUser = document.getElementById("all-class");
  classUser.innerHTML = `<div class="task-class">
                        <div>MY CLASSES</div>
                    <div class="icon"><i class="fas fa-angle-up"></i></div>
                            </div>`;
  const getClass = async () => {
    try {
      let res = await axios.get(
        `http://localhost:3000/api/userclass/${userId}`
      );
      console.log(res.data);
      if (!res.data.class.length && !res.data.role) {
        classUser.innerHTML = `<div class="work no-class">HAVE JOIN ANY CLASS</div>`;
      } else if (!res.data.class.length)
        classUser.innerHTML = `<div class="work no-class">THERE IS NO CLASS</div>`;
      else if (!res.data.role) {
        for (let i = 0; i < res.data.class.length; i++) {
          classUser.insertAdjacentHTML(
            "beforeend",
            `
                    <div class="class" data-id="${res.data.class[i].id_class}">
                    <div class="class-title">
                        <div class="info-class">
                            <div class="class-name">${res.data.class[i].name_class}</div>
                            <div class="class-info">Thông tin: ${res.data.class[i].info_class}</div>
                        </div>
                        <div class="class-action">
                            <div class="number-student">Học sinh: ${res.data.class[i].number_student}</div>
                        </div>
                    </div>
                    <div class="info-teacher">
                        <div class="avatar-teacher"><img src="${res.data.class[i].image_teacher}"/></div>
                        <div>
                        <div class="name-teacher">Giáo viên: ${res.data.class[i].name_teacher}</div>
                        <div class="email-teacher">Email: ${res.data.class[i].email_teacher}</div>
                        </div>
                    </div>
                    <div class="action-btn btn">
                        <a href="/class/${res.data.class[i].id_class}">VIEW CLASS</a>
                       
                    </div>
                </div>
                    `
          );
        }
      } else {
        for (let i = 0; i < res.data.class.length; i++) {
          classUser.insertAdjacentHTML(
            "beforeend",
            `
                <div class="class" data-id="${res.data.class[i].id}">
                <div class="class-title">
                    <div class="info-class">
                        <div class="class-name">${res.data.class[i].name}</div>
                        <div class="class-info">Info: ${
                          res.data.class[i].info
                        }</div>
                    </div>
                    <div class="class-action">
                        <div class="number-student">Student: ${
                          res.data.class[i].number_student
                        }</div>
                    </div>
                </div>
                <div class="teacher-action">
                    <a class="btn" href="/class/${
                      res.data.class[i].id
                    }">JOIN CLASS</a>
                    ${
                      res.data.userLogin
                        ? `
                        <div class="btn delete-class" data-iddelete="${res.data.class[i].id}">DELETE CLASS</div>
                    `
                        : ``
                    }
                </div>
                `
          );
        }
      }
      //================task-class=====================//
      const taskClass = document.getElementsByClassName("task-class");
      const allClass = document.getElementById("all-class");
      console.log(taskClass);
      for (let i = 0; i < taskClass.length; i++) {
        console.log(i);
        taskClass[i].addEventListener("click", () => {
          allClass.classList.toggle("task-class-active");
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  await getClass();

  classUser.addEventListener("click", async (e) => {
    let idDelete = e.target.dataset.iddelete;
    if (idDelete) {
      try {
        let res = await axios.delete(
          `http://localhost:3000/api/teacher/class/${idDelete}`
        );
        if (res.status == 200) {
          await getClass();
          handleNotify(true, "Delete class success");
        }
      } catch (err) {
        console.log(err);
        handleNotify(false, "Something wrong");
      }
    }
  });
});
