import { v4 as uuidv4 } from 'uuid';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { action, makeObservable, observable } from "mobx";

interface INote {
    id: string;
    header: string;
    text: string;
}

class NotesStore {
    newNoteText = "";
    newNoteHeader = "";
    filteredNotes: INote[] = [];
    storedNotes = localStorage.getItem('notes');
    initialNotes: INote[] = this.storedNotes ? JSON.parse(this.storedNotes) : [{}];
    notes: INote[] = this.initialNotes;
    tags: string[] = [];
    selectedTags: string[] = [];

    constructor() {
        makeObservable(this, {
            newNoteText: observable,
            newNoteHeader: observable,
            notes: observable,
            addNote: action,
            setNotes: action,
            setNewNoteText: action,
            setNewNoteHeader: action

        });
    }

    isCorrectTag = (note: string): boolean => {
        const regex = /#[a-zA-ZА-Яа-я0-9_-]+/g;
        const matches = note.match(regex);
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].length >= 50) {
                    return false;
                }
            }
        }
        return true;
    }

    addNote = () => {
        const uniqueId = uuidv4();
        if (this.newNoteText.trim() !== "" && this.newNoteHeader.trim() !== "") {
            if (this.isCorrectTag(this.newNoteText)) {
                const newNoteItem: INote = { id: uniqueId, header: this.newNoteHeader, text: this.newNoteText.replace(/\n/g, '<br/>') };
                this.notes.push(newNoteItem);
                this.updateLocalStorage();
                this.newNoteText = "";
                this.newNoteHeader = "";
            } else {
                NotificationManager.warning('Тег в заметке не может содержать более 50 символов', 'Исправьте ввод', 3000);
            }
        } else {
            NotificationManager.warning('Вы заполнили не все поля', 'Исправьте ввод', 3000);
        }
    }

    updateLocalStorage = () => {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    deleteNote = (index: string) => {
        this.notes = this.notes.filter(note => note.id !== index);
    }

    editNote = (index: string, text: string, header: string) => {
        if (text.trim() !== "" && header.trim() !== "") {
            if (this.isCorrectTag(text)) {
                this.notes = this.notes.map(item => item.id === index ? item = { id: index, text: text, header: header } : item);
            } else {
                NotificationManager.warning('Тег в заметке не может содержать более 50 символов', 'Исправьте ввод', 3000);
            }
        } else {
            NotificationManager.warning('Вы заполнили не все поля', 'Исправьте ввод', 3000);
        }
    }

    setNotes = (notes: INote[]) => {
        this.notes = notes;
    }
    setNewNoteText = (text: string) => {
        this.newNoteText = text;
    }

    setNewNoteHeader = (header: string) => {
        this.newNoteHeader = header;
    }

}

export default new NotesStore();