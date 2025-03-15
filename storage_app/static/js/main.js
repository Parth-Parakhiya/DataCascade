// // DataCascade Main JavaScript
// // Document ready function
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize the carousel
//     initCarousel();
    
//     // Initialize file upload functionality
//     initFileUpload();
    
//     // Initialize toast notifications
//     initToasts();
    
//     // Initialize dark mode toggle
//     initDarkMode();
// });

// // Carousel initialization
// function initCarousel() {
//     const carousel = document.getElementById('carouselIndicators');
//     if (!carousel) return;
    
//     let currentSlide = 0;
//     const slides = carousel.querySelectorAll('.carousel-item');
//     const indicators = carousel.querySelectorAll('.carousel-indicators li');
//     const total = slides.length;
    
//     // Set initial active state
//     if (slides.length > 0) {
//         slides[0].classList.add('active');
//     }
//     if (indicators.length > 0) {
//         indicators[0].classList.add('active');
//     }
    
//     // Auto-rotate carousel
//     setInterval(() => {
//         currentSlide = (currentSlide + 1) % total;
//         updateCarousel();
//     }, 5000);
    
//     // Click events for indicators
//     indicators.forEach((indicator, index) => {
//         indicator.addEventListener('click', () => {
//             currentSlide = index;
//             updateCarousel();
//         });
//     });
    
//     // Click events for controls
//     const prevControl = carousel.querySelector('.carousel-control-prev');
//     const nextControl = carousel.querySelector('.carousel-control-next');
    
//     if (prevControl) {
//         prevControl.addEventListener('click', (e) => {
//             e.preventDefault();
//             currentSlide = (currentSlide - 1 + total) % total;
//             updateCarousel();
//         });
//     }
    
//     if (nextControl) {
//         nextControl.addEventListener('click', (e) => {
//             e.preventDefault();
//             currentSlide = (currentSlide + 1) % total;
//             updateCarousel();
//         });
//     }
    
//     // Update carousel display
//     function updateCarousel() {
//         slides.forEach((slide, index) => {
//             if (index === currentSlide) {
//                 slide.classList.add('active');
//             } else {
//                 slide.classList.remove('active');
//             }
//         });
        
//         indicators.forEach((indicator, index) => {
//             if (index === currentSlide) {
//                 indicator.classList.add('active');
//             } else {
//                 indicator.classList.remove('active');
//             }
//         });
//     }
// }

// // File upload functionality
// function initFileUpload() {
//     const fileUploadArea = document.querySelector('.file-upload-area');
//     const fileInput = document.getElementById('fileInput');
//     const uploadButton = document.getElementById('uploadButton');
//     const progressBar = document.querySelector('.upload-progress-bar');
//     const progressText = document.querySelector('.upload-progress-text');
    
//     if (!fileUploadArea || !fileInput) return;
    
//     fileUploadArea.addEventListener('click', () => {
//         fileInput.click();
//     });
    
//     fileUploadArea.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         fileUploadArea.classList.add('drag-over');
//     });
    
//     fileUploadArea.addEventListener('dragleave', () => {
//         fileUploadArea.classList.remove('drag-over');
//     });
    
//     fileUploadArea.addEventListener('drop', (e) => {
//         e.preventDefault();
//         fileUploadArea.classList.remove('drag-over');
        
//         if (e.dataTransfer.files.length) {
//             fileInput.files = e.dataTransfer.files;
//             updateFilePreview(fileInput.files);
//         }
//     });
    
//     fileInput.addEventListener('change', () => {
//         updateFilePreview(fileInput.files);
//     });
    
//     if (uploadButton) {
//         uploadButton.addEventListener('click', () => {
//             if (fileInput.files.length === 0) {
//                 showToast('Please select files to upload', 'error');
//                 return;
//             }
            
//             // Simulate upload progress
//             let progress = 0;
//             const interval = setInterval(() => {
//                 progress += 5;
//                 if (progressBar) progressBar.style.width = progress + '%';
//                 if (progressText) progressText.textContent = progress + '%';
                
//                 if (progress >= 100) {
//                     clearInterval(interval);
//                     showToast('Files uploaded successfully!', 'success');
//                 }
//             }, 200);
//         });
//     }
    
//     function updateFilePreview(files) {
//         const previewContainer = document.querySelector('.file-preview');
//         if (!previewContainer) return;
        
//         previewContainer.innerHTML = '';
        
