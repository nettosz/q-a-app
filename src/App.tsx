import { createContext, useState} from 'react'
import { BrowserRouter, Route } from "react-router-dom"

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"
import { auth, firebase } from './services/firebase'

type authContextType = {
  user: User | undefined
  singInWithGoogle: () => void
}

type User = {
  id: string
  name: string
  avatar: string
}

export const authContext = createContext({} as authContextType)

function App() {
  const [user, setUser] = useState<User>()

  function singInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    auth.signInWithPopup(provider).then(result => {
      if(result.user) {
        const {displayName, photoURL, uid} = result.user

        if(!displayName || !photoURL) {
          throw Error('Missing information from Google Account.')
        }

        setUser(
          {
            id: uid,
            name: displayName,
            avatar: photoURL
          }
        )
      }
    })
  }

  return (
    <BrowserRouter>
      <authContext.Provider value={{ user, singInWithGoogle}}>
        <Route path="/" exact component={Home}/>
        <Route path="/rooms/new" component={NewRoom}/>
      </authContext.Provider>
    </BrowserRouter>
  );
}

export default App;
