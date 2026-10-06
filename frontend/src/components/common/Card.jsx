import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme";

export const LogoutCard = ({ onLogout, onCancel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Warning</Text>
      <Text style={styles.message}>
        Are you sure you want to log out? You will need your password to log back in.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


// export function Card({ children, style }) {
//   return (
//     <View style={[{ backgroundColor: colors?.surface || '#121212', borderColor: colors?.border || '#333', borderRadius: 8, borderWidth: 1, padding: 16 }, style]}>
//       {children}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212', // Black/dark grey background
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
    width: '90%',
    alignSelf: 'center',
    // Shadow l'elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#D1D1D6', // Light grey text
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FF3B30', // Red text
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});