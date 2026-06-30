import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { getServerUrl, setServerUrl } from '../lib/server-config';

function ServerConfigScreen({ onConfigured }: { onConfigured: () => void }) {
  const [url, setUrl] = useState('http://');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    const trimmed = url.trim();
    if (!trimmed || trimmed === 'http://' || trimmed === 'https://') {
      setError('Please enter a valid server address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const testUrl = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
      const response = await fetch(`${testUrl}/health`, { signal: AbortSignal.timeout(5000) });
      const data = await response.json();

      if (data?.status === 'healthy' && typeof data.model_loaded === 'boolean') {
        await setServerUrl(testUrl);
        onConfigured();
      } else {
        setError('That address is not a Voicebox server');
      }
    } catch {
      setError('Could not connect. Check the address and ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.configContainer}>
      <View style={styles.configCard}>
        <Text style={styles.logo}>Voicebox</Text>
        <Text style={styles.subtitle}>Mobile</Text>

        <Text style={styles.label}>Server Address</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="http://192.168.1.50:17493"
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!loading}
        />

        <Text style={styles.hint}>
          Enter the IP address and port of your Voicebox server.
          {'\n'}It must be reachable from this device on the same network.
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText} onPress={loading ? undefined : handleConnect}>
            {loading ? 'Connecting...' : 'Connect'}
          </Text>
        </View>

        {loading && <ActivityIndicator style={styles.spinner} color="#c9a84c" />}
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [serverConfigured, setServerConfigured] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getServerUrl();
      if (saved) {
        setServerConfigured(true);
      }
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  if (!serverConfigured) {
    return (
      <>
        <StatusBar style="light" />
        <ServerConfigScreen onConfigured={() => setServerConfigured(true)} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  configContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  configCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#c9a84c',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  error: {
    fontSize: 13,
    color: '#ff6b6b',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#c9a84c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  spinner: {
    marginTop: 16,
  },
});
