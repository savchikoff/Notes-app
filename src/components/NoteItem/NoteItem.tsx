import { Button, Input, Tag } from "antd";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import notesStore from "../../stores/notes-store"
import { NotificationManager } from 'react-notifications';
import "./NoteItem.scss"

const { TextArea } = Input;

interface INoteItem {
    text: string;
    header: string;
    tags: string[];
    id: string;
    highlightTags: () => JSX.Element;
}

const NoteItem: React.FC<INoteItem> = ({ text, header, tags, id, highlightTags }) => {

    const { editNote, deleteNote } = notesStore;
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const [editedHeader, setEditedHeader] = useState(header);


    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        if (editedText.trim() !== "" && editedHeader.trim() !== "") {
            if (notesStore.isCorrectTag(editedText)) {
                setIsEditing(false);
                editNote(id, editedText, editedHeader);
            } else {
                NotificationManager.warning('Тег в заметке не может содержать более 50 символов', 'Исправьте ввод', 3000);
            }
        } else {
            NotificationManager.warning('Вы заполнили не все поля', 'Исправьте ввод', 3000);
        }
    }
    return (
        <li>
            <div className="noteItem-content">
                {isEditing ? (
                    <div className="noteItem-editing">
                        <label htmlFor="">
                            New header
                            <Input value={editedHeader} maxLength={26} onChange={(e) => setEditedHeader(e.target.value)} />
                        </label>
                        <label htmlFor="">
                            New text
                            <TextArea
                                rows={8}
                                value={editedText}
                                maxLength={1200}
                                onChange={(e) => setEditedText(e.target.value)}
                            />
                        </label>
                    </div>
                ) : (
                    <div>{highlightTags()}</div>
                )}
                <div className="noteItem-buttons">
                    <Button onClick={isEditing ? handleSave : handleEdit} type="primary">
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button onClick={() => deleteNote(id)} type="primary" danger>
                        Delete
                    </Button>
                </div>
            </div>
            <div className="noteItem-tags">
                {tags.filter(tag => text.includes(tag)).map((tag, index) => (
                    <Tag key={index} bordered={false}>
                        {tag}
                    </Tag>
                ))}
            </div>
        </li >
    )
}

const NoteItemObserver = observer(NoteItem);

export default NoteItemObserver;