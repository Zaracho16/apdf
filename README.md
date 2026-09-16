# APDF

APDF es una aplicación móvil desarrollada con React Native y Expo que permite seleccionar múltiples imágenes y convertirlas en un archivo PDF.

El proyecto fue creado como práctica para aprender desarrollo de aplicaciones móviles utilizando React Native y Expo. 
Y también porque me cansé de las aplicaciones de la app store, todas tienen mil anuncios.

## Funcionalidades

* Seleccionar múltiples imágenes desde el dispositivo
* Visualizar las imágenes seleccionadas
* Generar un PDF a partir de las imágenes
* Una imagen por página del PDF
* Compartir o guardar el PDF generado

## Tecnologías

* React Native
* Expo
* TypeScript
* Expo Image Picker
* Expo Print
* Expo Sharing
* Expo File System

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd apdf
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Iniciar la aplicación

```bash
npx expo start
```

Luego se puede abrir la aplicación utilizando:

* **Expo Go** en un dispositivo físico
* **Emulador de Android**
* **Simulador de iOS**

## Estructura del proyecto

La aplicación utiliza **Expo Router** y navegación basada en archivos.

Las pantallas principales de la aplicación se encuentran dentro de la carpeta `app`.

## Estado actual

APDF se encuentra actualmente en desarrollo.

La primera versión se centra en el flujo básico de selección de imágenes y conversión a PDF. Se irán agregando nuevas funcionalidades a medida que avance el proyecto.

## Mejoras futuras

Próximas mejoras:

* Reordenar las imágenes seleccionadas
* Eliminar imágenes individualmente
* Cambiar el nombre de los PDFs generados
* Mejorar la interfaz de usuario
* Agregar una vista previa del PDF
* Agregar opciones adicionales para la generación del PDF

## Autor

Desarrollado como proyecto personal de aprendizaje y portafolio.
