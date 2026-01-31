# ClosetMATE - AI-Powered Wardrobe Management Mobile App 

## Description
ClosetMate is a full-stack mobile application that helps users digitize their wardrobe, automatically categorize clothes using AI, and plan daily outfits.

The app combines computer vision, cloud storage, and a scalable REST backend to simplify wardrobe organization and outfit creation.

Built as a pet project to practice React Native, TypeScript, backend development, and AI integrations in a real-world scenario.

## Features
- 📸 Upload clothing photos from camera or gallery
- ✂️ Automatic background removal and image preprocessing
- 🤖 AI-based clothing recognition and categorization (OpenAI API)
- 🗂 Digital wardrobe management
- 👕 Interactive outfit builder with drag-and-drop canvas
- 📅 Outfit planning and saving
- ☁️ Cloud image storage (AWS S3)
- 🔐 Authentication and REST API integration

## Stack
### Frontend:
- React Native
- TypeScript
- Expo
### Backend:
- Spring Boot (Java)
- REST API
### Cloud & Services:
- OpenAI API (image categorization)
- OpenWeatherMap API (weather forecast for outfits generation)
- AWS S3 (file storage)

## Screenshots
### Main Pages
<img width="287" height="558" alt="image" src="https://github.com/user-attachments/assets/44ae9b7c-4719-47cd-a95a-b5118d57e10f" />
<img width="274" height="562" alt="image" src="https://github.com/user-attachments/assets/dd968542-4159-4489-a9ab-f490fae590d0" />
<img width="280" height="564" alt="image" src="https://github.com/user-attachments/assets/824dbda4-0836-4da8-9fea-aec59841ae78" />


### Example of adding clothes to canvas
<img width="293" height="594" alt="image" src="https://github.com/user-attachments/assets/2ff3fe7d-24d7-45bb-9cdc-9a4a2bbbe70e" />
<img width="296" height="594" alt="image" src="https://github.com/user-attachments/assets/61fe8ca9-642c-4a56-8646-20d6fda463ea" />
<img width="292" height="588" alt="image" src="https://github.com/user-attachments/assets/5f8c3272-d84c-496b-8f62-2f81381ce855" />

### Example of generating outfits
<img width="283" height="566" alt="image" src="https://github.com/user-attachments/assets/4c966ad8-ed57-4d97-ba01-25c346d50c60" />
<img width="282" height="570" alt="image" src="https://github.com/user-attachments/assets/37415849-af42-490a-8d8e-acf4335c17cd" />


## How to Run
1. Clone repositories
   ```
   git clone https://github.com/vyllian/closetMATE.git 
   git clone https://github.com/vyllian/ClosetMATE_Front.git
   ```
2.	Server Side

Go to closetMATE/src/main/resources. Create «application.properties» with personal secret API keys.

3. Database
   ```
      docker compose up -d
   ```
4. Client Side

Go to api.ts, put your IP address there, then go to closetMATE_Front, run:
   ```
   npm install
   npx expo start
   ```

## Challenges
During development I worked on:
- Integrating AI services (OpenAI API) for automatic categorization
- Designing RESTful APIs and client–server communication
- Handling large image uploads and cloud storage (AWS S3)
- Building an interactive drag-and-drop canvas UI
- Structuring a full-stack project with clear separation of concerns
- Managing async operations and network states in mobile apps
- Improving performance and user experience

This project helped me gain hands-on experience with real production-like architecture and full-stack development.
