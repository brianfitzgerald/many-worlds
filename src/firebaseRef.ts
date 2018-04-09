import * as firebase from "firebase"
import { firebaseConfig } from "./secrets"

firebase.initializeApp(firebaseConfig)
firebase.auth().signInAnonymously()

export const dbInstance = firebase.database()
export default firebase
