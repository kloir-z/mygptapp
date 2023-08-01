import { TopbarContainer, StyledButton, StyledInput, StyledSelect, StyledOption } from './Topbar.styles';
import { ConversationType } from './Conversations.types';
import { v4 as uuidv4 } from 'uuid'; 

type TopbarProps = {
    conversations: ConversationType[];
    model: string;
    setModel: Function;
    apiKey: string;
    setApiKey: Function;
    activeConversation: ConversationType | null;
    setConversations: Function;
    setActiveConversation: Function;
    setShowMenu: Function;
  };

const createNewConversation = (): ConversationType => {
    return {
      id: uuidv4(),
      title: "New Conversation",
      revisions: [
        {
          revision: "0",
          conversation: [],
        },
      ],
    };
  };
  
const Topbar: React.FC<TopbarProps> = ({ apiKey, setApiKey, model, setModel, setConversations, setActiveConversation, setShowMenu }) => {

    const toggleMenu = () => {
        setShowMenu((prevState: Boolean) => !prevState);
    };
    return(
        <TopbarContainer>
            <StyledButton onClick={toggleMenu}>Menu</StyledButton>

            <StyledButton onClick={() => {
            const newConv = createNewConversation();
            setConversations((prev: ConversationType[]) => [...prev, newConv]);
            setActiveConversation(newConv);
            }}>New</StyledButton>
            
            <StyledInput type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="API Key" />

            <StyledSelect value={model} onChange={e => setModel(e.target.value)}>  
                <StyledOption value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</StyledOption>
                <StyledOption value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</StyledOption>
                <StyledOption value="gpt-4-0613">gpt-4-0613</StyledOption>
            </StyledSelect>
        </TopbarContainer>
    );
};

export default Topbar;