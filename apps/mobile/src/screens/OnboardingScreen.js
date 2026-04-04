import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { getMyWorkerProfileApi, saveWorkerProfileApi, startVerificationApi } from '../api/workerApi';
import { useAuth } from '../auth/AuthContext';

const OnboardingScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    primaryCity: '',
    homeLatitude: '',
    homeLongitude: '',
    workPlatform: '',
    aadhaarHash: '',
    autopayEnabled: false
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getMyWorkerProfileApi();
        const profile = result.data;

        if (profile) {
          setForm({
            fullName: profile.fullName || '',
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
            primaryCity: profile.primaryCity || '',
            homeLatitude: profile.homeLatitude ? String(profile.homeLatitude) : '',
            homeLongitude: profile.homeLongitude ? String(profile.homeLongitude) : '',
            workPlatform: profile.workPlatform || '',
            aadhaarHash: profile.aadhaarHash || '',
            autopayEnabled: Boolean(profile.autopayEnabled)
          });
        }
      } catch (err) {
        console.log(err?.response?.data || err.message);
      }
    };

    loadProfile();
  }, []);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await saveWorkerProfileApi(form);
      Alert.alert('Success', 'Worker profile saved successfully');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save profile');
    }
  };

  const handleStartVerification = async () => {
    try {
      await startVerificationApi({
        kycRequested: true,
        employmentRequested: true
      });
      Alert.alert('Success', 'Verification started successfully');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to start verification');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Worker Onboarding</Text>
      <Text style={styles.info}>Logged in as {user?.phone}</Text>

      <TextInput style={styles.input} placeholder="Full name" value={form.fullName} onChangeText={(v) => setField('fullName', v)} />
      <TextInput style={styles.input} placeholder="Date of birth (YYYY-MM-DD)" value={form.dateOfBirth} onChangeText={(v) => setField('dateOfBirth', v)} />
      <TextInput style={styles.input} placeholder="Primary city" value={form.primaryCity} onChangeText={(v) => setField('primaryCity', v)} />
      <TextInput style={styles.input} placeholder="Home latitude" value={form.homeLatitude} onChangeText={(v) => setField('homeLatitude', v)} />
      <TextInput style={styles.input} placeholder="Home longitude" value={form.homeLongitude} onChangeText={(v) => setField('homeLongitude', v)} />
      <TextInput style={styles.input} placeholder="Work platform" value={form.workPlatform} onChangeText={(v) => setField('workPlatform', v)} />
      <TextInput style={styles.input} placeholder="Aadhaar hash" value={form.aadhaarHash} onChangeText={(v) => setField('aadhaarHash', v)} />

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Enable AutoPay</Text>
        <Switch
          value={form.autopayEnabled}
          onValueChange={(v) => setField('autopayEnabled', v)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleStartVerification}>
        <Text style={styles.buttonText}>Start Verification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#0f766e' }]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#b91c1c' }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f7fb'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8
  },
  info: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12
  },
  button: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchText: {
    fontSize: 16
  }
});

export default OnboardingScreen;