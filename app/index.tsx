import { router, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'

const App = () => {
  const router = useRouter()

  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets')
      const json = await response.json()
      setData(json.data)
    } catch (error) {
      console.error(error)
    }
  }
  const goToDetails = (id: string) => {
    router.push({
      pathname: '/detail',
      params: { id: id },
    })
  }
  const renderItem = ({ item }) => (
    <Pressable onPress={() => goToDetails(item.id)}>
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.price}>
          ${parseFloat(item.priceUsd).toFixed(2)}
        </Text>
      </View>
    </Pressable>
  )

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    color: '#1a73e8',
  },
})

export default App
