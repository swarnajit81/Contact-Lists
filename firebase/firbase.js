import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDBZOK11qj6cNIMTuMQoLyvxys6pgrp5KE',
  authDomain: 'contact-list-images.firebaseapp.com',
  projectId: 'contact-list-images',
  storageBucket: 'contact-list-images.appspot.com',
  messagingSenderId: '830931175151',
  appId: '1:830931175151:web:caa8023ce78f6827347d1a',
}

export const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
