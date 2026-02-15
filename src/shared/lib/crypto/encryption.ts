import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

export class SecureStorage {
  private static readonly KEY_ALIAS = 'inheritance_key';
  
  static async encrypt(data: object): Promise<string> {
    const json = JSON.stringify(data);
    const key = await this.getOrCreateKey();
    
    const encrypted = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      json + key
    );
    
    return encrypted;
  }
  
  static async saveEncrypted(id: string, data: object): Promise<void> {
    const encrypted = await this.encrypt(data);
    await SecureStore.setItemAsync(`calc_${id}`, encrypted, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  }
  
  private static async getOrCreateKey(): Promise<string> {
    let key = await SecureStore.getItemAsync(this.KEY_ALIAS);
    if (!key) {
      key = await Crypto.getRandomBytesAsync(32).then(buf => 
        Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
      );
      await SecureStore.setItemAsync(this.KEY_ALIAS, key);
    }
    return key;
  }
}
