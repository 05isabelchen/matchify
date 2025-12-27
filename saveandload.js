// Data storage
let boards = JSON.parse(localStorage.getItem('visionBoards')) || [];
let currentBoardId = null;

// DOM elements
const boardsListView = document.getElementById('boardsListView');
const boardDetailView = document.getElementById('boardDetailView');
const boardsGrid = document.getElementById('boardsGrid');
const createBoardBtn = document.getElementById('createBoardBtn');
const boardModal = document.getElementById('boardModal');
const closeBoardModal = document.getElementById('closeBoardModal');
const boardForm = document.getElementById('boardForm');
const backToBoards = document.getElementById('backToBoards');
const uploadToBoard = document.getElementById('uploadToBoard');
const uploadModal = document.getElementById('uploadModal');
const closeUploadModal = document.getElementById('closeUploadModal');
const photoInput = document.getElementById('photoInput');
const selectPhotoBtn = document.getElementById('selectPhotoBtn');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreview = document.getElementById('photoPreview');
const savePhotoBtn = document.getElementById('savePhotoBtn');
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const shareLinkInput = document.getElementById('shareLinkInput');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const shareBoardBtn = document.getElementById('shareBoardBtn');
const editBoardModal = document.getElementById('editBoardModal');
const closeEditBoardModal = document.getElementById('closeEditBoardModal');
const editBoardForm = document.getElementById('editBoardForm');

document.getElementById('editBoardBtn').addEventListener('click', () => {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        document.getElementById('editBoardName').value = board.name;
        document.getElementById('editBoardDescription').value = board.description || '';
        renderEditImages(currentBoardId);
        editBoardModal.classList.add('active');
    }
});

closeEditBoardModal.addEventListener('click', () => {
    editBoardModal.classList.remove('active');
});

editBoardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        board.name = document.getElementById('editBoardName').value;
        board.description = document.getElementById('editBoardDescription').value;
        saveBoards();
        renderBoardDetail(currentBoardId);
        renderBoards();
        editBoardModal.classList.remove('active');
    }
});

// Initialize
renderBoards();

// Event listeners
createBoardBtn.addEventListener('click', () => {
    document.getElementById('boardModalTitle').textContent = 'Create New Board';
    boardForm.reset();
    boardModal.classList.add('active');
});

closeBoardModal.addEventListener('click', () => {
    boardModal.classList.remove('active');
});

closeUploadModal.addEventListener('click', () => {
    uploadModal.classList.remove('active');
    photoPreviewContainer.style.display = 'none';
});

closeShareModal.addEventListener('click', () => {
    shareModal.classList.remove('active');
});

boardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('boardName').value;
    const description = document.getElementById('boardDescription').value;
    
    const newBoard = {
        id: Date.now().toString(),
        name,
        description,
        images: [],
        createdAt: new Date().toISOString()
    };

    boards.push(newBoard);
    saveBoards();
    renderBoards();
    boardModal.classList.remove('active');
});

backToBoards.addEventListener('click', () => {
    showBoardsList();
});

uploadToBoard.addEventListener('click', () => {
    uploadModal.classList.add('active');
});

selectPhotoBtn.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

savePhotoBtn.addEventListener('click', () => {
    const board = boards.find(b => b.id === currentBoardId);
    if (board && photoPreview.src) {
        board.images.push({
            id: Date.now().toString(),
            url: photoPreview.src,
            addedAt: new Date().toISOString()
        });
        saveBoards();
        renderBoardDetail(currentBoardId);
        uploadModal.classList.remove('active');
        photoPreviewContainer.style.display = 'none';
        photoInput.value = '';
    }
});

shareBoardBtn.addEventListener('click', () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?board=${currentBoardId}`;
    shareLinkInput.value = shareUrl;
    shareModal.classList.add('active');
});

copyLinkBtn.addEventListener('click', () => {
    shareLinkInput.select();
    document.execCommand('copy');
    copyLinkBtn.textContent = 'Copied!';
    copyLinkBtn.classList.add('copied');
    setTimeout(() => {
        copyLinkBtn.textContent = 'Copy';
        copyLinkBtn.classList.remove('copied');
    }, 2000);
});

document.getElementById('deleteBoardBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this board?')) {
        boards = boards.filter(b => b.id !== currentBoardId);
        saveBoards();
        showBoardsList();
        renderBoards();
    }
});

// Functions
function saveBoards() {
    localStorage.setItem('visionBoards', JSON.stringify(boards));
}

function renderBoards() {
    boardsGrid.innerHTML = '';
    
    if (boards.length === 0) {
        boardsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #999;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
                <h3>No boards yet</h3>
                <p>Create your first vision board to get started</p>
            </div>
        `;
        return;
    }

    boards.forEach(board => {
        const card = document.createElement('div');
        card.className = 'board-card';
        
        const coverImages = board.images.slice(0, 4);
        const coverHtml = coverImages.length > 0
            ? `<div class="board-cover-grid">
                ${coverImages.map(img => `<img src="${img.url}" class="board-cover-img" alt="">`).join('')}
                </div>`
            : '<div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: center; font-size: 3rem; opacity: 0.3;">📸</div>';

        card.innerHTML = `
            <div class="board-cover">${coverHtml}</div>
            <div class="board-info">
                <h3 class="board-name">${board.name}</h3>
                <div class="board-meta">
                    <span>${board.images.length} photos</span>
                    <span>${new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            showBoardDetail(board.id);
        });

        boardsGrid.appendChild(card);
    });
}

function showBoardDetail(boardId) {
    currentBoardId = boardId;
    renderBoardDetail(boardId);
    boardsListView.style.display = 'none';
    boardDetailView.classList.add('active');
}

function showBoardsList() {
    currentBoardId = null;
    boardDetailView.classList.remove('active');
    boardsListView.style.display = 'block';
}

function renderBoardDetail(boardId) {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    document.getElementById('boardTitle').textContent = board.name;
    document.getElementById('boardDescription').textContent = board.description || '';

    const imagesGrid = document.getElementById('boardImagesGrid');
    const emptyBoard = document.getElementById('emptyBoard');

    if (board.images.length === 0) {
        imagesGrid.style.display = 'none';
        emptyBoard.classList.remove('hidden');
    } else {
        imagesGrid.style.display = 'grid';
        emptyBoard.classList.add('hidden');
        
        imagesGrid.innerHTML = board.images.map(img => `
            <div class="board-image-item">
                <img src="${img.url}" alt="">
                <div class="board-image-overlay">
                    <button class="remove-image-btn" data-board-id="${boardId}" data-image-id="${img.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeImage(btn.dataset.boardId, btn.dataset.imageId);
            });
        });
        
        // Extract and display colors
        extractColorsFromImages(boardId);
    }
}

