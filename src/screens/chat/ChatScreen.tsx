import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  StatusBar
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { chatService, ChatMessage } from '../../services/chatService';
import { useAuthStore } from '../../store/useAuthStore';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ChatScreen({ route }: any) {
  const { colors, sizes, shadows } = useTheme();
  const navigation = useNavigation();
  const { ride } = route.params || {};
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  React.useEffect(() => {
    if (!ride?.id) return;
    const unsubscribe = chatService.subscribeToMessages(ride.id, (newMessages) => {
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, [ride?.id]);

  const sendMessage = async () => {
    if (!message.trim() || !ride?.id || !user?.id) return;
    
    try {
      const textToSend = message;
      setMessage('');
      await chatService.sendMessage(
        ride.id,
        textToSend,
        user.id,
        user.role || 'passenger'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.white }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.black }]}>
            {ride?.riderName || 'Amit Sharma'}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
            <Text style={[styles.statusText, { color: colors.gray500 }]}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerAction}>
          <Icon name="phone" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View 
            entering={FadeIn}
            style={[
              styles.messageBubble,
              item.senderId === user?.id ? styles.myBubble : styles.theirBubble,
              { backgroundColor: item.senderId === user?.id ? colors.black : colors.gray100 }
            ]}
          >
            <Text style={[
              styles.messageText,
              { color: item.senderId === user?.id ? colors.white : colors.black }
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.timeText,
              { color: item.senderId === user?.id ? colors.gray400 : colors.gray500 }
            ]}>
              {item.createdAt?.seconds 
                ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '...'}
            </Text>
          </Animated.View>
        )}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />

      <View style={[styles.inputContainer, { borderTopColor: colors.gray100 }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="plus" size={24} color={colors.gray400} />
        </TouchableOpacity>
        
        <View style={[styles.inputWrapper, { backgroundColor: colors.gray50 }]}>
          <TextInput
            style={[styles.input, { color: colors.black }]}
            placeholder="Message..."
            placeholderTextColor={colors.gray400}
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          style={[
            styles.sendButton, 
            { backgroundColor: message.trim() ? colors.black : colors.gray200 }
          ]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Icon name="arrow-up" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderBottomWidth: 1, 
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  name: { 
    fontSize: 17, 
    fontWeight: '800', 
    letterSpacing: -0.3 
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: { 
    padding: 20 
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  myBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: { 
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  timeText: { 
    fontSize: 10, 
    fontWeight: '600',
    alignSelf: 'flex-end', 
    marginTop: 4 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  attachButton: { 
    padding: 8,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
