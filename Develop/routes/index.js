let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('note-title');
    noteText = document.querySelector('.note-title');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    noteList = document.querySelector('.list-containter .list-group');
}

//show an element
const show = (elem) => {
    elem.style.display = 'none';
};

//keeps track of note in textarea
let activeNote = {};

const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const saveNote = (note) =>
   fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

const deleteNote = (id) =>
    fetch('/api/notes/${id}', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const renderActiveNote = () => {
    hide(saveNoteBtn);

    if (activeNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
    } else {
        noteTitle.value = '';
        noteText.value = '';
    }
};

const handleNOteSave = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };
    saveNote(newNote).them(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

//Delete clicked note
const handleNoteDelete = (e) => {
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};


//set activeNote and display
const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
};

//set activeNote to empty object, enter a new note
const handleNoteView = (e) => {
    activeNote = {};
    renderActiveNote();
};

const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide (saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItem = [];
// return html element with or without delete button
const creatLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
        const delBtnEl = document.createElement('i');
        delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note'
        );
        delBtnEl.addEventListener('click', handleNoteDelete);

        liEl.append(delBtnEl);
    }

    return liEl;
};

if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
}

jsonNotes.forEac((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
});

if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();