import { useEffect, useState } from "react";
import "./TypingSpeedTester.css";
import TypingArea from "../TypingArea/TypingArea";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "The early bird catches the worm, but the second mouse gets the cheese.",
  "In the end, we will remember not the words of our enemies, but the silence of our friends.",
  "All that glitters is not gold; often have you heard that told.",
  "To succeed in life, you need two things: ignorance and confidence.",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "It is our choices, Harry, that show what we truly are, far more than our abilities.",
  "In three words I can sum up everything I've learned about life: it goes on.",
  "You must be the change you wish to see in the world.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "The road to success and the road to failure are almost exactly the same. The only difference is that the road to success is a little bit longer, and you have to keep walking even when you feel like stopping.",
  "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.",
  "Don't judge each day by the harvest you reap but by the seeds that you plant. Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.",
  "Life is what happens when you're busy making other plans. You will face many defeats in life, but never let yourself be defeated. The greatest glory in living lies not in never falling, but in rising every time we fall. In the end, it's not the years in your life that count. It's the life in your years.",
];

const TypingSpeedTester = () => {
  const [typingText, setTypingText] = useState("");
  const [inpFieldValue, setInpFieldValue] = useState("");
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);

  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const inputField = document.getElementsByClassName("input-field")[0];
    document.addEventListener("keydown", () => inputField.focus());
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        style={{
          color: letter !== " " ? "black" : "transparent",
        }}
        className={`char ${index === 0 ? "active" : ""}`}
      >
        {" "}
        {letter !== " " ? letter : "_"}{" "}
      </span>
    ));
    setTypingText(content);
    setInpFieldValue("");
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
  };
  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll(".char");
    if (
      event.key === "Backspace" &&
      charIndex > 0 &&
      charIndex < characters.length &&
      timeLeft > 0
    ) {
      if (characters[charIndex - 1].classList.contains("correct")) {
        characters[charIndex - 1].classList.remove("correct");
      }
      if (characters[charIndex - 1].classList.contains("wrong")) {
        characters[charIndex - 1].classList.remove("wrong");
        setMistakes(mistakes - 1);
      }
      characters[charIndex].classList.remove("active");
      characters[charIndex - 1].classList.add("active");
      setCharIndex(charIndex - 1);
      let cpm = (charIndex - mistakes - 1) * (60 / (maxTime - timeLeft));
      cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
      setCPM(parseInt(cpm, 10));
      let wpm = Math.round(
        ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
      );
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      setWPM(wpm);
    }
  };

  const initTyping = (event) => {
    const characters = document.querySelectorAll(".char");
    let typedChar = event.target.value;
    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].innerText[0];
      if (currentChar === "_") currentChar = " ";
      if (!isTyping) {
        setIsTyping(true);
      }
      if (typedChar === currentChar) {
        setCharIndex(charIndex + 1);
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.remove("active");
        characters[charIndex].classList.add("correct");
      } else {
        setCharIndex(charIndex + 1);
        setMistakes(mistakes + 1);
        characters[charIndex].classList.remove("active");
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.add("wrong");
      }

      if (charIndex === characters.length - 1) setIsTyping(false);

      let wpm = Math.round(
        ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
      );
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      setWPM(wpm);

      let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
      cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
      setCPM(parseInt(cpm, 10));
    } else {
      setIsTyping(false);
    }
  };

  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setTypingText("");
    setCPM(0);
    setWPM(0);
    const characters = document.querySelectorAll(".char");
    characters.forEach((span) => {
      span.classList.remove("correct");
      span.classList.remove("wrong");
      span.classList.remove("active");
    });
    characters[0].classList.add("active");
    loadParagraph();
  };

  useEffect(() => {
    loadParagraph();
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
        cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        setCPM(parseInt(cpm, 10));
        let wpm = Math.round(
          ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
        );
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft]);

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        value={inpFieldValue}
        onChange={initTyping}
        onKeyDown={handleKeyDown}
      />{" "}
      <TypingArea
        typingText={typingText}
        inpFieldValue={inpFieldValue}
        timeLeft={timeLeft}
        mistakes={mistakes}
        WPM={WPM}
        CPM={CPM}
        initTyping={initTyping}
        handleKeyDown={handleKeyDown}
        resetGame={resetGame}
      />{" "}
    </div>
  );
};

export default TypingSpeedTester;
