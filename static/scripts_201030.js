document.addEventListener('DOMContentLoaded', () => {
    // Make objects to insert new editors into
    let intro, chapter, authorNote;
    intro = {editor: ""};
    chapter = {editor: ""};
    authorNote = {editor: ""};
    makeEditor('#introEditor', intro);
    makeEditor('#chapterEditor', chapter);
    makeEditor('#authorNoteEditor', authorNote);

    let storedIntro = localStorage.getItem('introData');
    if (storedIntro) {
        waitEditor(intro, storedIntro);
    }
        
    // Add conversion handler to Convert button click event
    const convertBtn = document.getElementById("convert");
    convertBtn.addEventListener("click", () => {
        // Get input data
        let introData = intro.editor.getData();
        let prevLink = document.getElementById("prevLink").value;
        let chapterData = chapter.editor.getData();
        let authorNoteData = authorNote.editor.getData();

        localStorage.setItem('introData', introData);

        // Get output textarea
        let output = document.getElementById("output");

        // If previous chapter link exists, add it to intro
        if (prevLink) {
            introData = introData.replace("[Previous Chapter]", `[<a href=\"${prevLink}\">Previous Chapter</a>]`)
        }
        
        
        // Convert HTML text to Markdown (add formatting as well)
        let turndownService = new TurndownService();
        if (introData) {
            introData = turndownService.turndown(introData) + "\n\n&nbsp;\n\n";
        }
        chapterData = turndownService.turndown(chapterData);
        if (authorNoteData){
            authorNoteData = `<blockquote><p><strong>Author's Note:</strong></p>${authorNoteData}</blockquote>`;
            authorNoteData = "\n\n&nbsp;\n\n" + turndownService.turndown(authorNoteData);
        }

        // Concatenate markdown data
        let markdown = `${introData}${chapterData}${authorNoteData}`

        // Insert data into output textarea
        output.value = markdown;
    });
});

// Create rich text editor, then assign new editor to passed object
function makeEditor(id, obj) {
    ClassicEditor
        .create( document.querySelector( id ), {
            toolbar: [ 'bold', 'italic', 'Link', 'horizontalLine', 'blockQuote' ],
            class: [ 'chapterTextArea' ]
        } )
        .then( newEditor => {
            obj.editor = newEditor;
        } )
        .catch( error => {
            console.error( error );
        } );
}

// Timeout promise for async
function resolveAfter100ms(obj, data) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
}

// Wait for editor to initialize then fill with given data
async function waitEditor(obj, data) {
    if (obj.editor) {
        obj.editor.setData(data);
    } else {
        await resolveAfter100ms();
        waitEditor(obj, data);
    }
}