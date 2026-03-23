import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';

export default function ChatListScreen({ navigation }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    // Listen to all users except current user
    const usersQuery = query(collection(db, 'users'), where('uid', '!=', user.uid));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setLoading(false);
    });

    // Listen to chat metadata for last messages
    const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      const chatsData = {};
      snapshot.docs.forEach(doc => {
        chatsData[doc.id] = doc.data();
      });
      setLastMessages(chatsData);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeChats();
    };
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }) => {
    const chatId = getChatId(user.uid, item.uid);
    const lastMsg = lastMessages[chatId]?.lastMessage || item.status;
    
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => navigation.navigate('Chat', { chatId, name: item.name, otherUserId: item.uid })}
      >
        <View style={styles.avatarContainer}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{item.name?.[0]?.toUpperCase()}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name.toUpperCase()}</Text>
          <Text style={styles.status} numberOfLines={1}>{lastMsg}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>></Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OLD STYLE SMS</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#000" size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>NO CONTACTS FOUND</Text>}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoutBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  logoutText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  status: {
    fontSize: 13,
    color: '#666',
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    letterSpacing: 2,
  },
});
