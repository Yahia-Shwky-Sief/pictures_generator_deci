"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import FileInputButton from "@/components/inputs/file_input_button";
import Button from "@/components/buttons/button";
import NumberInput from "@/components/inputs/number_input_vutoon";
import Row from "@/components/row";
export default function Home() {
  const [image, setImage] = useState<string>(
    "https://static.thenounproject.com/png/212328-200.png"
  );
  const [imageLink, setImageLink] = useState<string>("");
  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(200);
  function restart() {
    setImage("https://static.thenounproject.com/png/212328-200.png");
    setImageLink("");
  }
  return (
    <main>
      <Row>
        <NumberInput
          value={width}
          onChange={function (value: number): void {
            restart();
            setWidth(value);
          }}
        />
        <NumberInput
          value={height}
          onChange={function (value: number): void {
            restart();
            setHeight(value);
          }}
        />
      </Row>
      <div style={{ height: "10px" }}></div>
      <Row>
        <FileInputButton
          onFileSelect={async function (file: File | null): Promise<void> {
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              try {
                const response = await fetch(
                  `http://localhost:3001/api/uploadCustomImage?width=${width}&height=${height}`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const responseBody = await response.json();
                const obj = { status: response.status, body: responseBody };
                setImage(`${obj.body["imageUrl"]}`);
                setImageLink(`${obj.body["imageUrl"]}`);
                console.log(obj.body, obj.status);
                console.log(width);
              } catch (error) {
                console.log(error);
              }
            }
          }}
        />
        <Button
          label={"Get Random Image"}
          onClick={async function (): Promise<void> {
            try {
              const response = await fetch(
                `http://localhost:3001/api/getRandomImage?width=${width}&height=${height}`,
                {
                  method: "POST",
                }
              );
              const responseBody = await response.json();
              const obj = { status: response.status, body: responseBody };
              setImage(`${obj.body["imageUrl"]}`);
              setImageLink(`${obj.body["imageUrl"]}`);
              console.log(obj.body, obj.status);
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Row>
      <div style={{ height: "40px" }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={image}
          width={width}
          height={height}
          alt="Picture of the author"
          onLoad={() => console.log("Image loaded successfully")}
          onError={() => console.log("Error loading image")}
          style={{ border: "2px solid black", borderRadius: "4px" }}
          loading="lazy"
        />
        <div style={{height: '20px'}}></div>
        <p style={{ color: '#333', fontSize: '16px'  }}>link: {imageLink}</p>
      </div>
    </main>
  );
}
