import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Navbar } from "../Navbar/Navbar";
import "./Account.css"

function Account() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      setUserData({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid,
      });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="account-page">

        {userData.uid !== undefined && (
          <>
            <div className="user-info">
              <div className="displayName"> Nom d'affichage: {userData.displayName}</div>
              <div className="userData">Email: {userData.email}</div>
              <div className="emailVerified">Email vérifié: {userData.emailVerified ? "Oui" : "Non"}</div>
            </div>
            <div className="user-actions">
              <button>Mettre à jour le nom d'affichage</button>
              <button>Mettre à jour l'email</button>
              <button>Mettre à jour le mot de passe</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { Account };