class Draft {
  constructor(id = null, mainTitle = '', mainDescription = '', subTopics = []) {
    this.id = id || this.generateId();
    this.mainTitle = mainTitle;
    this.mainDescription = mainDescription;
    this.subTopics = subTopics;
  }

  // Generate a unique ID for the draft
  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Save or update draft in localStorage
  save() {
    let drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
    const draftIndex = drafts.findIndex((draft) => draft.id === this.id);

    if (draftIndex >= 0) {
      drafts[draftIndex] = this; // Update existing draft
    } else {
      drafts.push(this); // Add new draft
    }

    localStorage.setItem('blogDrafts', JSON.stringify(drafts));
  }

  // Load draft by ID from localStorage
  load(id) {
    const drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
    const draft = drafts.find((draft) => draft.id === id);

    if (draft) {
      this.id = draft.id;
      this.mainTitle = draft.mainTitle;
      this.mainDescription = draft.mainDescription;
      this.subTopics = draft.subTopics;
    }
  }

  // Delete draft by ID
  static delete(id) {
    let drafts = JSON.parse(localStorage.getItem('blogDrafts')) || [];
    drafts = drafts.filter((draft) => draft.id !== id);
    localStorage.setItem('blogDrafts', JSON.stringify(drafts));
  }

  // Retrieve all drafts
  static getAllDrafts() {
    return JSON.parse(localStorage.getItem('blogDrafts')) || [];
  }
}

import React, { useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Draft from './path/to/DraftClass'; // Adjust the import path

const BlogEditor = () => {
  const [draft, setDraft] = useState(new Draft());
  const [editorInstance, setEditorInstance] = useState(null);
  const [allDrafts, setAllDrafts] = useState([]);

  useEffect(() => {
    // Initialize EditorJS for subtopics
    const editor = new EditorJS({
      holder: 'editorjs',
      // Add your EditorJS configurations here
    });
    setEditorInstance(editor);

    // Load all drafts from localStorage
    const drafts = Draft.getAllDrafts();
    setAllDrafts(drafts);
  }, []);

  const saveDraft = async () => {
    if (editorInstance) {
      const editorData = await editorInstance.save();
      draft.addOrUpdateSubTopicWithEditor(0, 'Subtopic Title', editorData);
      draft.save();
      setDraft(new Draft()); // Reset the form after saving
      setAllDrafts(Draft.getAllDrafts()); // Update the list of drafts
    }
  };

  const loadDraft = (id) => {
    const loadedDraft = new Draft();
    loadedDraft.load(id);
    setDraft(loadedDraft);
  };

  const deleteDraft = (id) => {
    Draft.delete(id);
    setAllDrafts(Draft.getAllDrafts()); // Update the list of drafts
  };

  return (
    <div>
      <div>
        <h2>All Drafts</h2>
        <ul>
          {allDrafts.map((draft) => (
            <li key={draft.id}>
              <span>{draft.mainTitle}</span>
              <button onClick={() => loadDraft(draft.id)}>Edit</button>
              <button onClick={() => deleteDraft(draft.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type="text"
          placeholder="Main Title"
          value={draft.mainTitle}
          onChange={(e) => setDraft({ ...draft, mainTitle: e.target.value })}
        />
        <textarea
          placeholder="Main Description"
          value={draft.mainDescription}
          onChange={(e) => setDraft({ ...draft, mainDescription: e.target.value })}
        />
        <div id="editorjs"></div>
        <button onClick={saveDraft}>Save Draft</button>
      </div>
    </div>
  );
};

export default BlogEditor;

useEffect(() => {
  if (typeof window !== 'undefined') {
    // Load all drafts from localStorage
    const drafts = Draft.getAllDrafts();
    setAllDrafts(drafts);
  }
}, []);

function uploadImageToBackend(base64String, fileName) {
  // Convert the Base64 string back to a Blob
  const byteString = atob(base64String.split(',')[1]);
  const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], fileName, { type: mimeString });

  // Now you can upload the file to the backend
  return MyAjax.upload(file).then(() => {
    return {
      success: 1,
      file: {
        url: "http://localhost:8008/uploads/" + fileName,
      },
    };
  });
}

function uploadImageFromUrl(imageUrl, fileName) {
  return fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const file = new File([blob], fileName, { type: blob.type });

      // Now you can upload the file to the backend
      return MyAjax.upload(file).then(() => {
        return {
          success: 1,
          file: {
            url: "http://localhost:8008/uploads/" + fileName,
          },
        };
      });
    });
}

function base64ToFile(base64String, fileName, mimeType) {
  // Decode the Base64 string to binary data
  const byteString = atob(base64String.split(',')[1]);

  // Create an array buffer to store the binary data
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Fill the array buffer with binary data
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob object from the binary data
  const blob = new Blob([arrayBuffer], { type: mimeType });

  // Convert the Blob to a File object (if needed)
  const file = new File([blob], fileName, { type: mimeType });

  return file;
}

// Example usage:
// Assume you have a Base64 string and its original file information
const base64String = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
const fileName = "example.png";
const mimeType = "image/png";

const file = base64ToFile(base64String, fileName, mimeType);

// Now you have the `file` object, which you can upload or process further
console.log(file);
