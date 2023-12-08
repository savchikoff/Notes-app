import "./NotesForm.scss";
import { Input, Button } from 'antd';
import notesStore from "../../stores/notes-store"
import { observer } from "mobx-react-lite";
const { TextArea } = Input;


const NotesForm: React.FC = () => {
    const { newNoteHeader, newNoteText, addNote, setNewNoteHeader, setNewNoteText } = notesStore;

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNoteHeader(e.target.value);
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNoteText(e.target.value);
    }

    return (
        <div className="form-content">
            <Input
                placeholder="Enter a header to the note"
                maxLength={26}
                value={newNoteHeader}
                onChange={handleHeaderChange}
            />
            <TextArea rows={4}
                placeholder="Enter a new note here (max-length: 1200 symbols)"
                maxLength={1200}
                value={newNoteText}
                onChange={handleTextChange} />
            <Button type="primary" block onClick={addNote}>
                Add new note
            </Button>
        </div>
    )
}

const NotesFormObserver = observer(NotesForm);

export default NotesFormObserver;