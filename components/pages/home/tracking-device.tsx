import MapboxWeb from '@/components/ui/maps' 
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

const MainTrackingAnimal = () => {
  return (
    <View className="flex-1 relative">
        {/* Search Bar */}
        <View className="absolute w-full top-3 px-4 pt-3 pb-2 -z-0">
            <View className="flex-row items-center bg-white rounded-lg shadow px-2">
                <Ionicons name="location-outline" size={22} color="#103060" className="mr-2" />
                <TextInput
                    className="flex-1 py-2 px-2 text-gray-800"
                    placeholder="Shakisha ahantu."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity className="p-2">
                    <Ionicons name="search" size={22} color="#103060" />
                </TouchableOpacity>
            </View>
        </View>
        {/* Map */}
        <View className="flex-1 relative -z-10">
            {/* Mapbox Web Component */}
            <MapboxWeb />
        </View>
    </View>
  )
}

export default MainTrackingAnimal