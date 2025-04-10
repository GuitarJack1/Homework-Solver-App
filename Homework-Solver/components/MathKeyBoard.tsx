import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type MathKeyboardProps = {
  onPress: (symbol: string) => void;
};

const symbols = ['+', '-', '×', '÷', '=', '√', '^', '(', ')'];

export default function MathKeyboard({ onPress }: MathKeyboardProps) {
  return (
    <View style={styles.keyboardContainer}>
      {symbols.map((symbol, index) => (
        <TouchableOpacity
          key={index}
          style={styles.key}
          onPress={() => onPress(symbol)}
        >
          <Text style={styles.keyText}>{symbol}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#1e293b',
    borderTopWidth: 2,
    borderColor: '#3fb6dd',
  },
  key: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: '#3fb6dd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    color: '#fff',
  },
});
