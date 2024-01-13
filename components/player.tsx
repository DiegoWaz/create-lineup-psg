"use client";

import React, { Key } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  AvatarIcon,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FormationTeam } from "./formation";

export interface PlayerType {
  firstname: string;
  lastname: string;
  fullname: string;
  image: string;
  position: string;
  number: number;
}

interface PlayerProps {
  position: string;
  player?: PlayerType | null;
  players: PlayerType[];
  onPlayerChange: (position: string, playerName: string) => void;
}

export default function Player({
  position,
  player,
  players,
  onPlayerChange,
}: PlayerProps) {
  const [value, setValue] = React.useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSelectorToggle = () => {
    onOpen();
  };

  const onSelectionChange = (id: Key) => {
    onPlayerChange(position, id.toLocaleString());
    onClose();
  };

  const onInputChange = (value: string) => {
    setValue(value);
  };

  const groupPlayersByPosition = (players: PlayerType[]) => {
    return players.reduce((acc: any, player) => {
      acc[player.position] = acc[player.position] || [];
      acc[player.position].push(player);
      return acc;
    }, {});
  };

  const PlayerSelector = () => {
    const groupedPlayers: PlayerType[][] = groupPlayersByPosition(players);

    return (
      <Autocomplete
        placeholder="Search a player"
        label={"Search a player"}
        onSelectionChange={onSelectionChange}
        onInputChange={onInputChange}
      >
        {Object.entries(groupedPlayers).map(([position, players]) => (
          <AutocompleteSection key={position} title={position}>
            {players.map((player: PlayerType) => (
              <AutocompleteItem
                key={player.fullname}
                textValue={player.fullname}
              >
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={player.fullname}
                    className="flex-shrink-0"
                    size="sm"
                    src={player.image}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{player.fullname}</span>
                    <span className="text-tiny text-default-400">
                      {player.position}
                    </span>
                  </div>
                </div>
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        ))}
      </Autocomplete>
    );
  };

  return (
    <div className={`position ${position}`}>
      <div onClick={handleSelectorToggle}>
        {player && Object.keys(player).length > 0 ? (
          <div className="player">
            <div className="image">
              <Avatar isBordered color="success" src={player.image} classNames={{
              base: "m-auto cursor-pointer",
            }} />
            </div>
            <div className="info">
              <div className="number">{player.number}</div>
              <div className="name">{player.lastname}</div>
            </div>
          </div>
        ) : (
          <Avatar
            icon={<AvatarIcon />}
            isBordered
            color="default"
            classNames={{
              base: "bg-white m-auto cursor-pointer",
              icon: "text-black/80",
            }}
          />
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom-center">
        <ModalContent>
          <PlayerSelector />
        </ModalContent>
      </Modal>
    </div>
  );
}
