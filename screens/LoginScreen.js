import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../services/firebase";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      const phoneProvider = new PhoneAuthProvider(auth);
      const vid = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current,
      );
      setVerificationId(vid);
      Alert.alert("Verification code has been sent to your phone");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmVerificationCode = async () => {
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode,
      );
      await signInWithCredential(auth, credential);
      // Auth status will be updated in useAuth hook
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      <View style={styles.content}>
        <Text style={styles.title}>iChat Login</Text>
        <Text style={styles.subtitle}>The Next Gen Chat App in Old Style</Text>

        {!verificationId ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="+91 123 456 7890"
              placeholderTextColor="#999"
              autoCompleteType="tel"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={sendVerificationCode}
              disabled={!phoneNumber || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>SEND OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Verification Code"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={confirmVerificationCode}
              disabled={!verificationCode || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>VERIFY CODE</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVerificationId("")}
              style={styles.resend}
            >
              <Text style={styles.resendText}>Resend Phone Number?</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    borderWidth: 10,
    borderColor: "#000",
    borderRadius: 20,
    margin: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 2,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 18,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  resend: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
