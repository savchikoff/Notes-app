import { Button, Input } from "antd";
import { useState } from "react";
import "./NoteItem.scss"

const { TextArea } = Input;

interface INoteItem {
    text: string;
    onDelete: () => void;
    onEdit: (newText: string) => void;
    highlightTags: (note: string) => JSX.Element;
}

const NoteItem: React.FC<INoteItem> = ({ text, onDelete, onEdit, highlightTags }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        setIsEditing(false);
        onEdit(editedText);
    }
    return (
        <li className="noteItem-content">
            {isEditing ? (
                <TextArea
                    rows={2}
                    value={editedText}
                    maxLength={1200}
                    onChange={(e) => setEditedText(e.target.value)}
                />
            ) : (
                <div>{highlightTags(text)}</div>
            )}
            <div className="noteItem-buttons">
                <Button onClick={isEditing ? handleSave : handleEdit} type="primary">
                    {isEditing ? "Save" : "Edit"}
                </Button>
                <Button onClick={onDelete} type="primary" danger>
                    Delete
                </Button>
            </div>
        </li >
    )
}

export default NoteItem;