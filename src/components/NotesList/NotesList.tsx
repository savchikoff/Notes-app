import "./NotesList.scss";
import "../Container.css"
import 'react-notifications/lib/notifications.css';
import NotesForm from "../NotesForm/NotesForm";
// import NoteItem from "../NoteItem/NoteItem";
import { useEffect, useState, useId, useCallback, useDeferredValue, Suspense, lazy } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Tag, Input } from "antd";
import { v4 as uuidv4 } from 'uuid';
const NoteItem = lazy(() => import('../NoteItem/NoteItem'));

interface INote {
    id: string;
    header: string;
    text: string;
}

const { Search } = Input;
const { CheckableTag } = Tag;


const NotesList: React.FC = () => {
    const uniqueId = uuidv4();

    const [newNoteText, setNewNoteText] = useState("");
    const [newNoteHeader, setNewNoteHeader] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
    const storedNotes = localStorage.getItem('notes');

    const initialNotes: INote[] = storedNotes ? JSON.parse(storedNotes) : [{}];
    const [notes, setNotes] = useState<INote[]>(initialNotes);

    const [tags, setTags] = useState<Array<string>>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    const isCorrectTag = (note: string): boolean => {
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

    const findAllTags = (notes: INote[]): string[] => {
        const regex = /#[a-zA-ZА-Яа-я0-9_-]+/g;
        let resultTags: string[] = [];
        notes.forEach(({ text }) => {
            if (typeof text === 'string') {
                const matches = text.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        resultTags.push(match);
                    });
                }
            }
        });
        return Array.from(new Set(resultTags));
    };

    const findNoteByHeader = (notes: INote[]): INote[] => {
        return notes.filter(note => note.header.includes(query));
    }

    const highlightMatches = (note: INote, tags: string[]): JSX.Element => {
        const { text, header } = note;
        if (!text || typeof text !== 'string') {
            return <p className="noteItem-text"></p>;
        }

        const regex = new RegExp(tags.join("|"), "gi");
        const highlightedNote = text.replace(regex, match => `<span class="highlight">${match}</span>`);

        return (
            <>
                <h2>{note.header}</h2>
                <p className="noteItem-text" dangerouslySetInnerHTML={{ __html: highlightedNote }}></p>
            </>
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
        setTags(findAllTags(notes));
    }, [notes]);

    useEffect(() => {
        const notesWithTags = notes.filter((note) =>
            selectedTags.some((selectedTag) => note.text.includes(selectedTag))
        );
        setFilteredNotes(notesWithTags);
    }, [notes, selectedTags]);


    const addNote = () => {
        if (newNoteText.trim() !== "" && newNoteHeader.trim() !== "") {
            if (isCorrectTag(newNoteText)) {
                const newNoteItem: INote = { id: uniqueId, header: newNoteHeader, text: newNoteText.replace(/\n/g, '<br/>') };
                setNotes((prevNotes) => [...prevNotes, newNoteItem]);
                setNewNoteText('');
                setNewNoteHeader('');
            } else {
                NotificationManager.warning('Тег в заметке не может содержать более 50 символов', 'Исправьте ввод', 3000);
            }
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

    const editNote = (index: string, text: string, header: string) => {
        setNotes((prevNotes) => {
            return prevNotes.map(item => {
                return item.id === index ? { ...item, text: text, header: header } : item;
            });
        });
    }

    const filterNotes = (note: INote) => {
        return note.header.toLowerCase().includes(deferredQuery.toLowerCase());
    };

    const handleTagsChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };


    return (
        <div className="noteList container">
            <h1 className="notesList-header">My notes 📝</h1>
            <NotesForm newNoteText={newNoteText} setNewNoteText={setNewNoteText} newNoteHeader={newNoteHeader} setNewNoteHeader={setNewNoteHeader} addNote={addNote} />
            <div className="notesList-searchSection">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="🔍 Search for the note" maxLength={26} />
                <div className="notesList-tags">
                    {tags.map((tag, index) => (
                        <CheckableTag style={{ border: "1px solid #d9d9d9" }} key={index} checked={selectedTags.includes(tag)} onChange={(checked) => handleTagsChange(tag, checked)}>
                            {tag}
                        </CheckableTag>
                    ))
                    }
                </div>
            </div>
            <div className="notesList-allNotes">
                <Suspense fallback={<h2>Loading...</h2>}>
                    <ul className="notesList-list">
                        {(selectedTags.length > 0 ? filteredNotes : notes)
                            .filter(filterNotes) // Фильтрация заметок по запросу
                            .map((note) => (
                                <NoteItem
                                    key={note.id}
                                    text={note.text}
                                    header={note.header}
                                    tags={tags}
                                    onDelete={() => deleteNote(note.id)}
                                    onEdit={(newText: string, newHeader: string) => editNote(note.id, newText, newHeader)}
                                    highlightTags={() => highlightMatches(note, tags)}
                                />
                            ))}
                    </ul>
                </Suspense>
            </div>
            <NotificationContainer />
        </div >
    )
}

export default NotesList;