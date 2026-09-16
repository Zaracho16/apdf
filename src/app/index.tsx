
import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  return (

    <View style={styles.container}>

      <Text style={styles.title}> APDF </Text>

      <Text style={styles.subtitle}> 
        Convierte tus imagenes en PDF 
      </Text>

      <Pressable style={styles.button} onPress={seleccionarImagenes}>
        <Text style={styles.buttonText}>
          Seleccionar imagenes
        </Text>
      </Pressable>

    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});

/* Funcion para abrir la galeria */
const seleccionarImagenes = async() => {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
  });

  console.log(resultado);
};