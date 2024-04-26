const openFormProject = document.getElementById("openForm");
const openFormBlog = document.getElementById("openFormBlog");
const closeFormButton = document.getElementById("closeForm");
const closeFromProject = document.getElementById("update-close-btn");
const closeFormBlog = document.getElementById("closeFormBlog");
const projectForm = document.getElementById("projectForm");
const blogForm = document.getElementById("blogForm");

openFormProject.addEventListener("click", () => {
    projectForm.style.display = "block";
});
// openFormBlog.addEventListener("click", () => {
//   blogForm.style.display = "block";
// });
closeFormButton.addEventListener("click", () => {
    projectForm.style.display = "none";
});

closeFromProject.addEventListener("click", () => {
    updateProjectForm.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == projectForm) {
        projectForm.style.display = "none";
    } else if (event.target == blogForm) {
        blogForm.style.display = "none";
    }
});

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./index.html";
});

async function getMessage() {
    const response = await fetch(
        "https://backend-mybrand-2y5k.onrender.com/api/v1/contact/get-messages",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );
    const data = await response.json();
    const tbody = document.getElementById("message-table-body");

    data.forEach((message, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
              <td>${index + 1}</td>
            <td>${message.userName}</td>
            <td>${message.email}</td>
            <td>${message.subject}</td>
            <td>${message.message}</td>
            <td><span class= "status ${message.status}">${message.status
            }</span></td>
          `;
        tbody.appendChild(row);
    });
}
let userData = [];
async function getUsers() {
    try {
        const response = await fetch(
            "https://backend-mybrand-2y5k.onrender.com/api/v1/user/get-users",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        const data = await response.json();
        console.log(data);
        userData = data;
        updateTotalUsers(userData);
        const tbodyUser = document.getElementById("user-table-body");
        console.log(tbodyUser);
        data.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.userName}</td>
            <td>${user.firstName + " " + user.lastName}</td>
            <td>${user.email}</td>
          `;
            tbodyUser.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

function updateTotalUsers(userData) {
    const totalUsers = userData.length;
    const totalUsersElement = document.querySelector('.insights .info h3:first-of-type');
    if (totalUsersElement) {
        totalUsersElement.textContent = totalUsers;
    }
}

let projectTotal = []

async function getProjects() {
    const response = await fetch(
        "https://backend-mybrand-2y5k.onrender.com/api/v1/project/get-projects",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    const data = await response.json();
    console.log(data);
    projectTotal = data;
    updateTotalProjects(projectTotal);
    const tbodyProject = document.getElementById("project-table-body");
    console.log(tbodyProject);
    data.forEach((project, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${project.title}</td>
            <td>${project.field}</td>
            <td>
              <img src="${project.images[0].url}" alt="${project.title
            }" style="width:100px !important;height:100px !important">
              </td>
            <td>${project.description}</td>
            <td>
              <td>
              <div style="display:flex;gap:5px">
                <i class="bx bx-edit edit-icon" style="color:#D32F2F;cursor: pointer;" data-project-id="${project._id
            }"></i>
                <i class="bx bx-trash" style="color:#1976D2;cursor: pointer;"
                data-project-id ="${project._id}"></i>
                </div>
              </td>
          `;

        tbodyProject.appendChild(row);
    });
}

function updateTotalProjects(projectData) {
    const totalProjects = projectData.length;
    const totalProjectsElement = document.querySelector('.insights .info .p');
    console.log(totalProjectsElement)
    if (totalProjectsElement) {
        totalProjectsElement.textContent = totalProjects;
    }
}

async function postProject(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("field", document.getElementById("field").value);
    formData.append(
        "description",
        document.getElementById("description").value
    );
    formData.append(
        "image",
        document.querySelector('input[type="file"]').files[0]
    );

    try {
        const response = await fetch(
            "https://backend-mybrand-2y5k.onrender.com/api/v1/project/post-project",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            }
        );
        const data = await response.json();
        showToast(data.message, "success");
        console.log(data);

        const tbodyProject = document.getElementById("project-table-body");
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tbodyProject.childElementCount + 1}</td>
          <td>${data.projectDetail.title}</td>
          <td>${data.projectDetail.field}</td>
          <td>
            <img src="${data.projectDetail.images[0].url}" alt="${data.projectDetail.title
            }" style="width:100px;height:100px">
          </td>
          <td>${data.projectDetail.description}</td>
          <td>
              <div style="display:flex;gap:5px">
                <i class="bx bx-edit edit-icon" style="color:#D32F2F;cursor: pointer;" data-project-id="${data.projectDetail._id
            }"></i>
                <i class="bx bx-trash" style="color:#1976D2;cursor: pointer;" data-project-id ="${data.projectDetail._id
            }"></i>
                </div>
              </td>
        `;
        tbodyProject.appendChild(row);
        projectForm.style.display = "none";
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getProjectById(projectId) {
    try {
        const response = await fetch(
            `https://backend-mybrand-2y5k.onrender.com/api/v1/project/get-project/${projectId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}



function openUpdateProjectForm(project) {
    const updateForm = document.getElementById("updateProjectForm");
    updateForm.style.display = "block";
    document.getElementById("update-project-id").value = project._id;
    document.getElementById("update-title").value = project.title;
    document.getElementById("update-field").value = project.field;
    document.getElementById("update-description").value =
        project.description;
}

// Edit icon click event listener
function openUpdateProjectForm(project) {
    const updateForm = document.getElementById("updateProjectForm");
    updateForm.style.display = "block";
    document.getElementById("update-project-id").value = project._id;
    document.getElementById("update-title").value = project.title;
    document.getElementById("update-field").value = project.field;
    document.getElementById("update-description").value =
        project.description;
}
async function updateProject(projectId) {
    try {
        const formData = new FormData();
        formData.append(
            "title",
            document.getElementById("update-title").value
        );
        formData.append(
            "field",
            document.getElementById("update-field").value
        );
        formData.append(
            "description",
            document.getElementById("update-description").value
        );
        formData.append(
            "image",
            document.getElementById("update-image").files[0]
        );

        const response = await fetch(
            `https://backend-mybrand-2y5k.onrender.com/api/v1/project/update-project/${projectId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (response.ok) {
            const updatedProject = data.updateProject;
            console.log("Project updated:", updatedProject);

            // Update project in the table
            const editIcon = document.querySelector(
                `i[data-project-id="${projectId}"]`
            );
            if (editIcon) {
                const projectRow = editIcon.closest("tr");
                if (projectRow) {
                    const numberCell = projectRow.querySelector("td:first-child");
                    if (numberCell) {
                        const projectNumber = numberCell.textContent;
                        projectRow.innerHTML = `
              <td>${projectNumber}</td>
              <td>${updatedProject.title}</td>
              <td>${updatedProject.field}</td>
              <td>
                <img src="${updatedProject.images[0]?.url || ""}" alt="${updatedProject.title
                            }" style="width:100px;height:100px">
              </td>
              <td>${updatedProject.description}</td>
              <td>
                <div style="display:flex;gap:5px">
                  <i class="bx bx-edit edit-icon" style="color:#D32F2F;cursor: pointer;" data-project-id="${projectId}"></i>
                  <i class="bx bx-trash trash-icon" style="color:#1976D2;cursor: pointer; deleteProject('${projectId}')></i>
                </div>
              </td>
            `;
                    } else {
                        console.error("Number column not found!");
                    }
                } else {
                    console.error("Project row not found!");
                }
            } else {
                console.error("Edit icon not found!");
            }
        } else {
            showToast(data.message, errror)
        }
    } catch (error) {
        showToast("Something went wrong","error")
    }
}

document
    .getElementById("update-project-form")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        const projectId = document.getElementById("update-project-id").value;
        updateProject(projectId);
    });

document.addEventListener("click", async (e) => {
    if (e.target && e.target.classList.contains("edit-icon")) {
        const projectId = e.target.dataset.projectId;
        const project = await getProjectById(projectId);
        if (project) {
            openUpdateProjectForm(project);
        }
    }
});

document.addEventListener("click", async (e) => {
    
    if (e.target && e.target.classList.contains("bx-trash")) {
        const projectId = e.target.dataset.projectId;
        if (projectId) {
            deleteProject(projectId);
        } else {
            console.error("Project id not found!");
        }
    }
});

async function deleteProject(projectId) {
    try {
        const response = await fetch(
            `https://backend-mybrand-2y5k.onrender.com/api/v1/project/delete-project/${projectId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const res = await response.json();
        const data = res.deletedProject;
        if (response.ok) {
            console.log("Project deleted:", data.message);

            const projectRow = document
                .querySelector(`i[data-project-id="${projectId}"]`)
                .closest("tr");
            if (projectRow) {
                projectRow.remove();
            }
        } else {
            console.error("Failed to delete project:", res.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document
    .getElementById("project-form")
    .addEventListener("submit", postProject);

async function getAllFunctions() {
    await getProjects();
    await getUsers();
    await getMessage();
}
document.addEventListener("DOMContentLoaded", getAllFunctions);

