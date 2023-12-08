import "./NotesList.scss";
import "../Container.css"
import 'react-notifications/lib/notifications.css';
import NotesForm from "../NotesForm/NotesForm";
import NoteItem from "../NoteItem/NoteItem";
import { useEffect, useState, Suspense, lazy } from "react";
import { NotificationContainer } from 'react-notifications';
import { observer } from "mobx-react-lite"
import notesStore from "../../stores/notes-store"
import { Tag, Input } from "antd";

interface INote {
    id: string;
    header: string;
    text: string;
}
const { CheckableTag } = Tag;


const NotesList: React.FC = () => {
    const { notes } = notesStore;

    const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);

    const [tags, setTags] = useState<Array<string>>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [query, setQuery] = useState('');

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


    const highlightMatches = (note: INote, tags: string[]): JSX.Element => {
        const { text } = note;
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
        console.log('Update Items');
        localStorage.setItem('notes', JSON.stringify(notes));
        const updatedTags = findAllTags(notes);
        setTags(updatedTags);
    }, [notes]);

    useEffect(() => {
        const notesWithTags = notes.filter((note) =>
            selectedTags.some((selectedTag) => note.text.includes(selectedTag))
        );
        setFilteredNotes(notesWithTags);
    }, [notes, selectedTags]);


    const searchNotes = (note: INote) => {
        if (note !== undefined) {
            return note.header.toLowerCase().includes((query ?? '').toLowerCase());
        }
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
            <NotesForm />
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
                <ul className="notesList-list">
                    {(selectedTags.length > 0 ? filteredNotes : notes)
                        .filter(searchNotes)
                        .map((note) => (
                            <NoteItem
                                key={note.id}
                                text={note.text}
                                id={note.id}
                                header={note.header}
                                tags={tags}
                                highlightTags={() => highlightMatches(note, tags)}
                            />
                        ))}
                </ul>
            </div>
            <NotificationContainer />
        </div >
    )
}

const NotesListObserver = observer(NotesList)

export default NotesListObserver;