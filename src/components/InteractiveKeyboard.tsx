import { useEffect, useRef, useState } from "react";
import { playKeySound } from "../lib/sound";
import "./InteractiveKeyboard.css";

interface KeyDef {
  code?: string;
  macro?: string;
  className?: string;
  label?: string;
}

const LABEL_MAP: Record<string, string> = {
  KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T",
  KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O", KeyP: "P",
  KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G",
  KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L",
  KeyZ: "Z", KeyX: "X", KeyC: "C", KeyV: "V", KeyB: "B",
  KeyN: "N", KeyM: "M",
  ArrowUp: "↑",
  ArrowLeft: "←",
  ArrowDown: "↓",
  ArrowRight: "→",
};

interface FloatingBubble {
  id: number;
  char: string;
  x: number;
  y: number;
  driftX: number;
}

const ROW_1: KeyDef[] = [
  { code: "Escape", macro: "orange", className: "orange" },
  ..."1234567890".split("").map((n) => ({ code: `Digit${n}` })),
  { code: "Minus" },
  { code: "Equal" },
  { code: "Backspace", className: "size-4 grey stretch" },
  { macro: "red", className: "red" },
];

const ROW_2: KeyDef[] = [
  { code: "Tab", className: "size-2 grey stretch" },
  ..."QWERTYUIOP".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "BracketLeft" },
  { code: "BracketRight" },
  { code: "Backslash", className: "size-2 grey stretch" },
  { macro: "yellow", className: "yellow" },
];

const ROW_3: KeyDef[] = [
  { code: "CapsLock", className: "size-3 grey stretch" },
  ..."ASDFGHJKL".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "Semicolon" },
  { code: "Quote" },
  { code: "Enter", macro: "green:Enter", className: "size-5 green stretch" },
  { macro: "green", className: "green" },
];

const ROW_4: KeyDef[] = [
  { code: "ShiftLeft", macro: "yellow:ShiftLeft", className: "size-5 yellow stretch" },
  ..."ZXCVBNM".split("").map((c) => ({ code: `Key${c}`, label: c })),
  { code: "Comma" },
  { code: "Period" },
  { code: "Slash" },
  { code: "ShiftRight", macro: "yellow:ShiftRight", className: "size-3 yellow stretch" },
  { code: "ArrowUp", label: "↑" },
  { macro: "blue", className: "blue" },
];

const ROW_5: KeyDef[] = [
  { code: "ControlLeft", macro: "red:ControlLeft", className: "size-6 red" },
  { code: "MetaLeft", macro: "purple:MetaLeft", className: "size-6 purple" },
  { code: "AltLeft", macro: "blue:AltLeft", className: "size-6 blue" },
  { code: "Space", macro: "default:Space", className: "size-7 empty" },
  { code: "AltRight", macro: "blue:AltRight", className: "size-2 blue stretch" },
  { code: "ContextMenu", macro: "purple:ContextMenu", className: "size-2 purple stretch" },
  { code: "ArrowLeft", label: "←" },
  { code: "ArrowDown", label: "↓" },
  { code: "ArrowRight", label: "→" },
];

const ALL_ROWS: KeyDef[][] = [ROW_1, ROW_2, ROW_3, ROW_4, ROW_5];

function distSq(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  const d = distSq(x1, y1, x2, y2);
  return d === 0 ? 0 : Math.sqrt(d);
}

interface AnimatingWave {
  time: number;
  macro: string;
  color: string;
}

interface KeyElementWithMacro extends HTMLElement {
  _macroDistances?: Record<string, number>;
}

const KEY_CHAR_MAP: Record<string, string> = {
  Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5",
  Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0",
  Minus: "-", Equal: "=",
  BracketLeft: "[", BracketRight: "]", Backslash: "\\",
  Semicolon: ";", Quote: "'",
  Comma: ",", Period: ".", Slash: "/",
  Space: " ",
};

