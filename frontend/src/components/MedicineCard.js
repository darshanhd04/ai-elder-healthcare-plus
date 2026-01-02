import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function MedicineCard({ medicine, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
        {medicine.name}
      </Text>
      <Text>Dosage: {medicine.dosage}</Text>
    </TouchableOpacity>
  );
}