//         if (files.length === 0) {
//             previewContainer.innerHTML = '<p>No files selected</p>';
//             return;
//         }
        
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const fileSize = formatFileSize(file.size);
            
//             const fileElement = document.createElement('div');
//             fileElement.className = 'file-item';
//             fileElement.innerHTML = `
//                 <div class="file-icon">
//                     <i class="fas ${getFileIcon(file.name)}"></i>
//                 </div>
//                 <div class="file-info">
//                     <div class="file-name">${file.name}</div>
//                     <div class="file-size">${fileSize}</div>
//                 </div>
//                 <div class="file-remove">
//                     <i class="fas fa-times"></i>
//                 </div>
//             `;
            
//             const removeButton = fileElement.querySelector('.file-remove');
//             removeButton.addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 fileElement.remove();
//                 // Note: This doesn't actually remove the file from the FileList
//                 // In a real implementation, you'd need to use a FormData approach
//             });
            
//             previewContainer.appendChild(fileElement);
//         }
//     }
    
//     function formatFileSize(bytes) {
//         if (bytes === 0) return '0 Bytes';
        
//         const k = 1024;
//         const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         const i = Math.floor(Math.log(bytes) / Math.log(k));
        
//         return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//     }
    
//     function getFileIcon(filename) {
//         const extension = filename.split('.').pop().toLowerCase();
        
//         const iconMap = {
//             'pdf': 'fa-file-pdf',
//             'doc': 'fa-file-word',
//             'docx': 'fa-file-word',
//             'xls': 'fa-file-excel',
//             'xlsx': 'fa-file-excel',
//             'ppt': 'fa-file-powerpoint',
//             'pptx': 'fa-file-powerpoint',
//             'jpg': 'fa-file-image',
//             'jpeg': 'fa-file-image',
//             'png': 'fa-file-image',
//             'gif': 'fa-file-image',
//             'zip': 'fa-file-archive',
//             'rar': 'fa-file-archive',
//             'txt': 'fa-file-alt',
//             'csv': 'fa-file-csv'
//         };
        
//         return iconMap[extension] || 'fa-file';
//     }
// }

// // Toast notifications
// function initToasts() {
//     // Create toast container if it doesn't exist
//     let toastContainer = document.querySelector('.toast-container');
    
//     if (!toastContainer) {
//         toastContainer = document.createElement('div');
//         toastContainer.className = 'toast-container';
//         document.body.appendChild(toastContainer);
//     }
// }

// function showToast(message, type = 'info', duration = 3000) {
//     const toastContainer = document.querySelector('.toast-container');
//     if (!toastContainer) return;
    
//     const toast = document.createElement('div');
//     toast.className = `toast toast-${type}`;
//     toast.innerHTML = `
//         <div class="toast-content">
//             <i class="fas ${getToastIcon(type)}"></i>
//             <span>${message}</span>
//         </div>
//         <div class="toast-progress"></div>
//     `;
    
//     toastContainer.appendChild(toast);
    
//     // Animate the toast in
//     setTimeout(() => {
//         toast.classList.add('show');
//     }, 10);
    
//     // Animate progress bar
//     const progressBar = toast.querySelector('.toast-progress');
//     if (progressBar) {
//         progressBar.style.transition = `width ${duration}ms linear`;
//         progressBar.style.width = '0%';
//     }
    
//     // Remove the toast after duration
//     setTimeout(() => {
//         toast.classList.remove('show');
//         setTimeout(() => {
//             toast.remove();
//         }, 300);
//     }, duration);
    
//     function getToastIcon(type) {
//         const iconMap = {
//             'success': 'fa-check-circle',
//             'error': 'fa-exclamation-circle',
//             'warning': 'fa-exclamation-triangle',
//             'info': 'fa-info-circle'
//         };
        
//         return iconMap[type] || 'fa-info-circle';
//     }
// }

// // Dark mode toggle
// function initDarkMode() {
//     const darkModeToggle = document.getElementById('darkModeToggle');
//     if (!darkModeToggle) return;
    
//     // Check for saved user preference
//     const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
//     // Set initial state
//     if (isDarkMode) {
//         document.body.classList.add('dark-mode');
//         darkModeToggle.checked = true;
//     }
    
//     darkModeToggle.addEventListener('change', () => {
//         if (darkModeToggle.checked) {
//             document.body.classList.add('dark-mode');
//             localStorage.setItem('darkMode', 'true');
//         } else {
//             document.body.classList.remove('dark-mode');
//             localStorage.setItem('darkMode', 'false');
//         }
//     });
// }