function setReactInputValue(input: HTMLInputElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function typeKeyIntoInput(code: string, isCaps: boolean) {
  // Find currently active input, or fallback to the terminal input
  let targetInput = document.activeElement as HTMLInputElement | null;
  if (!targetInput || (targetInput.tagName !== "INPUT" && targetInput.tagName !== "TEXTAREA")) {
    const terminalInput = document.querySelector<HTMLInputElement>('input[data-terminal-input="true"]');
    if (terminalInput) {
      terminalInput.focus({ preventScroll: true });
      targetInput = terminalInput;
    }
  }

  if (!targetInput) return;

  // Make sure input is focused without scrolling page
  if (document.activeElement !== targetInput) {
    targetInput.focus({ preventScroll: true });
  }

  if (code === "Enter") {
    const enterEvt = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      cancelable: true,
    });
    targetInput.dispatchEvent(enterEvt);
    return;
  }

  if (code === "ArrowUp") {
    const upEvt = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      code: "ArrowUp",
      bubbles: true,
      cancelable: true,
    });
    targetInput.dispatchEvent(upEvt);
    return;
  }

  if (code === "ArrowDown") {
    const downEvt = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      code: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    targetInput.dispatchEvent(downEvt);
    return;
  }

  const start = targetInput.selectionStart ?? targetInput.value.length;
  const end = targetInput.selectionEnd ?? targetInput.value.length;

  if (code === "ArrowLeft") {
    const newPos = Math.max(0, start - 1);
    targetInput.setSelectionRange(newPos, newPos);
    return;
  }

  if (code === "ArrowRight") {
    const newPos = Math.min(targetInput.value.length, end + 1);
    targetInput.setSelectionRange(newPos, newPos);
    return;
  }

  if (code === "Backspace") {
    if (start === end) {
      if (start > 0) {
        const newValue = targetInput.value.slice(0, start - 1) + targetInput.value.slice(end);
        setReactInputValue(targetInput, newValue);
        targetInput.setSelectionRange(start - 1, start - 1);
      }
    } else {
      const newValue = targetInput.value.slice(0, start) + targetInput.value.slice(end);
      setReactInputValue(targetInput, newValue);
      targetInput.setSelectionRange(start, start);
    }
    return;
  }

  let charToInsert: string | null = null;
  if (code.startsWith("Key") && code.length === 4) {
    const letter = code.slice(3);
    charToInsert = isCaps ? letter.toUpperCase() : letter.toLowerCase();
  } else if (KEY_CHAR_MAP[code]) {
    charToInsert = KEY_CHAR_MAP[code];
  }

  if (charToInsert) {
    const newValue = targetInput.value.slice(0, start) + charToInsert + targetInput.value.slice(end);
    setReactInputValue(targetInput, newValue);
    const newCursor = start + charToInsert.length;
    targetInput.setSelectionRange(newCursor, newCursor);
  }
}

