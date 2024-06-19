import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View} from 'react-native';
import {
  Client as TwilioClient,
  type Conversation,
  type Message,
} from '@twilio/conversations';

// NOTE docs for client https://sdk.twilio.com/js/conversations/releases/2.1.0/docs/index.html

const REACT_APP_PORT = process.env.REACT_APP_PORT;
const REACT_APP_BASE = process.env.REACT_APP_BASE;
const BASE = `${REACT_APP_BASE}:${REACT_APP_PORT}`;

export default function App() {
  // identity is a user identifier
  const [identity, setIdentity] = useState('');
  const [isChat, setIsChat] = useState(false);
  return isChat ? (
    <Chat identity={identity} />
  ) : (
    <View>
      <TextInput
        value={identity}
        onChangeText={setIdentity}
        style={{borderWidth: 1, padding: 5, marginVertical: 10}}
      />
      <Button title="Identity" onPress={() => setIsChat(true)} />
    </View>
  );
}

function Chat({identity}: {identity: string}) {
  const [client, setClient] = useState<TwilioClient | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    const initClient = async () => {
      const {token} = await fetch(`${BASE}/twilio-token?identity=${identity}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }).then(v => v.json());
      const newClient = new TwilioClient(token);

      // get conversation of some
      const {sid} = await fetch(`${BASE}/conversations`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }).then(v => v.json());

      // get conversation by its sid
      const conversation = await newClient.getConversationBySid(sid);

      // subscribe on new messages in current conversation
      conversation.on('messageAdded', message => {
        console.log(message);
        setMessages(prevMessages =>
          !prevMessages ? [message] : [...prevMessages, message],
        );
      });

      // get messages of conversation to initialize the chat
      const messages = await conversation.getMessages();

      setClient(newClient);
      setConversation(conversation);
      setMessages(messages.items);
    };

    initClient();

    return () => {
      if (client) {
        // remove all listeners
        client.shutdown();
      }
    };
  }, [identity, client]);

  const sendMessage = async (input: string) => {
    if (conversation && input) {
      await conversation.sendMessage(input);
    }
  };

  if (!messages) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 10}}>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </View>
  );
}

const MessageInput = ({onSend}: {onSend: (input: string) => void}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSend(input);
    setInput('');
  };

  return (
    <View>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={{borderWidth: 1, padding: 5, marginVertical: 10}}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const MessageList = ({messages}: {messages: Message[]}) => (
  <View>
    {!messages.length ? (
      <View>
        <Text>No messages</Text>
      </View>
    ) : (
      <FlatList
        data={messages}
        keyExtractor={item => item.sid}
        renderItem={({item}) => <MessageItem message={item} />}
      />
    )}
  </View>
);

const MessageItem = ({message}: {message: Message}) => (
  <View
    style={{
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    }}>
    <Text>{message.author}</Text>
    <Text>{message.body}</Text>
  </View>
);
