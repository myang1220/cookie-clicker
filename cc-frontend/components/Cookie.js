'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { db } from '../../cc-backend/firebaseConfig';
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import styles from './Cookie.module.css';

const Cookie = () => {
  const [cookies, setCookies] = useState(0);
  const [cps, setCps] = useState(0);
  const [upgrades, setUpgrades] = useState({
    cursor: { count: 0, cost: 15, cps: 0.1 },
    grandma: { count: 0, cost: 100, cps: 1 },
  });
  const [saveId, setSaveId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSaveId = params.get('saveId');
    if (urlSaveId) {
      setSaveId(urlSaveId);
      loadGameState(urlSaveId);
    } else {
      const newSaveId = Math.random().toString(36).substr(2, 9);
      setSaveId(newSaveId);
      router.push(`/?saveId=${newSaveId}`, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (saveId) {
      const gameStateRef = doc(db, 'gameStates', saveId);
      const unsubscribe = onSnapshot(gameStateRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setCookies(data.cookies);
          setCps(data.cps);
          setUpgrades(data.upgrades);
        }
      });

      return () => unsubscribe();
    }
  }, [saveId]);

  useEffect(() => {
    const cookieInterval = setInterval(() => {
      setCookies(prevCookies => prevCookies + cps);
    }, 1000);

    const saveInterval = setInterval(() => {
      if (saveId) {
        saveGameState();
      }
    }, 60000); // Save every minute

    return () => {
      clearInterval(cookieInterval);
      clearInterval(saveInterval);
    };
  }, [cps, saveId]);

  const loadGameState = async (loadSaveId) => {
    try {
      const gameStateRef = doc(db, 'gameStates', loadSaveId);
      const docSnap = await getDoc(gameStateRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCookies(data.cookies);
        setCps(data.cps);
        setUpgrades(data.upgrades);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const saveGameState = async () => {
    try {
      const gameStateRef = doc(db, 'gameStates', saveId);
      await setDoc(gameStateRef, {
        cookies,
        cps,
        upgrades,
        lastSaved: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const clickCookie = () => {
    setCookies(prevCookies => prevCookies + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Duration of the animation
  };

  const buyUpgrade = (type) => {
    if (cookies >= upgrades[type].cost) {
      setCookies(prevCookies => prevCookies - upgrades[type].cost);
      setUpgrades(prevUpgrades => ({
        ...prevUpgrades,
        [type]: {
          ...prevUpgrades[type],
          count: prevUpgrades[type].count + 1,
          cost: Math.ceil(prevUpgrades[type].cost * 1.05),
        },
      }));
      setCps(prevCps => prevCps + upgrades[type].cps);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cookie Clicker</h1>
      <p className={styles.count}>Cookies: {Math.floor(cookies)}</p>
      <p className={styles.cps}>CPS: {cps.toFixed(1)}</p>
      <div className={styles.cookieImageContainer}>
        <NextImage
          src="/cookie.png"
          alt="Cookie"
          width={400}
          height={400}
          onClick={clickCookie}
          onDragStart={(e) => e.preventDefault()} // Prevent dragging
          className={`${styles.cookieImage} ${isAnimating ? styles.clickAnimation : ''}`}
        />
      </div>
      <div className={styles.upgradesContainer}>
        {Object.entries(upgrades)
          .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
          .map(([type, upgrade]) => (
            <button
              key={type}
              className={styles.upgradeButton}
              style={{ fontFamily: 'Pacifico, cursive' }}
              onClick={() => buyUpgrade(type)}
              disabled={cookies < upgrade.cost}
            >
              Buy {type} (Cost: {upgrade.cost})
            </button>
          ))}
      </div>
      {saveId && (
        <p className={styles.saveId}>
          Your save URL: {`${window.location.origin}/?saveId=${saveId}`}
        </p>
      )}
    </div>
  );
};

export default Cookie;