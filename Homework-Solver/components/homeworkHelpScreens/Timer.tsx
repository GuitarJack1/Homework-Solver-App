import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Audio } from "expo-av";

type TimerMode = "custom" | "pomodoro";

const POMODORO_WORK_DURATION = 25 * 60; // 25 minutes
const POMODORO_BREAK_DURATION = 5 * 60; // 5 minutes

export default function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("custom");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [customHours, setCustomHours] = useState("0");
  const [customMinutes, setCustomMinutes] = useState("0");
  const [customSeconds, setCustomSeconds] = useState("0");
  const [isPomodoroBreakState, setIsPomodoroBreakState] = useState(false);
  let isPomodoroBreak = false;
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    interval.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval.current!);
  }, [isRunning]);

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/timerEnd.wav") // Replace with your actual sound file
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  const handleTimerEnd = async () => {
    await playSound(); // Play the sound when timer ends
    setIsRunning(false);
    if (mode === "pomodoro") {
      const nextIsBreak = !isPomodoroBreak;
      isPomodoroBreak = nextIsBreak;
      setIsPomodoroBreakState(isPomodoroBreak);
      const nextTime = nextIsBreak
        ? POMODORO_BREAK_DURATION
        : POMODORO_WORK_DURATION;
      setSecondsLeft(nextTime);
      setIsRunning(true);
    }
  };

  const startCustomTimer = () => {
    // console.log(secondsLeft);
    if (secondsLeft == 0) {
      const hrs = isNaN(parseInt(customHours)) ? 0 : parseInt(customHours);
      const mins = isNaN(parseInt(customMinutes)) ? 0 : parseInt(customMinutes);
      const secs = isNaN(parseInt(customSeconds)) ? 0 : parseInt(customSeconds);

      //   if ([hrs, mins, secs].some((val) => isNaN(val) || val < 0)) {
      //     Alert.alert("Please enter valid hours, minutes, and seconds.");
      //     return;
      //   }

      const totalSeconds = hrs * 3600 + mins * 60 + secs;
      setSecondsLeft(totalSeconds);
    }
    setIsRunning(true);
  };

  const startPomodoro = () => {
    if (secondsLeft == 0) {
      isPomodoroBreak = false;
      setIsPomodoroBreakState(isPomodoroBreak);
      setSecondsLeft(POMODORO_WORK_DURATION);
    }
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "pomodoro") {
      isPomodoroBreak = false;
      setIsPomodoroBreakState(isPomodoroBreak);
      setSecondsLeft(POMODORO_WORK_DURATION);
    } else {
      const hrs = parseInt(customHours);
      const mins = parseInt(customMinutes);
      const secs = parseInt(customSeconds);
      const total =
        (!isNaN(hrs) ? hrs : 0) * 3600 +
        (!isNaN(mins) ? mins : 0) * 60 +
        (!isNaN(secs) ? secs : 0);
      setSecondsLeft(total);
    }
  };

  const formatTime = (secs: number): string => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "pomodoro") {
      setSecondsLeft(POMODORO_WORK_DURATION);
    } else {
      setSecondsLeft(0);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          onPress={() => handleModeChange("custom")}
          style={[styles.modeButton, mode === "custom" && styles.activeMode]}
        >
          <Text style={styles.modeText}>Custom Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleModeChange("pomodoro")}
          style={[styles.modeButton, mode === "pomodoro" && styles.activeMode]}
        >
          <Text style={styles.modeText}>Pomodoro</Text>
        </TouchableOpacity>
      </View>

      {mode === "custom" && (
        <View style={styles.inputRow}>
          <TextInput
            keyboardType="numeric"
            placeholder="hh"
            style={styles.timeInput}
            placeholderTextColor={"#00000055"}
            // value={customHours}
            onChangeText={setCustomHours}
            editable={!isRunning}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="mm"
            style={styles.timeInput}
            placeholderTextColor={"#00000055"}
            //value={customMinutes}
            onChangeText={setCustomMinutes}
            editable={!isRunning}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="ss"
            style={styles.timeInput}
            placeholderTextColor={"#00000055"}
            // value={customSeconds}
            onChangeText={setCustomSeconds}
            editable={!isRunning}
          />
        </View>
      )}

      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.controls}>
        {!isRunning && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={mode === "custom" ? startCustomTimer : startPomodoro}
          >
            <Text style={styles.controlText}>Start</Text>
          </TouchableOpacity>
        )}
        {isRunning && (
          <TouchableOpacity style={styles.controlButton} onPress={togglePause}>
            <Text style={styles.controlText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <Text style={styles.controlText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {mode == "pomodoro" && (
        <Text style={styles.pomodoroStatusText}>
          {isPomodoroBreakState ? "Break Time!" : "Work Time!"}
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "absolute",
    top: 0,
  },
  modeSwitch: {
    flexDirection: "row",
    marginBottom: 20,
    position: "absolute",
    top: 250,
  },
  modeButton: {
    backgroundColor: "#003366",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  activeMode: {
    backgroundColor: "#007AFF",
  },
  modeText: {
    color: "white",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    top: 310,
  },
  timeInput: {
    backgroundColor: "#a3b5f0",
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  timer: {
    fontSize: 72,
    color: "white",
    marginBottom: 30,
    marginTop: 80,
    top: 300,
  },
  controls: {
    flexDirection: "row",
    gap: 15,
    top: 300,
  },
  controlButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  controlText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pomodoroStatusText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    top: 370,
  },
});
