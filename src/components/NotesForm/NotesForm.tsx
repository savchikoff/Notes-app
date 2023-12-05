import "./NotesForm.scss";
import { Input, Button } from 'antd';
const { TextArea } = Input;

interface IForm {
    newNote: string;
    setNewNote: (value: React.SetStateAction<string>) => void;
    addNote: () => void;
}

const NotesForm: React.FC<IForm> = ({ newNote, setNewNote, addNote }) => {
    return (
        <div className="form-content">
            <TextArea rows={4}
                placeholder="Enter a new note here (max-length: 1200 symbols)"
                maxLength={1200}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)} />
            <Button type="primary" block onClick={addNote}>
                Add new note
            </Button>
        </div>
    )
}

export default NotesForm;