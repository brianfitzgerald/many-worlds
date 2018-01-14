import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAE53GY_t5lKckauLUUmM4zOOBhuc7qgcg",
    authDomain: "midnight-sun-f2184.firebaseapp.com",
    databaseURL: "https://midnight-sun-f2184.firebaseio.com",
    projectId: "midnight-sun-f2184",
    storageBucket: "midnight-sun-f2184.appspot.com",
    messagingSenderId: "277649090106"
};

firebase.initializeApp(config)
firebase.auth().signInAnonymously()

export const dbInstance = firebase.database()
export default firebase