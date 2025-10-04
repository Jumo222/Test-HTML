import { useState, useCallback } from "react";

const colors = ["#f4f4f4", "#e8f5e8", "#fff2e8", "#f0e8ff", "#e8f4fd"]; //erstellt colors array außerhalb, da es konstant ist

const useInteractivity = () => {
  const [backgroundColor, setBackgroundColor] = useState("#f4f4f4"); //setzt backgroundColor mit useState
  const [counter, setCounter] = useState(0); //setzt counter mit useState auf 0

  const changeBackgroundColor = useCallback(() => {
    //usecallback macht, dass diese funktion nur neu erstellt, wenn backgroundColor oder colors sich ändern, heißt wenn nicht bleibt die Adresse im Speicher die selbe (Optimierung, funktional keine änderung)
    const currentIndex = colors.indexOf(backgroundColor); //hiermit weiß current index welche farbe es ist, da es den passenden Indexwert zurückgibt, welcher mit backgroundcolor übereinstimmt
    const nextIndex = (currentIndex + 1) % colors.length; //nächster index, % colors.length macht, dass wenn der letzte indexwert von color erreicht ist, wieder 0 zurückgegeben wird
    setBackgroundColor(colors[nextIndex]);
  }, [backgroundColor]); //dependency nur backgroundColor, da colors konstant außerhalb definiert ist

  const incrementCounter = useCallback(() => {
    setCounter((prev) => prev + 1); //prev ist "previous value" (optionaler Standardname) funktioniert wie setCounter(counter + 1) , bloß dass es stabiler ist, z.B. bei schnellen state changes, da es immer den aktuellsten Wert nimmt
  }, []);

  return {
    backgroundColor,
    counter,
    changeBackgroundColor,
    incrementCounter,
  };
};

export default useInteractivity;
