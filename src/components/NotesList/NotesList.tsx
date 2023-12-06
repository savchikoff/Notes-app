import "./NotesList.scss";
import "../Container.css"
import NotesForm from "../NotesForm/NotesForm";
import NoteItem from "../NoteItem/NoteItem";
import { useEffect, useState, useId, useCallback } from "react";
import { Tag } from "antd";
import { CloseCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

interface INote {
    id: string;
    text: string;
}


const NotesList: React.FC = () => {
    const uniqueId = uuidv4();
    const { CheckableTag } = Tag;

    const [newNote, setNewNote] = useState("");
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
    const storedNotes = localStorage.getItem('notes');

    const initialNotes: INote[] = storedNotes ? JSON.parse(storedNotes) : [{}];
    const [notes, setNotes] = useState<INote[]>(initialNotes);

    const [tags, setTags] = useState<Array<string>>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const findAllTags = (notes: INote[]): string[] => {
        const regex = /#[a-zA-ZА-Яа-я0-9_-]+/g;
        let resultTags: string[] = [];
        notes.forEach(({ text }) => {
            if (typeof text === 'string') {
                const matches = text.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        if (match.length <= 50) {
                            resultTags.push(match);
                        }
                    });
                }
            }
        });
        return Array.from(new Set(resultTags));
    };

    const highlightMatches = (note: string | undefined | null, tags: string[]): JSX.Element => {
        if (!note || typeof note !== 'string') {
            return <p className="noteItem-text"></p>;
        }

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
            setNotes(JSON.parse(storedNotes).reverse());
        }
    }, []);


    useEffect(() => {
        console.log('Update Items');
        localStorage.setItem('notes', JSON.stringify(notes));
        setTags(findAllTags(notes));
    }, [notes]);

    useEffect(() => {
        const notesWithTags = notes.filter((note) =>
            selectedTags.some((selectedTag) => note.text.includes(selectedTag))
        );
        setFilteredNotes(notesWithTags);
    }, [notes, selectedTags]);


    const addNote = () => {
        if (newNote.trim() !== "") {
            const newNoteItem: INote = { id: uniqueId, text: newNote.replace(/\n/g, '<br/>') };
            setNotes((prevNotes) => [...prevNotes, newNoteItem]);
            setNewNote('');
        }
    }

    const deleteNote = (index: string) => {
        setNotes((prevNotes) => {
            const updateNotes = [...prevNotes];
            return updateNotes.filter(note => {
                return note.id !== index;
            });
        })
    }

    const editNote = (index: string, text: string) => {
        setNotes((prevNotes) => {
            return prevNotes.map(item => {
                return item.id === index ? { ...item, text: text } : item;
            });
        });
    }

    const handleTagsChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };


    return (
        <div className="noteList container">
            <h1 className="notesList-header">My notes!</h1>
            <NotesForm newNote={newNote} setNewNote={setNewNote} addNote={addNote} />
            <div className="notesList-allNotes">
                <div className="notesList-tags">
                    {tags.map((tag, index) => (
                        <CheckableTag style={{ border: "1px solid #d9d9d9" }} key={index} checked={selectedTags.includes(tag)} onChange={(checked) => handleTagsChange(tag, checked)}>
                            {tag}
                        </CheckableTag>
                    ))
                    }
                </div>
                <ul className="notesList-list">
                    {(selectedTags.length > 0 ? filteredNotes : notes).map((note) => {
                        return <NoteItem
                            key={note.id}
                            text={note.text}
                            tags={tags}
                            onDelete={() => deleteNote(note.id)}
                            onEdit={(newText: string) => editNote(note.id, newText)}
                            highlightTags={() => highlightMatches(note.text, tags)} />
                    })}
                </ul>
            </div>
        </div >
    )
}

export default NotesList;