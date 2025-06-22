'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { account, server } from '../utils/passkey-kit';
import { useKeyIdStore } from '../store/keyId';
import { useContractIdStore } from '../store/contractId';
import { truncate } from '../utils/base';

export default function PassKey() {
  const [creating, setCreating] = useState(false);
  const [cid, setCid] = useState('CAZRBRTNQ7SLRBOZP4ZVKYKP5NI6B557IQUAU7JMNJDZVOYBB64PXG7V');
  const contractId = useContractIdStore((state) => state.contractId);
  const updateContractId = useContractIdStore((state) => state.setContractId);

  //const keyId = useKeyIdStore((state) => state.keyId)
  const updateKeyId = useKeyIdStore((state) => state.setKeyId);

  useEffect(() => {
    if (localStorage.hasOwnProperty('ssd:keyId')) {
      updateKeyId(localStorage.getItem('ssd:keyId')!);
    }

    return () => {};
  }, []);

  async function signUp() {
    console.log(
      '1. signUp fonksiyonu başladı, buton devre dışı bırakılıyor...'
    );
    setCreating(true);

    try {
      console.log(
        '2. Yeni cüzdan oluşturuluyor (account.createWallet çağrılıyor)...'
      );
      const {
        keyIdBase64,
        contractId: cid,
        signedTx,
      } = await account.createWallet(
        'Smart Stellar Demo',
        'Smart Stellar Demo User'
      );

      console.log('3. Cüzdan başarıyla oluşturuldu!');
      console.log('   - keyIdBase64:', keyIdBase64);
      console.log('   - contractId:', cid);
      console.log('   - signedTx (işlem imzası):', signedTx);

      console.log(
        '4. İşlem blok zincirine gönderiliyor (server.send çağrılıyor)...'
      );
      await server.send(signedTx);
      console.log('5. İşlem başarıyla gönderildi!');

      console.log('6. State ve localStorage güncelleniyor...');
      updateKeyId(keyIdBase64);
      localStorage.setItem('ssd:keyId', keyIdBase64);
      updateContractId(cid);

      console.log('7. Güncellemeler tamamlandı:');
      console.log('   - keyId:', keyIdBase64);
      console.log('   - contractId:', cid);
    } catch (error) {
      console.error('HATA: signUp işlemi başarısız oldu:', error);
    } finally {
      console.log(
        '8. İşlem tamamlandı (başarılı/başarısız), buton tekrar aktif ediliyor.'
      );
      setCreating(false);
    }
  }

  async function login() {
    const { keyIdBase64, contractId: cid } = await account.connectWallet();
    console.log(
      '1. login fonksiyonu başladı, keyIdBase64 ve contractId alınıyor...'
    );
    console.log('   - keyIdBase64:', keyIdBase64);
    console.log('   - contractId:', cid);
    console.log('2. State ve localStorage güncelleniyor...');
    console.log('   - keyIdBase64 güncelleniyor...');
    console.log('   - contractId güncelleniyor...');
    console.log('3. Güncellemeler tamamlandı:');
    console.log('   - keyId:', keyIdBase64);
    console.log('   - contractId:', cid);
    // Update the keyId and contractId in the state and localStorage
    console.log(
      '4. login işlemi tamamlandı, kullanıcı arayüzü güncelleniyor...'
    );
    console.log(
      '5. Kullanıcı arayüzü güncellendi, artık kullanıcı giriş yapmış durumda.'
    );
    updateKeyId(keyIdBase64);
    console.log('6. keyIdBase64:', keyIdBase64);
    localStorage.setItem('ssd:keyId', keyIdBase64);
    console.log('7. localStorage güncellendi, keyIdBase64 kaydedildi.');
    updateContractId(cid);
    console.log('8. contractId:', cid);
    console.log(
      '9. contractId güncellendi, artık kullanıcı giriş yapmış durumda.'
    );
  }

  async function logout() {
    updateContractId('');
    console.log('1. logout fonksiyonu başladı, contractId temizleniyor...');
    console.log(
      '   - contractId temizlendi, artık kullanıcı giriş yapmamış durumda.'
    );
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('ssd:')) {
        localStorage.removeItem(key);
      }
    });
    console.log(
      '2. localStorage temizlendi, tüm Smart Stellar Demo ile ilgili veriler silindi.'
    );

    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes('ssd:')) {
        sessionStorage.removeItem(key);
      }
    });
    console.log(
      '3. sessionStorage temizlendi, tüm Smart Stellar Demo ile ilgili oturum verileri silindi.'
    );

    location.reload();
  }

  return (
    <div className="flex items-center space-x-2">
      {contractId ? (
        <>
          <a
            className="font-mono text-xs underline hidden sm:inline-block"
            href={`https://stellar.expert/explorer/public/contract/${contractId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncate(contractId, 4)}
          </a>
          <button
            className="text-sm text-white bg-primary hover:bg-primary-600 px-3 py-1 rounded transition-colors"
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            className="text-sm underline text-primary-700 dark:text-primary-300 hover:text-primary-500 transition-colors"
            onClick={login}
          >
            Login
          </button>
          <button
            className="text-sm bg-primary hover:bg-primary-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
            onClick={signUp}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Account'}
          </button>
        </>
      )}
    </div>
  );
}
