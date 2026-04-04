import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getMyWorkerProfileApi } from '../api/workerApi';
import { getMyPolicyApi, getPolicyQuoteApi } from '../api/policyApi';
import { getLatestRiskApi, recalculateRiskApi } from '../api/riskApi';
import { getMyClaimsApi } from '../api/claimApi';
import { getMyPayoutsApi } from '../api/payoutApi';
import { useAuth } from '../auth/AuthContext';

const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const DashboardScreen = ({ navigation }) => {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [quote, setQuote] = useState(null);
  const [risk, setRisk] = useState(null);
  const [claims, setClaims] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const loadData = async () => {
    try {
      const [
        profileRes,
        policyRes,
        quoteRes,
        riskRes,
        claimsRes,
        payoutsRes
      ] = await Promise.all([
        getMyWorkerProfileApi(),
        getMyPolicyApi(),
        getPolicyQuoteApi(),
        getLatestRiskApi(),
        getMyClaimsApi(),
        getMyPayoutsApi()
      ]);

      setProfile(profileRes.data);
      setPolicy(policyRes.data);
      setQuote(quoteRes.data);
      setRisk(riskRes.data);
      setClaims(claimsRes.data || []);
      setPayouts(payoutsRes.data || []);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to load dashboard');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecalculateRisk = async () => {
    try {
      await recalculateRiskApi();
      await loadData();
      Alert.alert('Success', 'Risk recalculated successfully');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to recalculate risk');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Elite Suraksha Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
        <Text style={styles.buttonText}>Edit Onboarding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#0f766e' }]} onPress={handleRecalculateRisk}>
        <Text style={styles.buttonText}>Recalculate Risk</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#b91c1c' }]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Card title="Worker Profile">
        <Text>City: {profile?.primaryCity || '-'}</Text>
        <Text>Platform: {profile?.workPlatform || '-'}</Text>
        <Text>KYC: {profile?.kycStatus || '-'}</Text>
        <Text>Employment: {profile?.employmentStatus || '-'}</Text>
      </Card>

      <Card title="Policy Quote">
        <Text>Plan: {quote?.planName || '-'}</Text>
        <Text>Weekly Premium: ₹ {quote?.weeklyPremium || '-'}</Text>
      </Card>

      <Card title="Active Policy">
        {policy ? (
          <>
            <Text>Status: {policy.status}</Text>
            <Text>Coverage Start: {policy.coverageStart}</Text>
            <Text>Coverage End: {policy.coverageEnd}</Text>
            <Text>Premium: ₹ {policy.weeklyPremium}</Text>
          </>
        ) : (
          <Text>No active policy found.</Text>
        )}
      </Card>

      <Card title="Risk Snapshot">
        {risk ? (
          <>
            <Text>Total Risk Score: {String(risk.totalRiskScore)}</Text>
            <Text>Recommended Premium: ₹ {String(risk.recommendedPremium)}</Text>
          </>
        ) : (
          <Text>No risk snapshot found.</Text>
        )}
      </Card>

      <Card title="Claims">
        {claims.length === 0 ? (
          <Text>No claims found.</Text>
        ) : (
          claims.map((claim) => (
            <Text key={claim.id} style={{ marginBottom: 8 }}>
              {claim.triggerEvent?.triggerType} — {claim.status} — ₹ {String(claim.payoutAmount)}
            </Text>
          ))
        )}
      </Card>

      <Card title="Payouts">
        {payouts.length === 0 ? (
          <Text>No payouts found.</Text>
        ) : (
          payouts.map((payout) => (
            <Text key={payout.id} style={{ marginBottom: 8 }}>
              {payout.claim?.triggerEvent?.triggerType || 'Claim'} — {payout.status} — ₹ {String(payout.amount)}
            </Text>
          ))
        )}
      </Card>
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
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
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
  }
});

export default DashboardScreen;