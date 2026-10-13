import { File } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [nombrePDF, setNombrePDF] = useState('Mi documento');
  const [rotaciones, setRotaciones] = useState<number[]>([]);

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
      setRotaciones(nuevasImagenes.map(() => 0));
    }
  };

  const eliminarImagenes = (indexEliminar: number) => {
    setImagenes((actuales) =>
      actuales.filter((_, index) => index !== indexEliminar)
    );

    setRotaciones((actuales) =>
      actuales.filter((_, index) => index !== indexEliminar)
    );
  };

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

    setRotaciones((actuales) => {
      const nuevasRotaciones = [...actuales];

      [nuevasRotaciones[index], nuevasRotaciones[nuevoIndex]] = [
        nuevasRotaciones[nuevoIndex],
        nuevasRotaciones[index],
      ];

      return nuevasRotaciones;
    });
  };

  const girarImagen = (index: number, grados: number) => {
    setRotaciones((actuales) =>
      actuales.map((rotacion, i) =>
        i === index ? (rotacion + grados + 360) % 360 : rotacion
      )
    );
  };

  const generarPDF = async () => {
    if (imagenes.length === 0) {
      return;
    }

    const imagenesHTML = await Promise.all(
      imagenes.map(async (imagen, index) => {
        const imagenComprimida =
          await ImageManipulator.manipulateAsync(
            imagen,
            [
              { rotate: rotaciones[index] },
              { resize: { width: 1600 } },
            ],
            {
              compress: 0.7,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

        const archivo = new File(imagenComprimida.uri);
        const base64 = await archivo.base64();

        return `
          <div class="pagina">
            <img src="data:image/jpeg;base64,${base64}" />
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

            .pagina:last-child {
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

    const nombreLimpio = nombrePDF
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
      .replace(/\.pdf$/i, '')
      .trim();

    const nombreFinal = nombreLimpio || 'Mi documento';

    const archivoPDF = new File(
      resultado.uri.substring(0, resultado.uri.lastIndexOf('/') + 1) +
        `${nombreFinal}.pdf`
    );

    const archivoOriginal = new File(resultado.uri);
    await archivoOriginal.copy(archivoPDF);

    console.log('PDF generado:', archivoPDF.uri);

    await Sharing.shareAsync(archivoPDF.uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>APDF</Text>

      <Text style={styles.subtitle}>
        Convierte tus imagenes en PDF
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del pdf"
        value={nombrePDF}
        onChangeText={setNombrePDF}
        maxLength={80}
      />

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
          <View key={`${imagen}-${index}`} style={styles.imageWrapper}>
            <Image
              source={{ uri: imagen }}
              style={[
                styles.image,
                {
                  transform: [
                    { rotate: `${rotaciones[index]}deg` },
                  ],
                },
              ]}
            />

            <Pressable
              style={styles.deleteButton}
              onPress={() => eliminarImagenes(index)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </Pressable>

            <View style={styles.moveButtons}>
              <Pressable
                style={[
                  styles.moveButton,
                  index === 0 && styles.disabledButton,
                ]}
                onPress={() => moverImagen(index, -1)}
                disabled={index === 0}
              >
                <Text style={styles.moveButtonText}>↑</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.moveButton,
                  index === imagenes.length - 1 &&
                    styles.disabledButton,
                ]}
                onPress={() => moverImagen(index, 1)}
                disabled={index === imagenes.length - 1}
              >
                <Text style={styles.moveButtonText}>↓</Text>
              </Pressable>
            </View>

            <View style={styles.rotateButtons}>
              <Pressable
                style={styles.moveButton}
                onPress={() => girarImagen(index, -90)}
              >
                <Text style={styles.moveButtonText}>↶</Text>
              </Pressable>

              <Pressable
                style={styles.moveButton}
                onPress={() => girarImagen(index, 90)}
              >
                <Text style={styles.moveButtonText}>↻</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
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

  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
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

  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  deleteButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 25,
  },

  moveButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },

  rotateButtons: {
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

  disabledButton: {
    opacity: 0.35,
  },

  moveButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});