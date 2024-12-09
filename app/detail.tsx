import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'

interface AssetData {
  id: string
  symbol: string
  name: string
  priceUsd: string
}

export default function Details() {
  const { id } = useLocalSearchParams()
  const [data, setData] = useState<AssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchData(id as string)
    } else {
      setError('Invalid or missing asset ID')
      setLoading(false)
    }
  }, [id])

  const fetchData = async (assetId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `https://api.coincap.io/v2/assets/${assetId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const json = await response.json()
      setData(json.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Details for ${id || 'Asset'}` }} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{`Error: ${error}`}</Text>
      ) : (
        <View>
          <Text style={styles.title}>{data?.name || 'Asset Name'}</Text>
          <Text style={styles.info}>{`Symbol: ${data?.symbol}`}</Text>
          <Text style={styles.info}>{`Price (USD): $${parseFloat(
            data?.priceUsd
          ).toFixed(2)}`}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
})
