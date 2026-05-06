import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Game } from "./types";

interface GameCardProps {
  game: Game;
  selected: boolean;
  onPress: () => void;
}

function GameCard({ game, selected, onPress }: GameCardProps) {
  return (
    <TouchableOpacity
      style={[gg.card, selected && gg.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <game.Icon width={52} height={52} />
      <Text style={[gg.label, selected && gg.labelSelected]} numberOfLines={2}>
        {game.label}
      </Text>
    </TouchableOpacity>
  );
}

interface GameGridProps {
  games: Game[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function GameGrid({ games, selectedId, onSelect }: GameGridProps) {
  return (
    <View style={gg.grid}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          selected={selectedId === game.id}
          onPress={() => onSelect(game.id)}
        />
      ))}
    </View>
  );
}

const gg = StyleSheet.create({
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    width: "30%",
    aspectRatio: 1.2,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 6,
  },
  cardSelected: {
    borderColor: Colors.primary,
    // borderWidth: 2,
    backgroundColor: Colors.primaryLight,
  },
  label: {
    fontFamily: "Alex_500",
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  labelSelected: {
    // fontFamily: "Alex_700",
    color: Colors.primary,
  },
});
