This project was made using ThreeJS, NextJS, Vercel, and v0.
![Screenshot 2024-09-25 022105](https://github.com/user-attachments/assets/f78b8235-f45a-4641-b74a-617f5ef3d971)

The initial prompt for the project was to use an AI service to create images and their corresponding depth maps and to visualize them in 3d with a gui for user's to tweak parameters.

When I started the project v0 was just announced; it's an AI that can write code for you. It can create typescript components that can be slotted into any repository using Vercel and the Vercel CLI. I had a lot of fun playing with this AI model and seeing the immense amount of crazy things it was able to code by just providing it with a couple of prompts. The ai model was exceptionally well at correcting itself after pointing out errors and it was starting to get scary how good it was. After I had some ui components created I set about combining them together in a project and having them displayed overlaying the Three.js canvas. I also came across Leva which is a small library similar to lil-gui. I wanted to try a new library for the gui and I was fond of the fact that the gui it creates is draggable around the entire screen. With Leva I was able to give the user the ability to tweak parameters in the scene.

To generate the images I used in the "presets", I played around with Dall-E and the Bing AI image generator. For the first prompt I tried to create something with a video game feel, and used key words such as "unreal engine 4K render scenic" I think the Bing AI is really good at this specific aesthetic. The second preset I used the prompt "hyper realistic human face painted with rainbow colors, close up nikon photo 4k". The third prompt was "Still life dark fantasy bright colors and fruits in the foreground" and finally for the fourth I wanted to do something I bit ridiculous: "a caravaggio oil painting of a cow being abducted by aliens. Realistic 4k render"

To get the depth images I tried out a few different free online services such as Midas which is a google colab available for free. ZoeDepth and Artificial Studio are two free services that you can upload an image to and it will give you back a depth map. I settled on using Artifial Studio.

![Screenshot 2024-09-25 025946](https://github.com/user-attachments/assets/56f5dd98-e6c2-4768-b839-96e5f8924136)

## Getting Started
use `npm run dev` to run locally

Click and drag to move the camera around the scene. You can also use a scroll wheel to zoom and right click to pan the camera. Use the gui at the top right to add your own image and depth map to be applied to the plane. You can also change the intensity of the environment map and the environment map blur. And check out the preset buttons to see ai generated images combined with their ai generated depth maps.

This project is deployed using vercel.
![Screenshot 2024-09-25 030503](https://github.com/user-attachments/assets/3bf31361-185d-41ec-aa6a-bafd89e3ac4e)
