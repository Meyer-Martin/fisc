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
        <h1>Mon compte</h1>
        {userData.uid !== undefined && (
          <>
            <div className="user-info">
              <img src={userData.photoURL} alt={userData.displayName} />
              <p>Nom d'affichage: {userData.displayName}</p>
              <p>Email: {userData.email}</p>
              <p>
                Email vérifié: {userData.emailVerified ? "Oui" : "Non"}
              </p>
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