import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';
import { APIs } from '../worker';
import { useDispatch } from 'react-redux';


const firebaseConfig = {
  apiKey: "AIzaSyCkz0dwq9WuxY7fSBLHEHMfNn4c8CQZEig",
  authDomain: "topaz-fc73a.firebaseapp.com",
  databaseURL: "https://topaz-fc73a-default-rtdb.firebaseio.com",
  projectId: "topaz-fc73a",
  storageBucket: "topaz-fc73a.appspot.com",
  messagingSenderId: "837080339807",
  appId: "1:837080339807:web:e7cf7887c5ebb614a152ea",
  measurementId: "G-S6ZCTWE4V6"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging();
const userInfo = JSON.parse(localStorage.getItem("userinfo"));

console.log("firebaseapp--------",firebaseApp)

export let recentToken = "";
export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BIm1Pzr2acnx4ygW2DdAxqL1N09XSDdY-3z_k3Zr87PB_0zbQgEcMwo9wY0dtenXIuFUNnqVhWibo3HiAXfhKLo" })
    .then(async (currentToken) => {
      if (currentToken) {
        if (recentToken !== currentToken) {
          recentToken = currentToken
          console.log('current token for client: ', currentToken);
          const res = await axios.post(`${APIs.baseURL}/manufacturer-service/v1/manufacturer-token`, {
            manufacturerCode: userInfo.manufacturerCode,
            manufacturerToken: currentToken
          },{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          )
          console.log(res)
        }
        // console.log('current -----------: ', currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

requestForToken()

// export const onMessageListener = () => {
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log("payload", payload)
      
//       resolve(payload);
//     });

//   });
// }

// .then((payload) => {
//     // dispatch({ type: "GET_ALL_NOTIFICATION_SUCCESS", payload: payloadData.data });
//     console.log(payload, "response")
//   })

