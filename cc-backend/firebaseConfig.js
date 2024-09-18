import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyrtKHYgdlPkgayQmMl4c5SaThVGH-fIE",
  authDomain: "fsab-project-12572.firebaseapp.com",
  projectId: "fsab-project-12572",
  storageBucket: "fsab-project-12572.appspot.com",
  messagingSenderId: "1071350485810",
  appId: "1:1071350485810:web:dac57ff203bb01d2affd2b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };