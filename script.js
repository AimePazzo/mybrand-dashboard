document.addEventListener("DOMContentLoaded", function () {
    const openFormProject = document.getElementById("openForm");

    const closeFormButton = document.getElementById("closeForm");
    const closeFromProject = document.getElementById("update-close-btn");

    const projectForm = document.getElementById("projectForm");

    const updateProjectForm = document.getElementById("updateProjectForm")
    const updateCommentForm = document.querySelector("#popup-form-comment")

    const loaderDiv = document.getElementById('loading-spinner');
    function showLoader() {
        loaderDiv.style.display = 'block';
    }

    function hideLoader() {
        loaderDiv.style.display = 'none';
    }

    function isTokenValid() {
        const token = localStorage.getItem("token");
        if (!token) {
            return false; // Token doesn't exist
        }
        return true;
    }

    if (!isTokenValid()) {
        // Redirect to login page or perform any other action
        window.location.href = "./index.html";
    }

    openFormProject.addEventListener("click", () => {
        projectForm.style.display = "block";
    });

    closeFormButton.addEventListener("click", () => {
        projectForm.style.display = "none";
    });

    closeFromProject.addEventListener("click", () => {
        updateProjectForm.style.display = "none";

    });

    window.addEventListener("click", (event) => {
        if (event.target == projectForm) {
            projectForm.style.display = "none";
        }
    });

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "./index.html";
    });

    async function getMessage() {
        showLoader();
        const response = await fetch(
            "https://backend-mybrand-xea6.onrender.com/api/v1/contact/get-messages",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        if (response.ok) {
            hideLoader()
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
    }
    let userData = [];
    async function getUsers() {
        showLoader()
        try {
            const response = await fetch(
                "https://backend-mybrand-xea6.onrender.com/api/v1/user/get-users",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            const data = await response.json();
            if (data) {
                hideLoader()
                userData = data;
                updateTotalUsers(userData);
                const tbodyUser = document.getElementById("user-table-body");
                data.forEach((user, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${user.userName}</td>
                  <td>${user.firstName + " " + user.lastName}</td>
                  <td>${user.email}</td>
                  <td>${user.verified}</td>
                `;
                    tbodyUser.appendChild(row);
                });
            }
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
        showLoader()
        try {
            const response = await fetch(
                "https://backend-mybrand-xea6.onrender.com/api/v1/project/get-projects",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                hideLoader()
                projectTotal = data;
                updateTotalProjects(projectTotal);
                const tbodyProject = document.getElementById("project-table-body");

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
        }
        catch (error) {
            console.error(error);
        }
    }

    function updateTotalProjects(projectData) {
        const totalProjects = projectData.length;
        const totalProjectsElement = document.querySelector('.insights .info .p');

        if (totalProjectsElement) {
            totalProjectsElement.textContent = totalProjects;
        }
    }

    async function postProject(e) {
        e.preventDefault();
        showLoader()
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
                "https://backend-mybrand-xea6.onrender.com/api/v1/project/post-project",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: formData,
                }
            );
            if (response.ok) {
                hideLoader()
                const data = await response.json();
                showToast(data.message, "success");


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
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getProjectById(projectId) {
        try {
            showLoader();
            const response = await fetch(
                `https://backend-mybrand-xea6.onrender.com/api/v1/project/get-project/${projectId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                hideLoader();
                return data;
            }
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
            showLoader();

            const response = await fetch(
                `https://backend-mybrand-xea6.onrender.com/api/v1/project/update-project/${projectId}`,
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
                hideLoader()

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
            showToast("Something went wrong", "error")
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

    document.addEventListener("click", async (event) => {
        if (event.target && event.target.classList.contains("popups")) {
            const commentId = event.target.dataset.commentId;

            openPop(commentId)

        }
    })
    updateCommentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const buttons = document.getElementsByClassName("comment-updateBtn");
        if (buttons.length > 0) {
            const commentId = buttons[0].dataset.commentId;
            const selectElement = document.getElementById('comment-status')
            const selectedValue = selectElement.value;
            updateComment({ commentId, selectedValue })
        }
    })

    async function updateComment(commentData) {
        showLoader();
        const response = await fetch(`https://backend-mybrand-xea6.onrender.com/api/v1/comments/update-comment/${commentData.commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                status: commentData.selectedValue
            })
        });
        if (response.ok) {
            const data = await response.json();
            hideLoader();
            if (data.message) {
                showToast(data.message, "success");
                // Update the select element
                const selectElement = document.getElementById("comment-status");
                if (selectElement) {
                    const options = selectElement.options;
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].value === commentData.selectedValue) {
                            options[i].selected = true;
                        } else {
                            options[i].selected = false;
                        }
                    }
                }
            } else {
                showToast(data.error, "error");
            }
        }
    }


    async function deleteProject(projectId) {
        try {
            // Show confirmation toast
            showToast(
                `<i class="ri-question-fill" style="color:blue !important;font-size:30px"></i>` + `<p> Are you sure you want to delete this project?</p>`,
                "confirmation"
            );

            // Handle delete when confirmed
            const confirmButton = document.getElementById("confirm-delete");
            const cancelButton = document.getElementById("cancel-delete");

            confirmButton.addEventListener("click", async () => {
                showLoader();
                const response = await fetch(
                    `https://backend-mybrand-xea6.onrender.com/api/v1/project/delete-project/${projectId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (response.ok) {
                    hideLoader()
                    const projectRow = document
                        .querySelector(`i[data-project-id="${projectId}"]`)
                        .closest("tr");
                    if (projectRow) {
                        projectRow.remove();
                    }
                } else {
                    console.error("Failed to delete project:", res.message);
                }
            });

            cancelButton.addEventListener("click", () => {
                const confirmationToast =
                    document.getElementById("confirmation-toast");
                if (confirmationToast) {
                    confirmationToast.remove();
                }
            });
        } catch (error) {
            console.log("Error deleting todo item:", error);
        }
    }

    document
        .getElementById("project-form")
        .addEventListener("submit", postProject);

    // Get the popup
    const popup = document.getElementById("popup-form");

    // Get the button that opens the popup

    // Get the close button
    const closeBtn = document.getElementById("close-btn");

    // Get all Comments
    async function getComments() {
        try {
            showLoader();
            const response = await fetch(
                `https://backend-mybrand-xea6.onrender.com/api/v1/comments/get-comments`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                hideLoader()
                const tbodyComment = document.getElementById("comment-table-body");

                data.data.forEach((comment, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${comment.user.firstName}</td>
                  <td>${comment.project.title}</td>
                  <td>${comment.project.description}</tr>
                    <td>${comment.comment}</td>
                  <td>
                    <div style="display:flex;gap:5px">
                      <h3 style="font-size:12px; text-decoration: underline;color:#1976D2; cursor:pointer" data-comment-id ="${comment.project._id}" class="popups">Details</h3>
                      </div>
                    </td>
                `;

                    tbodyComment.appendChild(row);
                });
                return data;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    async function getCommentById(commentId) {
        try {
            showLoader();
            const response = await fetch(
                `https://backend-mybrand-xea6.onrender.com/api/v1/comments/get-comment/${commentId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                hideLoader();

                return data;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }


    //   Get comments by ID
    async function openPop(commentId) {
        popup.style.display = "block";

        const commentData = await getCommentById(commentId);

        await updateSelectElement(commentId);

        // Get elements from the popup form
        const image = popup.querySelector(".image");
        const commentMessages = popup.querySelector(".comment-section p");
        const buttonUpdate = document.querySelector(".comment-updateBtn")
        const description = popup.querySelector(".description-section p");
        const username = popup.querySelector(".user-details p");
        const date = popup.querySelector(".date p");
        buttonUpdate.dataset.commentId = commentId;
        // Update the elements with the comment data
        if (commentData.data.length > 0) {
            image.src = commentData.data[0].project.images[0].url;
            commentMessages.textContent = commentData.data[0].comment;
            description.textContent = commentData.data[0].project.description;
            username.textContent = commentData.data[0].user.firstName + " " + commentData.data[0].user.lastName;
            const createdAt = new Date(commentData.data[0].createdAt);
            const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
            date.textContent = formattedDate;
        } else {
            // Handle if no comments are found
            console.log("No comments found");
        }

        // Display the popup form
    }



    async function updateSelectElement(commentId) {
        const commentDetails = await getCommentById(commentId);
        if (commentDetails) {
            const selectElement = document.getElementById("comment-status");
            if (selectElement) {
                const options = selectElement.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === commentDetails.status) {
                        options[i].selected = true;
                    } else {
                        options[i].selected = false;
                    }
                }
            }
        }
    }


    // When the user clicks on the button, open the popup



    // When the user clicks on the close button, close the popup
    closeBtn.onclick = function () {
        popup.style.display = "none";
    }

    // When the user clicks anywhere outside of the popup, close it
    window.onclick = function (event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }

    async function getAllFunctions() {
        await getProjects();
        await getUsers();
        await getMessage();
        await getComments();
    }
    getAllFunctions()
});