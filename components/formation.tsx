"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import Player, { PlayerType } from "./player";
import dataFormations from "@/data/formations.json";
import dataPlayers from "@/data/players.json";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { toPng } from "html-to-image";

type Formation = {
  name: string;
  positions: string[];
};

export interface FormationTeam {
  position: string;
  player: PlayerType | null;
}

export default function Formation() {
  const players: PlayerType[] = dataPlayers;
  const formations: Formation[] = dataFormations;
  const [value, setValue] = React.useState("");
  const elementRef: React.MutableRefObject<null> = useRef(null);
  const [formation, setFormation] = useState<FormationTeam[]>([]);
  const [formationName, setFormationName] = useState<string>('4-4-2');

  const htmlToImageConvert = () => {
    if (elementRef.current) {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "ma-compo.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      console.log('error')
    }
  };

  async function handleUpdatePlayerName(position: string, playerName: string) {
    setFormation((prevFormation: FormationTeam[]) =>
      prevFormation.map((p) => {
        if (p.position === position) {
          const updatedPlayer =
            players.find((player) => player.fullname === playerName) ?? null;
          return { position: p.position, player: updatedPlayer };
        }
        return p;
      }),
    );

    handleSaveFormation();
  }
  
  useEffect(() => {
    const savedFormation = localStorage.getItem('formation');
    if (savedFormation) {
      setFormation(JSON.parse(savedFormation));
    }
  }, []);

  useEffect(() => {
    const savedFormation = localStorage.getItem('formationName');
    if (savedFormation) {
      setFormationName(savedFormation);
    }
  }, []);
  
  async function handleUpdateFormation(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newFormationName = event.target.value;
    const newFormation = formations.find((f) => f.name === newFormationName);

    if (newFormation) {
      const newFormationPlayers = newFormation.positions.map(
        (position: string) => {
          const playerData = players.find((p) => p.position === position);
          return { position, player: playerData ?? null };
        }
      );

      setFormation(newFormationPlayers);
      handleSaveFormationName(newFormationName)
      handleSaveFormation();
    }
  }

  const handleSaveFormation = () => {
    localStorage.setItem('formation', JSON.stringify(formation));
  };

  const handleSaveFormationName = (name: string) => {
    localStorage.setItem('formationName', name);
  };

  return (
    <div className="compo">
      <Card className="lg:max-w-[300px] w-full">
        <CardHeader className="flex gap-3"></CardHeader>
        <CardBody>
          <Select
            label="Sélectionnez une formation"
            placeholder="Sélectionnez une formation"
            onChange={handleUpdateFormation}
            className="w-full"
            defaultSelectedKeys={[formationName]}
          >
            {formations.map((form) => (
              <SelectItem key={form.name} value={form.name}>
                {form.name}
              </SelectItem>
            ))}
          </Select>
        </CardBody>
        <Divider />
        <CardFooter className="m-auto">
          <Button onClick={htmlToImageConvert}>Télécharger</Button>
        </CardFooter>
      </Card>
      <Card className="lg:max-w-[450px] w-full">
      <CardHeader className="flex gap-3">Ma compo</CardHeader>
      <div ref={elementRef} className="field bg-2">
        <div className="players">
          {formation.map(({ position, player }) => {
            const filteredPlayers = players.filter((p) => {
              if (position === "gk") {
                return p.position === "Gardien";
              } else {
                return p.position !== "Gardien";
              }
            });

            return (
              <Player
                key={position}
                position={position}
                player={player}
                players={filteredPlayers}
                onPlayerChange={handleUpdatePlayerName}
              />
            );
          })}
        </div>
      </div>
      </Card>
    </div>
  );
}
