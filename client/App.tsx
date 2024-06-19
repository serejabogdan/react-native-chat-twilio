import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View} from 'react-native';
import {
  Client as TwilioClient,
  type Conversation,
  type Message,
} from '@twilio/conversations';

// NOTE docs for client https://sdk.twilio.com/js/conversations/releases/2.1.0/docs/index.html

// CHANGE IT BY YOURS LOCAL IP
const API_BASE = 'http://192.168.0.106:4000';

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
  const [input, setInput] = useState('');

  useEffect(() => {
    const initClient = async () => {
      const result = await fetch(
        `${API_BASE}/twilio-token?identity=${identity}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        },
      );
      const {token} = await result.json();
      const newClient = new TwilioClient(token);
      const {sid} = await fetch(`${API_BASE}/conversations`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }).then(v => v.json());

      const conversation = await newClient.getConversationBySid(sid);

      conversation.on('messageAdded', message => {
        console.log(message);
        setMessages(prevMessages =>
          !prevMessages ? [] : [...prevMessages, message],
        );
      });

      const messages = await conversation.getMessages();

      setClient(newClient);
      setConversation(conversation);
      setMessages(messages.items);
    };

    initClient();

    return () => {
      if (client) {
        client.shutdown();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (conversation && input) {
      await conversation.sendMessage(input);
      setInput('');
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
      {!messages.length ? (
        <View>
          <Text>No messages</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.sid}
          renderItem={({item}) => (
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}>
              <Text>{item.author}</Text>
              <Text>{item.body}</Text>
            </View>
          )}
        />
      )}
      <TextInput
        value={input}
        onChangeText={setInput}
        style={{borderWidth: 1, padding: 5, marginVertical: 10}}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
