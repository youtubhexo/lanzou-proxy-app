// 存储你的文件信息，包括文件名、蓝奏云链接和对应的密码
// *** 再次强调：这里的密码是硬编码在前端的，任何人查看网页源代码都可以看到。***
// *** 请确保你知道这意味着什么，并且只用于非敏感文件。**
const allFiles = [
    {
        id: 'file1',
        name: '视频修复',
        lanzouUrl: 'https://wwzl.lanzouw.com/ilIYB2x4p4va', // 替换为你的蓝奏云分享链接
        password: '3bbk'
    },
    {
        id: 'file2',
        name: '精选图片壁纸包.rar',
        lanzouUrl: 'https://pan.lanzou.com/i789012',
        password: 'imagepwd'
    },
    {
        id: 'file3',
        name: '开发环境配置手册.pdf',
        lanzouUrl: 'https://pan.lanzou.com/i345678',
        password: 'devmanual'
    },
    {
        id: 'file4',
        name: '我的自制小游戏.exe',
        lanzouUrl: 'https://pan.lanzou.com/i987654',
        password: 'gamepwd'
    },
    {
        id: 'file5',
        name: '效率软件套装.zip',
        lanzouUrl: 'https://pan.lanzou.com/iaaaaaa',
        password: 'toolset'
    },
    {
        id: 'file6',
        name: '音乐制作软件.zip',
        lanzouUrl: 'https://pan.lanzou.com/ibbbbbb',
        password: 'musicapp'
    },
    {
        id: 'file7',
        name: '学习资料精选.rar',
        lanzouUrl: 'https://pan.lanzou.com/icccccc',
        password: 'study'
    },
    {
        id: 'file8',
        name: '字体包合集.zip',
        lanzouUrl: 'https://pan.lanzou.com/idddddd',
        password: 'fonts'
    },
    {
        id: 'file9',
        name: '设计素材库.rar',
        lanzouUrl: 'https://pan.lanzou.com/ieeeeeee',
        password: 'design'
    },
    {
        id: 'file10',
        name: '编程书籍精选.zip',
        lanzouUrl: 'https://pan.lanzou.com/iffffff',
        password: 'coding'
    },
    {
        id: 'file11',
        name: 'Linux系统工具.zip',
        lanzouUrl: 'https://pan.lanzou.com/igggggg',
        password: 'linux'
    },
    {
        id: 'file12',
        name: 'Windows优化工具.exe',
        lanzouUrl: 'https://pan.lanzou.com/ihhhhhh',
        password: 'windows'
    }
    // 更多文件，请按照上面的格式添加
];

// DOM 元素引用
const fileListDiv = document.getElementById('file-list');
const passwordModal = document.getElementById('password-modal');
const modalFilenameSpan = document.getElementById('modal-filename');
const modalPasswordInput = document.getElementById('modal-password-input');
const modalDownloadButton = document.getElementById('modal-download-button');
const modalMessageParagraph = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');

const searchInput = document.getElementById('search-input');
const paginationContainer = document.getElementById('pagination-container');

// 全局状态变量
let currentFilteredFiles = []; // 经过搜索过滤后的文件列表
let currentPage = 1;
const filesPerPage = 8; // 每页显示的文件数量，可根据需要调整
let selectedFile = null; // 当前用户选择下载的文件

// 渲染文件列表的函数，接受一个文件数组作为参数
function renderFileList(filesToRender) {
    fileListDiv.innerHTML = ''; // 清空现有列表
    if (filesToRender.length === 0) {
        fileListDiv.innerHTML = '<p style="text-align: center; color: #7f8c8d; margin-top: 50px;">没有找到匹配的文件。</p>';
        return;
    }
    filesToRender.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span class="file-name">${file.name}</span>
            <button data-id="${file.id}">下载</button>
        `;
        fileItem.querySelector('button').addEventListener('click', (event) => {
            const fileId = event.target.dataset.id;
            selectedFile = allFiles.find(f => f.id === fileId); // 从 allFiles 中查找，确保找到原始文件信息
            if (selectedFile) {
                modalFilenameSpan.textContent = selectedFile.name;
                modalPasswordInput.value = ''; // 清空密码输入框
                modalMessageParagraph.textContent = ''; // 清空消息
                passwordModal.classList.add('show'); // 显示模态框
            }
        });
        fileListDiv.appendChild(fileItem);
    });
}

// 渲染分页控件
function renderPagination(totalPages, activePage) {
    paginationContainer.innerHTML = ''; // 清空现有分页
    if (totalPages <= 1) {
        return; // 只有一页或更少则不显示分页控件
    }

    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.textContent = '上一页';
    prevButton.disabled = activePage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applySearchAndPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    // 页码按钮 (只显示当前页前后少数几个页码)
    const maxPagesToShow = 5; // 最多显示5个页码按钮
    let startPage = Math.max(1, activePage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) { // 调整起始页，确保显示足够多的页码
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active-page', i === activePage);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            applySearchAndPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.textContent = '下一页';
    nextButton.disabled = activePage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            applySearchAndPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}


// 应用搜索过滤和分页逻辑
function applySearchAndPagination() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // 1. 过滤文件
    let filtered = allFiles;
    if (searchTerm) {
        filtered = allFiles.filter(file =>
            file.name.toLowerCase().includes(searchTerm)
        );
    }
    currentFilteredFiles = filtered; // 更新当前过滤后的文件列表

    // 2. 计算分页信息
    const totalPages = Math.ceil(currentFilteredFiles.length / filesPerPage);
    // 确保当前页码在有效范围内
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1; // 如果没有文件，重置到第一页
    }


    const startIndex = (currentPage - 1) * filesPerPage;
    const endIndex = startIndex + filesPerPage;
    const filesToDisplay = currentFilteredFiles.slice(startIndex, endIndex);

    // 3. 渲染文件列表和分页控件
    renderFileList(filesToDisplay);
    renderPagination(totalPages, currentPage);
}

// 模态框下载按钮点击事件
modalDownloadButton.addEventListener('click', () => {
    if (selectedFile) {
        const enteredPassword = modalPasswordInput.value;
        if (enteredPassword === selectedFile.password) {
            modalMessageParagraph.textContent = '密码正确，正在跳转到下载页面...';
            modalMessageParagraph.className = 'success-message';
            // 蓝奏云的分享链接通常是直接可访问的，在新标签页打开
            window.open(selectedFile.lanzouUrl, '_blank');
            // 稍作延迟关闭模态框
            setTimeout(() => {
                passwordModal.classList.remove('show');
                selectedFile = null;
            }, 1500);
        } else {
            modalMessageParagraph.textContent = '密码错误，请重试。';
            modalMessageParagraph.className = 'error-message';
        }
    }
});

// 关闭模态框按钮点击事件
closeButton.addEventListener('click', () => {
    passwordModal.classList.remove('show');
    selectedFile = null; // 清除选中的文件
});

// 点击模态框外部区域关闭模态框
window.addEventListener('click', (event) => {
    if (event.target === passwordModal) {
        passwordModal.classList.remove('show');
        selectedFile = null;
    }
});

// 监听搜索输入框事件
searchInput.addEventListener('input', () => {
    currentPage = 1; // 搜索时重置到第一页
    applySearchAndPagination();
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', applySearchAndPagination);