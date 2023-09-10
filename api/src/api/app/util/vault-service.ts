import vault from "node-vault";
import logger from "../util/logger"

const vaultClient = vault({ 
    endpoint: 'http://0.0.0.0:8200' ,
    token: "hvs.YSFOyujJCqXHwgGDKtdveGCi" // à changer et sécuriser
}); 

// Fonction pour stocker un mot de passe dans Vault
export async function storePassword(email: string, password: string) {
    try {
      await vaultClient.write(`/vault/file/${email}`, { data: { password } });
      logger.info(`Password stored for email: ${email}`);
    } catch (error) {
      logger.error('Error storing password in Vault:', error);
    }
}

// Fonction pour récupérer un mot de passe depuis Vault
export async function retrievePassword(email: string) {
    try {
      const response = await vaultClient.read(`vault/file/${email}`);
  
      if (response && response.data && response.data.data && response.data.data.password) {
        return response.data.data.password;
      } else {
        throw new Error('Password not found in Vault.');
      }
    } catch (error) {
      console.error('Error retrieving password:', error);
      return null;
    }
}
