import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function MedicineCard({ medicine, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{padding:12,borderWidth:1,marginVertical:6,borderRadius:8}}>
      <Text style={{fontSize:16,fontWeight:'bold'}}>{medicine.name}</Text>
      <Text>{medicine.dosage}</Text>
    </TouchableOpacity>
  );
}
