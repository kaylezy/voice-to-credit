
import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from './BottomNav';
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const GENDERS = ['Male', 'Female', 'Other'];

export default function ProfileEditScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exists, setExists] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadProfile = async () => {
        try {
          setLoading(true);
          setError(null);

          const { data: u } = await supabase.auth.getUser();

          if (!active) return;

          setEmail(u.user?.email ?? '');

          const res = await apiFetch<any>('/api/profiles');

          if (!active) return;

          if (res.ok) {
            setExists(true);
            setFullName(res.data?.full_name ?? '');
            setPhone(res.data?.phone ?? '');
            setGender(res.data?.gender ?? '');
            setDob(res.data?.date_of_birth ?? '');
          } else if (res.status === 404) {
            setExists(false);
            setFullName('');
            setPhone('');
            setGender('');
            setDob('');
          } else {
            console.warn(
              '[profile-edit] profile load failed',
              res.status,
              res.error
            );

            setError(
              res.error === 'network_error'
                ? "Can't reach the server. Pull back and try again."
                : `Could not load your profile (${res.status} ${res.error}).`
            );
          }
        } catch (err) {
          console.warn('[profile-edit] unexpected load error', err);

          if (active) {
            setError("Something went wrong while loading your profile.");
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadProfile();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleSave = async () => {
    setError(null);

    if (!fullName.trim()) {
      return setError('Full name is required.');
    }

    if (
      dob.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())
    ) {
      return setError(
        'Date of birth must look like 1999-02-12.'
      );
    }

    setSaving(true);

    try {
      const res = await apiFetch('/api/profiles', {
        method: exists ? 'PATCH' : 'POST',
        body: {
          full_name: fullName.trim(),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          ...(gender ? { gender } : {}),
          ...(dob.trim() ? { date_of_birth: dob.trim() } : {}),
        },
      });

      if (!res.ok) {
        console.warn(
          '[profile-edit] save failed',
          res.status,
          res.error,
          JSON.stringify(res.fields ?? res.body)
        );

        return setError(
          `Could not save (${res.status} ${res.error}).`
        );
      }

      router.replace('/profile-saved');
    } catch (err) {
      console.warn('[profile-edit] unexpected save error', err);

      setError("Something went wrong while saving. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#0b4f8c"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0b4f8c"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {!exists && (
              <Text style={styles.noticeText}>
                You haven’t saved your profile yet. Fill in your details and save.
              </Text>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>

                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  maxLength={100}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                    },
                  ]}
                  value={email}
                  editable={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>

                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>

                <View style={styles.genderContainer}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setGender(g)}
                      style={[
                        styles.genderOption,
                        gender === g && styles.genderOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          gender === g && styles.genderTextSelected,
                        ]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Date of Birth (YYYY-MM-DD, optional)
                </Text>

                <TextInput
                  style={styles.input}
                  value={dob}
                  onChangeText={setDob}
                  placeholder="1999-02-12"
                  placeholderTextColor="#9ca3af"
                  maxLength={10}
                />
              </View>
            </View>

            {error && (
              <Text style={styles.errorText}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.saveBtn,
                saving && { opacity: 0.6 },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 90,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0b4f8c',
    marginBottom: 16,
  },
  noticeText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 12,
  },
  form: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1f2937',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  genderOptionSelected: {
    borderColor: '#0b4f8c',
    backgroundColor: '#0b4f8c',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  genderTextSelected: {
    color: '#ffffff',
  },
  saveBtn: {
    backgroundColor: '#0b4f8c',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0b4f8c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
});
