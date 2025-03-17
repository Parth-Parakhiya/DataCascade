document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('upload-form');
    const uploadProgressModal = document.getElementById('upload-progress-modal');
    const uploadProgressBar = document.getElementById('upload-progress-bar');
    const uploadStatusMessage = document.getElementById('upload-status-message');
    const uploadSubmitBtn = document.getElementById('upload-submit-btn');
    const progressText = document.querySelector('.progress-text');
    const stagesContainer = document.getElementById('upload-stages');
    const fileInput = document.getElementById('id_file');
    const fileSelected = document.querySelector('.file-selected');
    
    // File input change event
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileSelected.textContent = this.files[0].name;
        } else {
            fileSelected.textContent = '';
        }
    });

    // Download functionality
    function handleDownload(btn) {
        const fileId = btn.getAttribute('data-file-id');
        const fileName = btn.getAttribute('data-file-name');
        const downloadStatusCell = document.getElementById(`download-status-${fileId}`);

        if (downloadStatusCell) {
            downloadStatusCell.innerHTML = `
                <div class="download-progress">
                    <div class="download-progress-bar"></div>
                    <span class="download-progress-text">0%</span>
                </div>
                <div class="download-status-message">Preparing download...</div>
            `;

            const progressBar = downloadStatusCell.querySelector('.download-progress-bar');
            const progressTextElement = downloadStatusCell.querySelector('.download-progress-text');
            const statusMessage = downloadStatusCell.querySelector('.download-status-message');

            const xhr = new XMLHttpRequest();
            xhr.open('GET', btn.href, true);
            xhr.responseType = 'blob';

            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    progressBar.style.width = `${progress}%`;
                    progressTextElement.textContent = `${progress}%`;
                    statusMessage.textContent = getProgressStatus(progress);
                }
            };

            xhr.onload = function() {
                if (xhr.status === 200) {
                    const url = window.URL.createObjectURL(xhr.response);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    downloadStatusCell.innerHTML = `
                        <div class="download-complete">
                            <i class="fas fa-check-circle"></i> Complete
                        </div>
                    `;

                    setTimeout(() => {
                        downloadStatusCell.innerHTML = '';
                    }, 5000);
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    showError(downloadStatusCell, fileId, 'Download failed. Please try again.');
                }
            };

            xhr.onerror = function() {
                downloadStatusCell.innerHTML = `
                    <div class="download-error">
                        <i class="fas fa-times-circle"></i> Network Error
                        <button class="retry-btn" data-file-id="${fileId}">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;
                
                const retryBtn = downloadStatusCell.querySelector('.retry-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', function() {
                        const fileIdToRetry = this.getAttribute('data-file-id');
                        document.querySelector(`.download-btn[data-file-id="${fileIdToRetry}"]`).click();
                    });
                }
            };

            xhr.send();
        }
    }

    function getProgressStatus(progress) {
        if (progress < 20) return 'Preparing';
        if (progress < 50) return 'Processing';
        if (progress < 95) return 'Downloading';
        return 'Finalizing...';
    }

    function showError(downloadStatusCell, fileId, message) {
        downloadStatusCell.innerHTML = `
            <div class="download-error">
                <i class="fas fa-times-circle"></i> ${message}
                <button class="retry-btn" data-file-id="${fileId}">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;

        const retryBtn = downloadStatusCell.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                const retryBtn = document.querySelector(`.download-btn[data-file-id="${fileId}"]`);
                if (retryBtn) {
                    handleDownload(retryBtn);
                }
            });
        }
    }

    // Attach download event listeners
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            handleDownload(this);
        });
    });

    // Delete functionality
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            
            const fileId = this.getAttribute('data-file-id');
            const fileName = this.getAttribute('data-file-name');
            const deleteUrl = this.getAttribute('href');

            const fileRow = this.closest('tr');
            const deleteStatusCell = fileRow.querySelector(`#download-status-${fileId}`);

            if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
                return;
            }

            if (deleteStatusCell) {
                deleteStatusCell.innerHTML = `
                    <div class="delete-progress">
                        <div class="delete-progress-bar"></div>
                        <span class="delete-progress-text">0%</span>
                    </div>
                    <div class="delete-status-message">Preparing to delete...</div>
                `;

                const progressBar = deleteStatusCell.querySelector('.delete-progress-bar');
                const progressTextElement = deleteStatusCell.querySelector('.delete-progress-text');
                const statusMessage = deleteStatusCell.querySelector('.delete-status-message');

                const xhr = new XMLHttpRequest();
                xhr.open('POST', deleteUrl, true);
                
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.upload.onprogress = function(event) {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        
                        progressBar.style.width = `${progress}%`;
                        progressTextElement.textContent = `${progress}%`;

                        statusMessage.textContent = progress < 20 ? 'Preparing deletion' :
                            progress < 50 ? 'Processing' :
                            progress < 95 ? 'Deleting' : 'Finalizing...';
                    }
                };

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        deleteStatusCell.innerHTML = `
                            <div class="delete-complete">
                                <i class="fas fa-check-circle"></i> Deleted
                            </div>
                        `;

                        fileRow.remove();
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        let errorMessage = 'Delete failed';
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMessage = response.message || errorMessage;
                        } catch(e) {}

                        deleteStatusCell.innerHTML = `
                            <div class="delete-error">
                                <i class="fas fa-times-circle"></i> ${errorMessage}
                                <button class="retry-btn" data-file-id="${fileId}">
                                    <i class="fas fa-redo"></i> Retry
                                </button>
                            </div>
                        `;
                        
                        const retryBtn = deleteStatusCell.querySelector('.retry-btn');
                        if (retryBtn) {
                            retryBtn.addEventListener('click', function() {
                                btn.click();
                            });
                        }
                    }
                };

                xhr.onerror = function() {
                    deleteStatusCell.innerHTML = `
                        <div class="delete-error">
                            <i class="fas fa-times-circle"></i> Network Error
                            <button class="retry-btn" data-file-id="${fileId}">
                                <i class="fas fa-redo"></i> Retry
                            </button>
                        </div>
                    `;
                    
                    const retryBtn = deleteStatusCell.querySelector('.retry-btn');
                    if (retryBtn) {
                        retryBtn.addEventListener('click', function() {
                            btn.click();
                        });
                    }
                };

                xhr.send();
            }
        });
    });

    // Upload form submission
    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        uploadProgressModal.style.display = 'flex';
        uploadSubmitBtn.disabled = true;

        uploadProgressBar.style.width = '0%';
        uploadProgressBar.className = 'progress-bar';
        progressText.textContent = '0%';

        const existingTryAgainBtn = document.getElementById('try-again-btn');
        if (existingTryAgainBtn) {
            existingTryAgainBtn.remove();
        }

        stagesContainer.innerHTML = `
            <div class="upload-stage current" id="stage-chunking">
                <div class="stage-icon">
                    <i class="fas fa-puzzle-piece fa-spin"></i>
                </div>
                <div class="stage-content">
                    <h4>Chunking File</h4>
                    <p>Breaking file into manageable pieces...</p>
                </div>
            </div>
            <div class="upload-stage" id="stage-preprocessing">
                <div class="stage-icon">
                    <i class="fas fa-cogs"></i>
                </div>
                <div class="stage-content">
                    <h4>Preprocessing</h4>
                    <p>Optimizing file for upload...</p>
                </div>
            </div>
            <div class="upload-stage" id="stage-checksum">
                <div class="stage-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="stage-content">
                    <h4>Checksum</h4>
                    <p>Verifying file integrity...</p>
                </div>
            </div>
            <div class="upload-stage" id="stage-uploading">
                <div class="stage-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="stage-content">
                    <h4>Uploading to Server</h4>
                    <p>Transferring file to storage...</p>
                </div>
            </div>
            <div class="upload-stage" id="stage-complete">
                <div class="stage-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stage-content">
                    <h4>Complete</h4>
                    <p>File successfully uploaded!</p>
                </div>
            </div>
        `;

        const formData = new FormData(uploadForm);
        const file = formData.get('file');

        updateStage('chunking', true);
        uploadStatusMessage.textContent = 'Preparing file for upload...';

        setTimeout(() => {
            updateStage('chunking', false, true);
            updateStage('preprocessing', true);
            uploadProgressBar.style.width = '20%';
            progressText.textContent = '20%';
            uploadStatusMessage.textContent = 'Processing file...';

            setTimeout(() => {
                updateStage('preprocessing', false, true);
                updateStage('checksum', true);
                uploadProgressBar.style.width = '40%';
                progressText.textContent = '40%';
                uploadStatusMessage.textContent = 'Generating checksum...';

                setTimeout(() => {
                    updateStage('checksum', false, true);
                    updateStage('uploading', true);
                    uploadProgressBar.style.width = '50%';
                    progressText.textContent = '50%';
                    uploadStatusMessage.textContent = 'Starting upload to server...';

                    startActualUpload(formData);
                }, 2000);
            }, 2000);
        }, 3000);
    });

    function updateStage(stageName, isActive, isComplete = false) {
        const stage = document.getElementById(`stage-${stageName}`);

        if (isActive) {
            document.querySelectorAll('.upload-stage').forEach(el => {
                el.classList.remove('current');
            });
            stage.classList.add('current');
        } else if (isComplete) {
            stage.classList.remove('current');
            stage.classList.add('complete');

            const icon = stage.querySelector('.stage-icon i');
            icon.className = 'fas fa-check';
        }
    }

    function showUploadError(message) {
        const uploadingStage = document.getElementById('stage-uploading');
        if (uploadingStage) {
            uploadingStage.classList.remove('current');
            uploadingStage.classList.add('failed');
            
            const icon = uploadingStage.querySelector('.stage-icon i');
            icon.className = 'fas fa-times-circle';
        }
        
        uploadProgressBar.classList.add('error');
        uploadStatusMessage.textContent = message || 'Upload Failed. Please try again.';
        
        const tryAgainBtn = document.createElement('button');
        tryAgainBtn.id = 'try-again-btn';
        tryAgainBtn.className = 'btn btn-primary button-main try-again-btn';
        tryAgainBtn.innerHTML = '<i class="fas fa-redo"></i> Try Again';
        
        uploadStatusMessage.parentNode.insertBefore(tryAgainBtn, uploadStatusMessage.nextSibling);
        
        tryAgainBtn.addEventListener('click', function() {
            uploadProgressModal.style.display = 'none';
            uploadSubmitBtn.disabled = false;
        });
    }

    function startActualUpload(formData) {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round(50 + (event.loaded / event.total) * 45);
                uploadProgressBar.style.width = `${percentComplete}%`;
                progressText.textContent = `${percentComplete}%`;
                uploadStatusMessage.textContent = `Uploading: ${percentComplete}%`;
            }
        };

        xhr.onload = function () {
            uploadSubmitBtn.disabled = false;

            if (xhr.status === 200) {
                updateStage('uploading', false, true);
                updateStage('complete', true);

                uploadProgressBar.style.width = '100%';
                progressText.textContent = '100%';
                uploadStatusMessage.textContent = 'Upload Complete!';
                uploadProgressBar.classList.add('success');

                document.getElementById('completion-animation').style.display = 'block';

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                showUploadError('Upload Failed. Please try again.');
            }
        };

        xhr.onerror = function () {
            uploadSubmitBtn.disabled = false;
            showUploadError('Network Error. Please try again.');
        };

        xhr.open('POST', uploadForm.action, true);
        xhr.send(formData);
    }

    // Utility function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});