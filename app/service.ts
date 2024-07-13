import { updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore"; // Adjust import paths as necessary
import { deleteObject, ref as imageRef } from "firebase/storage"; // Adjust import paths as necessary
import { Task } from "./model/Task";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../config/FirebaseConfig";
import { DB_NAME } from "./constants";
import * as FileSystem from "expo-file-system";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//Task service
export const createTask = async (item: Task) => {
  await addDoc(collection(FIREBASE_DB, DB_NAME), item);
};

export const updateTask = async (ref: any, item: Task) => {
  await updateDoc(ref, item);
};

export const deleteTask = async (ref: any, item: Task) => {
  //delete image from storage
  if (item.imgUrl) {
    const obj = imageRef(FIREBASE_STORAGE, item.imgUrl);
    await deleteObject(obj);
  }
  await deleteDoc(ref);
};

//Image service
export const uploadImage = async (image: string): Promise<string> => {
  const { uri } = await FileSystem.getInfoAsync(image);
  const response = await fetch(uri);
  const file = await response.blob();
  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = ref(FIREBASE_STORAGE, `images/${filename}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
        reject("Failed to upload image");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
