function uploadImages() {
    let _files = document.getElementById('filesinput').files;
    var formData = new FormData();
    for (let i=0; i<_files.length; i+=1) {
        formData.append('images', _files[i]);
    }
    $.ajax({
        type:'POST',
        url: 'api',
        data:formData,
        cache:false,
        contentType: false,
        processData: false,
        success: function(data, status, xhr) {
            console.log(data);
            renderImages();
        },
        error: function(xhr, status, err) {
            console.log(err);
            renderImages();
        }
    });
    
}

function deleteImage(id) {
    $.ajax({
        url:`api/delete?id=${id}`,
        method: 'GET',
        success: function(data, status, xhr) {
            console.log(data);
            renderImages();
        }, 
        error: function(xhr, status, err) {
            console.log(status, err);
        }
    });
}

function renderImages() {
    $('#tbody').empty();
    $.ajax({
        url:'api',
        method: 'GET',
        success: function(data, status, xhr) {
            let images = data.images;
            let _trs = '';
            for (let image of images) {
                let _tr = `
                <tr>
                    <td>${image.user}</td>
                    <td>${image.name}</td>
                    <td>${image.mimetype}</td>
                    <td>${image.size}</td>
                    <td>${image.height}</td>
                    <td>${image.width}</td>
                    <td><a target="_blank" href="${image.url}">${image.url}</a></td>
                    <td><img src="${image.url}/AUTOx70" /></td>
                    <td><button 
                        class="btn btn-delete" 
                        onclick="deleteImage('${image['_id']}')">Delete</button></td>
                </tr>
                `;
                _trs += _tr;
            }
            $('#tbody').append(_trs);
        }, 
        error: function(xhr, status, err) {
            console.log(status, err);
        }
    });
}

$(document).ready(function() {
    renderImages();
});