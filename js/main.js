(function() {
	window.onload = function() {
		var form = document.getElementById('form');
		var addBookForm = document.getElementById('addBookForm');
		var editBookList = document.getElementById('editBookList');
		var removeBookList = document.getElementById('removeBookList');
		var listBooks = document.getElementById('list-books');
		var title = document.getElementsByClassName('title')[0];
		var close = document.getElementById('closeBookForm');
		initializeBookLocalStorage ();
		selectBooksFromLocalStorage ();

		form.onclick = function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			var author = document.getElementById('author').value;
			var year = document.getElementById('year').value;
			var nameBook = document.getElementById('nameBook').value;
			var pages = document.getElementById('pages').value;

			var clearForm = function() {
				document.getElementById('author').value = '';
				document.getElementById('year').value = '';
				document.getElementById('nameBook').value = '';
				document.getElementById('pages').value = '';
				document.getElementById('list-books').innerHTML = '';
				selectBooksFromLocalStorage ();
				title.setAttribute('data-type', 1);
				title.innerHTML = 'Добавление книги!';
				addBookForm.innerHTML = 'Добавить';
				close.style.display = 'none';
			}

			if (target.className == "btn btn-success") {

				if (!author || !year || !nameBook || !pages) {
					alert("Вы не ввели данные!");
					return false;
				}

				if (title.getAttribute('data-type') == 1) {
					addToLocalStorage({
						author: author,
						year: year,
						nameBook: nameBook,
						pages: pages
					});
					
				}

				if (title.getAttribute('data-type') == 2) {
					updateLocalStorage({
						id: title.getAttribute('data-id'),
						author: author,
						year: year,
						nameBook: nameBook,
						pages: pages
					});
				}
				clearForm();
			}

			if (target.className == 'btn btn-danger closeUpdate') {
				clearForm();
			}
			
			

		};


		listBooks.onclick = function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;


			if (target.className == 'list-items-book-action-link__remove') {
				deleteFromLocalStorage(target.getAttribute('data-id'));
				document.getElementById('list-books').innerHTML = '';
				selectBooksFromLocalStorage ()
				console.log("Удалено!");
			}

			if (target.className == 'list-items-book-action-link__edit') {

				title.setAttribute('data-id', target.getAttribute('data-id'));
				title.setAttribute('data-type', 2);
				title.innerHTML = 'Изменение книги!';
				addBookForm.innerHTML = 'Изменить';
				close.style.display = 'block';

				while(target.className != "list-items-book"){
					target = target.parentNode;
				}
						
				document.getElementById('author').value = target.querySelector('.authorList').innerHTML;
				document.getElementById('year').value = target.querySelector('.yearList').innerHTML;
				document.getElementById('nameBook').value = target.querySelector('.nameBookList').innerHTML;
				document.getElementById('pages').value = target.querySelector('.pagesList').innerHTML;
			}

			
		};
	};

///////////////////////Инициализация/////////////////////////////////

		function initializeBookLocalStorage () {
			if (!localStorage.getItem('books')) {
				localStorage.setItem('books', JSON.stringify({0:{}}));
			}
		}

///////////////////////Выбор из хранилище////////////////////////////

		function selectBooksFromLocalStorage () {
			iterateLocalStorage(function (i, book) {
				addToContent({
					id: book['id'],
					author: book.author,
					year: book.year,
					nameBook: book.nameBook,
					pages: book.pages
				});
				

			});
		}

///////////////////////Добавление списка книг/////////////////////////

		function addToContent (object) {
			var html = '\
					<div class="list-items-book" data-id="' + object.id + '">\
						<div class="list-items-book-fields">\
							<div class="list-items-book-fields-author">\
								<span class="list-items-book-fields-author__title">Автор:</span>\
								<span class="authorList">' + object.author + '</span>\
							</div>\
							<div class="list-items-book-fields-name">\
								<span class="list-items-book-fields-name__title">Название:</span>\
								<span class="nameBookList">' + object.nameBook + '</span>\
							</div>\
							<div class="list-items-book-fields-name">\
								<span class="list-items-book-fields-name__title">Год издания:</span>\
								<span class="yearList">' + object.year + '</span>\
							</div>\
							<div class="list-items-book-fields-name">\
								<span class="list-items-book-fields-name__title">Кол-во страниц:</span>\
								<span class="pagesList">' + object.pages + '</span>\
							</div>\
						</div>\
						<div class="list-items-book-action">\
							<span class="list-items-book-action-link" id="listButtons">\
								<a class="list-items-book-action-link__edit" href="#" id="editBookList" data-id="' + object.id + '">Edit</a>&nbsp;|&nbsp;\
								<a class="list-items-book-action-link__remove" href="#" id="removeBookList" data-id="' + object.id + '">Remove</a>\
							</span>\
						</div>\
					</div>';
			document.getElementById('list-books').innerHTML += html;
		}

///////////////////////Удаление из хранилище////////////////////////////

		function deleteFromLocalStorage(id){
			var store = getFromLocalStorage('books');
			for (var i = Object.keys(store).length - 1; i >= 0; i--) {
				if(Object.keys(store[i]) != 0) {
					if (id == i) {
						store[i] = {};
					}
				}
			}
			setToLocalStorage('books', store);
		}

///////////////////////Итерация////////////////////////////////////

		function iterateLocalStorage(callback){

			var store = getFromLocalStorage('books');

			for (var i = Object.keys(store).length - 1; i >= 0; i--) {
				if (Object.keys(store[i]) != 0) {
					callback(i, store[i]);
				}
			}

		}

///////////////////////Добавление в хранилище////////////////////////////////////

		function addToLocalStorage (object) {
			var store = getFromLocalStorage('books');
			var id;

			if (Object.keys(store).length == 0) {
				id = 0;
			} else {
				id = Object.keys(store).length;
			}

			store[id] = {
				id: id,
				author: object.author,
				year: object.year,
				nameBook: object.nameBook,
				pages: object.pages
			}

			setToLocalStorage('books', store);
		}

///////////////////////Обновление хранилища///////////////////////////////////

		function updateLocalStorage (object) {
			var store = getFromLocalStorage('books');

			for (var i = Object.keys(store).length - 1; i >= 0; i--) {
				if (Object.keys(store[i]) != 0) {
					if (object.id == i) {
						store[i].author = object.author;
						store[i].year = object.year;
						store[i].nameBook = object.nameBook;
						store[i].pages = object.pages;
					}
				}
			}

			setToLocalStorage('books', store);
		}

///////////////////////Установка///////////////////////////////////

		function setToLocalStorage(key, object) {
			localStorage.setItem(key, JSON.stringify(object));
		}

///////////////////////Получение///////////////////////////////////

		function getFromLocalStorage(key) {
			return JSON.parse(localStorage.getItem(key));
		}
	
})();