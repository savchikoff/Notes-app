import "./NotesList.scss";
import "../Container.css"
import NotesForm from "../NotesForm/NotesForm";
import NoteItem from "../NoteItem/NoteItem";
import { useEffect, useState, useRef } from "react";
import { Tag } from "antd";


const NotesList: React.FC = () => {
    const [newNote, setNewNote] = useState('');
    const storedNotes = localStorage.getItem('notes');

    const initialNotes: string[] = storedNotes ? JSON.parse(storedNotes) : [];

    const [notes, setNotes] = useState<string[]>(initialNotes);

    const [tags, setTags] = useState<Array<string>>([]);

    const findTagsAll = (notes: string[]): string[] => {
        const regex = /#[a-zA-Z0-9_]+/g;
        let resultTags: string[] = [];
        notes.forEach((note, index) => {
            const matches = note.match(regex);
            if (matches) {
                matches.forEach(match => {
                    resultTags.push(match);
                })
            }
        });
        return Array.from(new Set(resultTags));
    };

    const highlightMatches = (note: string, tags: string[]): JSX.Element => {
        const regex = new RegExp(tags.join("|"), "gi");
        const highlightedNote = note.replace(regex, match => `<span class="highlight">${match}</span>`);

        return (
            <p className="noteItem-text" dangerouslySetInnerHTML={{ __html: highlightedNote }}></p>
        );
    }

    useEffect(() => {
        console.log("Get Items");
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        }
    }, []);


    useEffect(() => {
        console.log('Update Items');
        localStorage.setItem('notes', JSON.stringify(notes));
        setTags(findTagsAll(notes));
    }, [notes]);


    const addNote = () => {
        if (newNote.trim() !== "") {
            setNotes((prevNotes) => [...prevNotes, newNote]);
            setNewNote('');
        }
    }

    const deleteNote = (index: number) => {
        setNotes((prevNotes) => {
            const updateNotes = [...prevNotes];
            updateNotes.splice(index, 1);
            return updateNotes;
        })
    }

    const editNote = (index: number, text: string) => {
        setNotes((prevNotes) => {
            const updatedNotes = [...prevNotes];
            updatedNotes[index] = text;
            return updatedNotes;
        });
    }


    return (
        <div className="noteList container">
            <h1 className="notesList-header">My notes!</h1>
            <NotesForm newNote={newNote} setNewNote={setNewNote} addNote={addNote} />
            {tags.map((tag, index) => (
                <Tag key={index} bordered={false}>
                    {tag}
                </Tag>
            ))
            }
            <ul className="notesList-list">
                {notes.map((note: string, index) => {
                    return <NoteItem
                        key={index}
                        text={note}
                        onDelete={() => deleteNote(index)}
                        onEdit={(newText: string) => editNote(index, newText)}
                        highlightTags={(note: string) => highlightMatches(note, tags)} />
                })}
            </ul>
        </div >
    )
}

export default NotesList;