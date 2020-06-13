import React from 'react';

import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";


const App = () => {
  return (
    <div className="App">
        <AuthContext.Provider value={{authUser: {}}}>
            <Header/>
        </AuthContext.Provider>
    </div>
  );
}

export default App;
