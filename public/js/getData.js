var usersHTML = document.getElementById("users");
var studentRole = document.getElementById("student");
var teacherRole = document.getElementById("teacher");
console.log("hihi");
//get Student
async function getUsers(roleFind) {
  let results = await axios.get("http://localhost:3000/api/" + roleFind);
  let role = results.data.role;
  let users = results.data.users;
  console.log(users);
  let returnHTMl = "";
  if (role) {
    for (let i = 0; i < users.length; i++) {
      returnHTMl += `
                <div class="user">
                    <div class="info">
                        <h3 class="name">${users[i].name} </h3>
                        <div class="role">${users[i].role}</div>
                    </div>
                    <div>
                        <div class="button"><a href="/users/updateprofile/${users[i].id}">Edit</a></div>
                        <div class="btn"><a href="/users/${users[i].id}">View</a></div>
                    </div>
                </div>
            `;
    }
  } else {
    for (let i = 0; i < users.length; i++) {
      returnHTMl += `
                <div class="user">
                    <div class="info">
                        <h3 class="name">${users[i].name} </h3>
                        <div class="role">${users[i].role}</div>
                    </div>
                    <div class="btn"><a href="/users/${users[i].id}">View</a></div>
                </div>
            `;
    }
  }
  usersHTML.innerHTML = returnHTMl;
}

studentRole.addEventListener("click", async () => {
  studentRole.classList.add("active");
  teacherRole.classList.remove("active");
  getUsers("student");
});

teacherRole.addEventListener("click", () => {
  teacherRole.classList.add("active");
  studentRole.classList.remove("active");
  getUsers("teacher");
});

window.addEventListener("load", () => {
  studentRole.classList.add("active");
  getUsers("student");
});
