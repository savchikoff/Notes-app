import "./NotesForm.scss";
import { Input, Button } from 'antd';
const { TextArea } = Input;

interface IForm {
    newNoteText: string;
    newNoteHeader: string;
    setNewNoteText: (value: React.SetStateAction<string>) => void;
    setNewNoteHeader: (value: React.SetStateAction<string>) => void;
    addNote: () => void;
}

const NotesForm: React.FC<IForm> = ({ newNoteText, setNewNoteText, newNoteHeader, setNewNoteHeader, addNote }) => {
    return (
        <div className="form-content">
            <Input
                placeholder="Enter a header to the note"
                maxLength={26}
                value={newNoteHeader} // Проверьте, что используется именно newNoteHeader
                onChange={(e) => setNewNoteHeader(e.target.value)}
            />
            <TextArea rows={4}
                placeholder="Enter a new note here (max-length: 1200 symbols)"
                maxLength={1200}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)} />
            <Button type="primary" block onClick={addNote}>
                Add new note
            </Button>
        </div>
    )
}

export default NotesForm;