function removeImage(boardId, imageId) {
    const board = boards.find(b => b.id === boardId);
    if (board) {
        board.images = board.images.filter(img => img.id !== imageId);
        saveBoards();
        renderBoardDetail(boardId);
    }
}

// Check for shared board in URL
const urlParams = new URLSearchParams(window.location.search);
const sharedBoardId = urlParams.get('board');
if (sharedBoardId && boards.find(b => b.id === sharedBoardId)) {
    showBoardDetail(sharedBoardId);
}

function renderEditImages(boardId) {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    
    const editGrid = document.getElementById('editImagesGrid');
    editGrid.innerHTML = board.images.map((img, index) => `
        <div class="edit-image-item" draggable="true" data-index="${index}">
            <img src="${img.url}" alt="">
        </div>
    `).join('');
    
    // Add drag and drop functionality
    const items = editGrid.querySelectorAll('.edit-image-item');
    let draggedItem = null;
    
    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem !== item) {
                const fromIndex = parseInt(draggedItem.dataset.index);
                const toIndex = parseInt(item.dataset.index);
                
                // Swap images in array
                const temp = board.images[fromIndex];
                board.images[fromIndex] = board.images[toIndex];
                board.images[toIndex] = temp;
                
                saveBoards();
                renderEditImages(boardId);
                renderBoardDetail(boardId);
                renderBoards();
            }
        });
    });
}

async function extractColorsFromImages(boardId) {
    const board = boards.find(b => b.id === boardId);
    if (!board || board.images.length === 0) return;
    
    const allColors = [];
    
    // Extract colors from each image
    for (let img of board.images) {
        const colors = await extractColorsFromImage(img.url);
        allColors.push(...colors);
    }
    
    // Get the most dominant colors
    const dominantColors = getMostFrequentColors(allColors, 6);
    
    displayBoardPalette(dominantColors);
    displaySuggestedColors(dominantColors);
}

function extractColorsFromImage(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            const colors = [];
            
            // Sample pixels (every 10th pixel to improve performance)
            for (let i = 0; i < pixels.length; i += 40) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];
                
                // Skip transparent and very light/dark pixels (likely background)
                if (a < 125) continue;
                const brightness = (r + g + b) / 3;
                if (brightness > 240 || brightness < 20) continue;
                
                // Skip near-white and near-black (often background)
                const isNearWhite = r > 230 && g > 230 && b > 230;
                const isNearBlack = r < 30 && g < 30 && b < 30;
                if (isNearWhite || isNearBlack) continue;
                
                colors.push(rgbToHex(r, g, b));
            }
            
            resolve(colors);
        };
        img.onerror = () => resolve([]);
        img.src = imageUrl;
    });
}

function getMostFrequentColors(colors, count) {
    const colorCounts = {};
    
    colors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    
    return Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(entry => entry[0]);
}

function displayBoardPalette(colors) {
    const paletteContainer = document.getElementById('boardPalette');
    paletteContainer.innerHTML = colors.map(color => `
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}" title="${color}"></div>
    `).join('');
    
    // Add click to copy functionality
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            navigator.clipboard.writeText(color);
            
            // Show copied feedback
            const originalTitle = swatch.title;
            swatch.title = 'Copied!';
            setTimeout(() => {
                swatch.title = originalTitle;
            }, 1000);
        });
    });
}

function displaySuggestedColors(baseColors) {
    // Generate complementary colors
    const complementary = baseColors.map(color => getComplementaryColor(color));
    document.getElementById('complementaryPalette').innerHTML = complementary.map(color => `
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}" title="${color}"></div>
    `).join('');
    
    // Generate analogous colors
    const analogous = baseColors.map(color => getAnalogousColor(color));
    document.getElementById('analogousPalette').innerHTML = analogous.map(color => `
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}" title="${color}"></div>
    `).join('');
    
    // Neutral matches
    const neutrals = ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#424242'];
    document.getElementById('neutralPalette').innerHTML = neutrals.map(color => `
        <div class="color-swatch" style="background-color: ${color}" data-color="${color}" title="${color}"></div>
    `).join('');
    
    // Add click to copy for all suggestion swatches
    document.querySelectorAll('.suggestion-palette .color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            navigator.clipboard.writeText(color);
            const originalTitle = swatch.title;
            swatch.title = 'Copied!';
            setTimeout(() => {
                swatch.title = originalTitle;
            }, 1000);
        });
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function getComplementaryColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + 180) % 360;
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

function getAnalogousColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + 30) % 360;
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}