'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import FileInputButton from '@/components/inputs/file_input_button';
import Button from '@/components/buttons/button';
import NumberInput from '@/components/inputs/number_input_button';
import Row from '@/components/row';
import toast from 'react-hot-toast';
export default function Home() {
  const [image, setImage] = useState<string>(
    'https://static.thenounproject.com/png/212328-200.png'
  );
  const [Error, setError] = useState<string>('');
  const [imageLink, setImageLink] = useState<string>('');
  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(200);
  const [imagesList, setImagesList] = useState<
    Array<{ url: string; filename: string }>
  >([]);
  function restart() {
    setImage('https://static.thenounproject.com/png/212328-200.png');
    setImageLink('');
  }

  function getImagesList() {
    fetch(`http://localhost:3001/api/getImageList/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImagesList(data);
      })
      .catch((error) => {
        console.error('Error fetching image list:', error);
      });
  }

  useEffect(() => {
    toast.loading('Loading...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Loaded');
    }, 2000);
    getImagesList();
  }, []);

  return (
    <main>
      <div style={{ height: '10px' }}></div>
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
      <div style={{ height: '10px' }}></div>
      <Row>
        <FileInputButton
          onFileSelect={async function (file: File | null): Promise<void> {
            if (file) {
              try {
                toast.error('Error: ');
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch(
                  `http://localhost:3001/api/uploadCustomImage?width=${width}&height=${height}`,
                  {
                    method: 'POST',
                    body: formData,
                  }
                );
                const responseBody = await response.json();
                const obj = { status: response.status, body: responseBody };
                setImage(`${obj.body['imageUrl']}`);
                setImageLink(`${obj.body['imageUrl']}`);
                getImagesList();
              } catch (error) {
                toast.error('Error: ' + error);
              }
            }
          }}
        />
        <Button
          label={'Get Random Image'}
          onClick={async function (): Promise<void> {
            try {
              const response = await fetch(
                `http://localhost:3001/api/getRandomImage?width=${width}&height=${height}`,
                {
                  method: 'POST',
                }
              );
              const responseBody = await response.json();
              const obj = { status: response.status, body: responseBody };
              setImage(`${obj.body['imageUrl']}`);
              setImageLink(`${obj.body['imageUrl']}`);
              console.log(obj.body, obj.status);
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Row>
      <div style={{ height: '10px' }}></div>
      <p>Or pick image from the list below:</p>
      <Row>
        {imagesList.map((image, index) => (
          <div
            key={index}
            onClick={async () => {
              console.log(image.filename);
              try {
                const response = await fetch(
                  `http://localhost:3001/api/getSpecificImage?filename=${image.filename}&width=${width}&height=${height}`,
                  {
                    method: 'POST',
                  }
                );
                const responseBody = await response.json();
                const obj = { status: response.status, body: responseBody };
                setImage(`${obj.body['imageUrl']}`);
                setImageLink(`${obj.body['imageUrl']}`);
                console.log(obj.body, obj.status);
              } catch (error) {
                toast.error('Error: ' + error);
              }
            }}
          >
            <Image
              src={image.url}
              width={100}
              height={100}
              alt="Picture of the author"
              style={{ border: '2px solid black', borderRadius: '4px' }}
              loading="lazy"
              onError={() => setError('Error loading image')}
            />
          </div>
        ))}
      </Row>
      <div style={{ height: '100px' }}></div>
      {Error == '' ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Image
            src={image}
            width={width}
            height={height}
            alt="Picture of the author"
            onLoad={() => {
              console.log('Image loaded successfully');
              setError('');
            }}
            onError={(e) => setError(`Error loading image ${e}`)}
            style={{ border: '2px solid black', borderRadius: '4px' }}
            loading="lazy"
          />
          <div style={{ height: '20px' }}></div>
          <p style={{ color: '#333', fontSize: '16px' }}>link: {imageLink}</p>
        </div>
      ) : (
        <p style={{ color: 'red', fontSize: '16px' }}>{Error}</p>
      )}
      <div style={{ height: '10px' }}></div>
    </main>
  );
}
