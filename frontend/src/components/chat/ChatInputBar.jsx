import { View } from "react-native";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

export function ChatInputBar() { return <View style={{ alignItems: "flex-end", flexDirection: "row", gap: 8 }}><View style={{ flex: 1 }}><Input placeholder="Write a message" /></View><View style={{ width: 88 }}><Button title="Send" /></View></View>; }