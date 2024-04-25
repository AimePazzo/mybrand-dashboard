const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const contentDashboard = document.getElementById('content-dashboard');
const contentProject = document.getElementById('content-project');
const contentUser = document.getElementById('content-user');
const contentMessage = document.getElementById('content-message');
const blogLink = document.getElementById('blog-link');
const contentBlog = document.getElementById('content-blog');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');

        // contentDashboard.classList.add('hide-content');
        // contentBlog.classList.add('hide-content');
        contentProject.classList.add('hide-content');
        contentUser.classList.add('hide-content');
        contentMessage.classList.add('hide-content');
        // contentSettings.classList.add('hide-content');

        // Remove 'hide-content' class from the clicked content section
       if (item === document.getElementById('project-link')) {
            contentDashboard.classList.add('hide-content');
            contentProject.classList.remove('hide-content');
        } else if (item === document.getElementById('user-link')) {
            contentDashboard.classList.add('hide-content');
            contentUser.classList.remove('hide-content');
        } else if (item === document.getElementById('message-link')) {
            contentDashboard.classList.add('hide-content');
            contentMessage.classList.remove('hide-content');
        } 
        // else if (item === document.getElementById('settings-link')) {
        //     contentSettings.classList.remove('hide-content');
        // }
        else {
            contentDashboard.classList.remove('hide-content');
        }
    });
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

