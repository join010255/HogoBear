import React from 'react';
import { Text, TextInput, View, StyleSheet } from "react-native";

export function Input({ 
  label, 
  rightLabel, 
  icon: Icon, 
  containerStyle, 
  inputStyle,
  ...props 
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {(label || rightLabel) && (
        <View style={styles.labelContainer}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
        </View>
      )}

      {/* Input Box */}
      <View style={styles.inputWrapper}>
        {Icon && (
          <View style={styles.iconContainer}>
            {Icon}
          </View>
        )}
        <TextInput 
          placeholderTextColor="#525252"
          style={[styles.input, inputStyle, Icon && { paddingLeft: 8 }]} 
          {...props} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  rightLabel: {
    color: "#525252",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161618", // Dark background matching the image
    borderRadius: 20, // Large rounded corners
    minHeight: 60,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 60,
  }
});