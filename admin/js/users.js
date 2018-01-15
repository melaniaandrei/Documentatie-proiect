/* global $ */

// READ recods on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords() {
    $.get("/user/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.name +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#articles').append(row);
        });
    });
}




function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="name">'+value.name+'</td>'
            + '<td class="email">'+value.email+'</td>'
		
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Delete</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#name').val('');
    $('#email').val('');
    
    $('#myModalLabel').html('Add New User');
  //  $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/user/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#name').val(data.name);
        $('#email').val(data.email);

        $('#id').val(id);
        $('#myModalLabel').html('Edit User');
        
        $('#add_new_record_modal').modal('show');
    });
}

function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/user/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#articles').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/user/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.email').html(formData.email);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

function deleteRecord(id) {
    $.ajax({
        url: '/user/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}