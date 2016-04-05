(function($, window, document, undefined) {
	var userListData = []

	$(function () {
		populateTable();
		// username link click
		$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo)
		$('#btnAddUser').on('click', addUser)
	})

	function populateTable () {
		var tableContent = ''
		// jquery ajax call for JSON
		$.getJSON('/users/userlist', function ( data ) {
			userListData = data
			// for each item in our JSON, add a table row and cells to the content string
			$.each(data, function () {
				tableContent += '<tr>'
				tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>'
				tableContent += '<td>' + this.email + '</td>'
				tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>'
				tableContent += '</tr>'
			})
			// inject the whole content string into our table
			$('#userList table tbody').html(tableContent)
		})
	}
	// show user info
	function showUserInfo (e) {
		e.preventDefault()
		// get username from link rel attribute.
		var thisUserName = $(this).attr('rel')
		// get index of object based on id value.
		var arrayPosition = userListData.map(function (arrayItem) {
			return arrayItem.username
		}).indexOf(thisUserName)
		// get our user object
		var thisUserObject = userListData[arrayPosition]

		// populate info box
		$('#userInfoName').text(thisUserObject.fullname)
		$('#userInfoAge').text(thisUserObject.age)
		$('#userInfoGender').text(thisUserObject.gender)
		$('#userInfoLocation').text(thisUserObject.location)
	}

	// Add User
	function addUser (e) {
		e.preventDefault()

		// super basic validation
		var errorCount = 0;

		$('#addUser input').each(function (index, val) {
			if ($(this).val() === '')
				errorCount++
		})

		if (errorCount === 0) {
			// if it is, compile all user info into one object
			var newUser = {
				'username': $('#addUser fieldset input#inputUserName').val(),
				'email'   : $('#addUser fieldset input#inputUserEmail').val(),
				'fullname': $('#addUser fieldset input#inputUserFullname').val(),
				'age'			: $('#addUser fieldset input#inputUserAge').val(),
				'location': $('#addUser fieldset input#inputUserLocation').val(),
				'gender'	: $('#addUser fieldset input#inputUserGender').val()
			}
			// use ajax to post the object to the adduser service
			$.ajax({
				type: 'POST',
				data: newUser,
				url: '/users/adduser',
				dataType: 'JSON'
			}).done(function ( response ) {
				if ( response.msg === '' ) {
					// clear the form
					$('#addUser fieldset input').val('')
					// update the table
					populateTable()
				} else {
					alert('Error ' + response.msg )
				}
			})
		} else {
			alert('Please fill in all the fields')
			return false
		}
	}
	// Listen for click on user link
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser)
	// Delete User
	function deleteUser (e) {
		e.preventDefault()

		// use a confirm
		var confirmation = confirm('Are you sure you want to delete this user?', '')
		if (confirmation === true) {
			$.ajax({
				type: 'DELETE',
				url : '/users/deleteuser/' + $(this).attr('rel')
			}).done(function ( response ) {
				if ( response.msg === '' ) {
				} else {
					alert('Error: ' + response.msg)
				}

				populateTable()
			})
		} else {
			return false
		}
	}

}(jQuery, window, document));
