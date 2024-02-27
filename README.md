## Getting Started

First, install the dependencies:

```bash
npm i
```

Second, run the development server:

```bash
npm npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br>

## The site is Live!

Site is live at https://greatest-weather-app.vercel.app/

<br>

## Interesting Technical Bits

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Libraries and apis used in this repository:

1. Typescript
2. ReactJS
3. NodeJS
4. NextJS
5. Tailwind CSS
6. Zustand
7. eslint
8. Prettier
9. Google Places API
10. Google Geocoding API
11. OpenWeatherMap API
12. AWS Lambda
13. AWS Gateway

<br>
Client code lives in directories.

1. /pages
2. /components
3. /public
4. /stores
5. /styles
6. /types

API (AWS Lambdas) live in directory: /pages/api/\*\*.

Next uses React as it's engine for manipulating the client browser. Next has conventions and configurations built in that abstracts much of the the compiling/transpiling decisions from the developer. If you want to know more, visit https://nextjs.org/.

Next, as seen in this repository, has the ability to write aws lambdas which serve as an API for the project.

<br>
The Server deployments TLDR is:

1. Next build step builds and bundles API and Client in to a .next folder.
2. Builds serverless functions, each api routes located under pages/api. This will include a light http wrapper for each function.
3. Packages the lambda function code with the necessary nodejs runtime all in a ZIP file that AWS lambda requires.
4. Deploys these functions with a simple API GATEWAY layer in front of the the Lambda functions. This will route all http calls to their appropriate lambda functions.
5. When an HTTP request is made to an API route, API Gateway receives the request and triggers the corresponding Lambda function. The Lambda function executes in a stateless, containerized environment, processing the request and returning a response. The response is then relayed back to the client through API Gateway.

<br>
The Client deployments TLDR is:

1. Next build step builds (transpiles) static assets and javascript.
2. Vercel and other tools like so will put these static assets on their CDNs.
3. Next supports SSR, SSG, and Client side rendering. All cases are a little different. SSR requests are made back to AWS API GATEWAY + Lambda. SSG hydrates dynamic html at build step to build a static html SEO friendly. CSR, CDN will render upon initial domain request, after that, dynamic client side js will handle all routing.

<br>
Using a company like Vercel, Supabase or Netlify, can simplify these processes.
