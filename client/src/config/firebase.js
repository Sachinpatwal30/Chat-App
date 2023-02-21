
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "netflix-clone-61bc9.firebaseapp.com",
    projectId: "netflix-clone-61bc9",
    storageBucket: "netflix-clone-61bc9.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_Id
};


const app = initializeApp(firebaseConfig);
const storage = getStorage();

export default storage;
export { app };