export default function InteractiveKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const bubbleIdCounter = useRef(0);
  const lastBubbleTimeRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const keyboard = keyboardRef.current;
    if (!keyboard) return;

    const rotation = { x: 20, y: 0 };
    const animating: AnimatingWave[] = [];
    const keysDown = new Set<number>();
    const keyCodeToEle = new Map<string, HTMLElement>();
    const allKeys = Array.from(keyboard.querySelectorAll<KeyElementWithMacro>(".key"));

    allKeys.forEach((ele) => {
      const code = ele.dataset.code;
      if (code) {
        keyCodeToEle.set(code, ele);
      }
    });

    const capsLockKeyIndex = allKeys.indexOf(keyCodeToEle.get("CapsLock") as KeyElementWithMacro);
    const macroKeys = Array.from(
      keyboard.querySelectorAll<KeyElementWithMacro>('[data-code="Escape"], [data-macro]')
    );
    const furthestKeys: Record<string, number> = {};

    // Precalculate distances for ripple effect
    const calculateDistances = () => {
      const allKeyBounds = allKeys.map((n) => n.getBoundingClientRect());
      for (const macro of macroKeys) {
        const index = allKeys.indexOf(macro);
        const color = macro.dataset.macro || "";
        furthestKeys[color] = 0;
        const macroBounds = allKeyBounds[index];
        if (!macroBounds) continue;

        for (let i = 0; i < allKeys.length; i++) {
          const ele = allKeys[i];
          if (macro === ele) continue;
          const eleBounds = allKeyBounds[i];
          if (!eleBounds) continue;

          const d = dist(
            macroBounds.x + macroBounds.width * 0.5,
            macroBounds.y + macroBounds.height * 0.5,
            eleBounds.x + eleBounds.width * 0.5,
            eleBounds.y + eleBounds.height * 0.5
          );

          ele._macroDistances = ele._macroDistances || {};
          ele._macroDistances[color] = d;
          if (d > furthestKeys[color]) {
            furthestKeys[color] = d;
          }
        }
      }
    };

    const initialRaf = requestAnimationFrame(calculateDistances);

    let rafId: number | null = null;

    const draw = (now: number) => {
      if (animating.length === 0) return;
      const actions: (boolean | string)[] = Array(allKeys.length).fill(false);
      keysDown.forEach((i) => {
        actions[i] = true;
      });

      const dilation = 90;
      for (let i = animating.length - 1; i >= 0; i--) {
        const a = animating[i];
        const time = now - a.time;
        const duration = (furthestKeys[a.macro] || 250) + dilation;
        if (time >= duration) {
          animating.splice(i, 1);
          continue;
        }

        for (let keyIndex = 0; keyIndex < allKeys.length; keyIndex++) {
          const key = allKeys[keyIndex];
          const d = key._macroDistances ? key._macroDistances[a.macro] ?? 0 : 0;
          const t = Math.abs(time - d);
          if (t < dilation && !actions[keyIndex]) {
            actions[keyIndex] = a.color;
          }
        }
      }

      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        const action = actions[i];
        if (action) {
          key.dataset.selected = "true";
          if (typeof action === "string") {
            key.dataset.color = action;
          }
        } else {
          key.dataset.color = "";
          key.dataset.selected = "false";
        }
      }
    };

    const loop = (timestamp: number) => {
      draw(timestamp);
      if (animating.length > 0) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
        for (const ele of keyboard.querySelectorAll<HTMLElement>(
          '[data-selected="true"], [data-color]'
        )) {
          const index = allKeys.indexOf(ele as KeyElementWithMacro);
          if (!keysDown.has(index)) {
            ele.dataset.selected = "false";
            ele.dataset.color = "";
          }
        }
      }
    };

    const animateMacro = (ele: HTMLElement) => {
      const macro = ele.dataset.macro;
      if (!macro) return;
      const [color, id] = macro.split(":");
      if (!keysDown.has(capsLockKeyIndex)) {
        if (["Space", "ShiftLeft"].includes(id)) {
          return;
        }
      }

      animating.push({ time: performance.now(), macro, color: color || "green" });
      if (!rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const spawnBubble = (code?: string, repeat = false) => {
      const char = code ? LABEL_MAP[code] : undefined;
      if (!char) return;

      // Throttle repeat key events (when a key is held down)
      if (repeat && code) {
        const now = performance.now();
        if (now - (lastBubbleTimeRef.current[code] || 0) < 120) {
          return;
        }
        lastBubbleTimeRef.current[code] = now;
      }

      const container = containerRef.current;
      const keyboard = keyboardRef.current;
      if (!container || !keyboard) return;

      const cRect = container.getBoundingClientRect();
      const kRect = keyboard.getBoundingClientRect();

      // Horizontal: Align with the column of the typed key, or center of keyboard
      let x = kRect.left - cRect.left + kRect.width / 2;
      const keyEle = code ? keyCodeToEle.get(code) : undefined;
      if (keyEle) {
        const elRect = keyEle.getBoundingClientRect();
        x = elRect.left - cRect.left + elRect.width / 2;
      }

      // Vertical: Appear directly ABOVE the keyboard component
      const y = (kRect.top - cRect.top) - 14;

      const driftX = (Math.random() - 0.5) * 20;
      const id = ++bubbleIdCounter.current;

      setBubbles((prev) => [...prev.slice(-25), { id, char, x, y, driftX }]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, 1400);
    };

    // Click handler on keys
    const handleKeyClick = (ele: KeyElementWithMacro) => {
      playKeySound();
      const code = ele.dataset.code;
      if (code && LABEL_MAP[code]) {
        spawnBubble(code, false);
      }
      if (code === "CapsLock") {
        const isCurrentlyActive = keysDown.has(capsLockKeyIndex);
        setKeyState("CapsLock", !isCurrentlyActive);
        return;
      }
      if (code) {
        const isCaps = keysDown.has(capsLockKeyIndex);
        typeKeyIntoInput(code, isCaps);
      }
      if (ele.dataset.macro) {
        animateMacro(ele);
      } else {
        // Pulse key on click
        ele.dataset.selected = "true";
        setTimeout(() => {
          ele.dataset.selected = "false";
        }, 150);
      }
    };

    const setKeyState = (code: string, state: boolean) => {
      const ele = keyCodeToEle.get(code);
      if (ele) {
        const index = allKeys.indexOf(ele as KeyElementWithMacro);
        if (state) {
          keysDown.add(index);
          ele.dataset.selected = "true";
        } else {
          ele.dataset.selected = "false";
          keysDown.delete(index);
          if (macroKeys.includes(ele as KeyElementWithMacro)) {
            animateMacro(ele);
          }
        }
      }
    };

    // Mouse drag rotation state
    let isPointerDown = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotX = 20;
    let startRotY = 0;
    let clickedKey: KeyElementWithMacro | null = null;

    const onKeyboardPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();

      isPointerDown = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startRotX = rotation.x;
      startRotY = rotation.y;
      clickedKey = (e.target as HTMLElement).closest<KeyElementWithMacro>(".key");
    };

    const onWindowPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (!hasDragged && Math.hypot(dx, dy) > 4) {
        hasDragged = true;
        keyboard.classList.add("is-dragging");
        document.body.style.cursor = "grabbing";
      }

      if (hasDragged) {
        // Drag vertically rotates around X-axis (pitch)
        rotation.x = Math.max(-5, Math.min(55, startRotX - dy * 0.35));
        // Drag horizontally rotates around Y-axis (yaw)
        rotation.y = Math.max(-50, Math.min(50, startRotY + dx * 0.35));

        keyboard.style.setProperty("--rot-x", `${rotation.x}deg`);
        keyboard.style.setProperty("--rot-y", `${rotation.y}deg`);
      }
    };

    const onWindowPointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      keyboard.classList.remove("is-dragging");
      document.body.style.cursor = "";

      // Single click: trigger key click exactly once without duplication
      if (!hasDragged && clickedKey) {
        handleKeyClick(clickedKey);
      }
      clickedKey = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code.startsWith("F") && !isNaN(Number(e.code.slice(1)))) {
        return;
      }
      playKeySound(e.repeat);
      if (LABEL_MAP[e.code]) {
        spawnBubble(e.code, e.repeat);
      }

      // Handle CapsLock toggle directly
      if (e.code === "CapsLock") {
        const currentlyActive = keysDown.has(capsLockKeyIndex);
        setKeyState("CapsLock", !currentlyActive);
        return;
      }

      // Synchronize CapsLock modifier state from the OS
      if (typeof e.getModifierState === "function") {
        setKeyState("CapsLock", e.getModifierState("CapsLock"));
      }

      // Do not block typing inside form inputs or textareas!
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
        setKeyState(e.code, true);
        return;
      }

      setKeyState(e.code, true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === "function") {
        setKeyState("CapsLock", e.getModifierState("CapsLock"));
      }
      if (e.code === "CapsLock") {
        return;
      }
      setKeyState(e.code, false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (typeof e.getModifierState === "function") {
        setKeyState("CapsLock", e.getModifierState("CapsLock"));
      }
    };

    const onBlur = () => {
      animating.length = 0;
      for (const ele of keyboard.querySelectorAll<HTMLElement>(
        '[data-selected="true"], [data-color]'
      )) {
        const index = allKeys.indexOf(ele as KeyElementWithMacro);
        if (index !== capsLockKeyIndex) {
          ele.dataset.selected = "false";
          ele.dataset.color = "";
          keysDown.delete(index);
        }
      }
    };

    keyboard.addEventListener("pointerdown", onKeyboardPointerDown);
    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("blur", onBlur);

    return () => {
      cancelAnimationFrame(initialRaf);
      if (rafId) cancelAnimationFrame(rafId);
      keyboard.removeEventListener("pointerdown", onKeyboardPointerDown);
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        // Prevent clicking keyboard from blurring the active terminal input or losing cursor
        e.preventDefault();
      }}
      className="interactive-keyboard-container relative w-full overflow-visible flex items-center justify-center lg:justify-start"
    >
      <div ref={keyboardRef} className="interactive-keyboard">
        {ALL_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="keyboard-row">
            {row.map((key, keyIdx) => (
              <div
                key={keyIdx}
                className={`key ${key.label ? "has-label" : ""} ${key.className || ""}`}
                data-code={key.code}
                data-macro={key.macro}
              >
                {key.label && <span className="key-char">{key.label}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Floating Key Bubbles Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="floating-key-bubble"
            style={
              {
                left: `${b.x}px`,
                top: `${b.y}px`,
                "--drift-x": `${b.driftX}px`,
              } as React.CSSProperties
            }
          >
            {b.char}
          </div>
        ))}
      </div>
    </div>
  );
}
