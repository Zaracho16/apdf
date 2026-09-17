
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [imagenes, setImagenes] = useState<string[]>([]);

  const seleccionarImagenes = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
    });

    if (!resultado.canceled) {
      const nuevasImagenes = resultado.assets.map(
        (imagen) => imagen.uri
      );

      setImagenes(nuevasImagenes);
    }
  };

  const eliminarImagenes = (indexEliminar: number) => {
    setImagenes((imagenesActuales) => 
      imagenesActuales.filter(
        (_, index) => index != indexEliminar
      )
    );
  }

  const moverImagen = (index: number, direccion: number) => {
  const nuevoIndex = index + direccion;

  if (nuevoIndex < 0 || nuevoIndex >= imagenes.length) {
    return;
  }

  const nuevasImagenes = [...imagenes];

  [nuevasImagenes[index], nuevasImagenes[nuevoIndex]] = [
    nuevasImagenes[nuevoIndex],
    nuevasImagenes[index],
  ];

  setImagenes(nuevasImagenes);
};

const generarPDF = async () => {
  if (imagenes.length === 0) {
    return;
  }

  const imagenesHTML = await Promise.all(
    imagenes.map(async (imagen) => {
      const archivo = new File(imagen);
      const base64 = await archivo.base64();

      return `
      <div class="pagina">
        <img
          src="data:image/jpeg;base64,${base64}"
        />
      </div>
      `;
    })
  );

  const html = `
    <html>
      <head>
        <style>
          @page {
            margin: 0;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }

          .pagina {
            width: 100%;
            height: 100%;
            page-break-after: always;

            display: flex;
            justify-content: center;
            align-items: center;
          }

          .pagina:last-child ñ{
            page-break-after: auto;
          }

          .pagina img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>

      <body>
        ${imagenesHTML.join('')}
      </body>
    </html>
  `;

  const resultado = await Print.printToFileAsync({
    html,
  });

  console.log('PDF generado:', resultado.uri);

  await Sharing.shareAsync(resultado.uri);
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        APDF
      </Text>

      <Text style={styles.subtitle}>
        Convierte tus imagenes en PDF
      </Text>

      <Pressable
        style={styles.button}
        onPress={seleccionarImagenes}
      >
        <Text style={styles.buttonText}>
          Seleccionar imagenes
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={generarPDF}
      >
        <Text style={styles.buttonText}>
          Generar PDF
        </Text>
      </Pressable>

<View style={styles.imageContainer}>
  {imagenes.map((imagen, index) => (
    <View key={index} style={styles.imageWrapper}>
      <Image
        source={{ uri: imagen }}
        style={styles.image}
      />

      <Pressable
        style={styles.deleteButton}
        onPress={() => eliminarImagenes(index)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </Pressable>

      <View style={styles.moveButtons}>
        <Pressable
          style={styles.moveButton}
          onPress={() => moverImagen(index, -1)}
          disabled={index === 0}
        >
          <Text style={styles.moveButtonText}>↑</Text>
        </Pressable>

        <Pressable
          style={styles.moveButton}
          onPress={() => moverImagen(index, 1)}
          disabled={index === imagenes.length - 1}
        >
          <Text style={styles.moveButtonText}>↓</Text>
        </Pressable>
      </View>
    </View>
  ))}
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    position: 'relative',
  },

  deleteButton: {
    position: 'absolute',
    top:-8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 25,
  },

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

  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  moveButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },

  moveButton: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moveButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});