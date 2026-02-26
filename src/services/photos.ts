import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@config/firebase';

export const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const requestMediaLibraryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const takePicture = async () => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Error taking picture:', error);
    throw error;
  }
};

export const pickImage = async () => {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      throw new Error('Media library permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

export const compressImage = async (uri: string) => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const uploadImage = async (uri: string, path: string) => {
  try {
    // Compress image first
    const compressedUri = await compressImage(uri);

    // Convert to blob
    const response = await fetch(compressedUri);
    const blob = await response.blob();

    // Upload to Firebase Storage
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadJobPhoto = async (
  jobId: string,
  imageUri: string,
  type: 'before' | 'after'
) => {
  const timestamp = Date.now();
  const path = `jobs/${jobId}/${type}_${timestamp}.jpg`;
  return uploadImage(imageUri, path);
};
