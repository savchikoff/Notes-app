import { Button, Input, Tag } from "antd";
import { useState } from "react";
import "./NoteItem.scss"

const { TextArea } = Input;

interface INoteItem {
    text: string;
    header: string;
    tags: string[];
    onDelete: () => void;
    onEdit: (newText: string, newHeader: string) => void;
    highlightTags: () => JSX.Element;
}

const NoteItem: React.FC<INoteItem> = ({ text, header, tags, onDelete, onEdit, highlightTags }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const [editedHeader, setEditedHeader] = useState(header);


    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        setIsEditing(false);
        onEdit(editedText, editedHeader);
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