import { Button, Input, Tag } from "antd";
import { useState } from "react";
import "./NoteItem.scss"

const { TextArea } = Input;

interface INoteItem {
    text: string;
    tags: string[];
    onDelete: () => void;
    onEdit: (newText: string) => void;
    highlightTags: () => JSX.Element;
}

const NoteItem: React.FC<INoteItem> = ({ text, tags, onDelete, onEdit, highlightTags }) => {
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
        <li>
            <div className="noteItem-content">
                {isEditing ? (
                    <TextArea
                        rows={2}
                        value={editedText}
                        maxLength={1200}
                        onChange={(e) => setEditedText(e.target.value)}
                    />
                ) : (
                    <div>{highlightTags()}</div>
                )}
                <div className="noteItem-buttons">
                    <Button onClick={isEditing ? handleSave : handleEdit} type="primary">
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button onClick={onDelete} type="primary" danger>
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

export default NoteItem;