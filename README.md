# Twitter_Media
A React Native/Expo app to filter twitter's media. This app is a better way to view medias like photos and videos of an user in Twitter with a layout similar to instagram.

## Getting Started

* Clone the repo: 

```bash
$ git clone https://github.com/Vinicius-8/Twitter_Media.git

```

* Create a file called credentials.tsx at src folder and put your [Twitter keys](https://developer.twitter.com/en/docs/authentication/oauth-1-0a) to use the Twitter API:  
```tsx
const API_KEY = ''
const API_SECRET_KEY = ''
const ACCESS_TOKEN = ''
const ACCESS_TOKEN_SECRET = ''

export default {
    apiKey: API_KEY, 
    apiSecretKey: API_SECRET_KEY,     
    accessToken: ACCESS_TOKEN,
    accessTokenSecret: ACCESS_TOKEN_SECRET
};
```

* Install and run:
```bash
$ yarn install
$ expo start
```

 You can download the app on [Google Play Store](https://play.google.com/store/apps/details?id=com.oytu.ttedia) 
