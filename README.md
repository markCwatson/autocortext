# Auto Cortext by Ascend AI Solutions

This was a Proof of Concept (POC) for a failed startup called Ascend AI Solutions (of which I was one of three co-founders... later we grew to a team of five before we shut down). Since it is a POC, I built it very quickly using Next.js - hosted on Vercel - due to the ability for rapid prototyping with this technology stack. Due to the speed of development, some corners were definitely cut. Some parts of the code are worse than others.

The featured product was called AutoCortext: an AI tool used by technicians and maintenance personnel in the manufacturing sector to help troubleshoot machinery and equipment on the shop floor.

Technicians would upload manuals and other technical documentation which would be used to train the AI. AutoCortext would then be used as an interface between the machines and the personnel.

This was a working demo we presented to many people in the manufacturing sector. We had some customers interested, but we ultimately decided not to continue with this venture. I've included some screen recordings below of some features.

Here are some notable technologies and/or features in this project:

- Next-Auth
- MongoDB
- Pinecone vector database
- AWS S3
- AWS Lambda
- Tailwind CSS
- TypeScript
- LangChain
- Retrieval Augmented Generation system
- OpenAI API
- Custom Kanban-style job board
- Custom chatbot
- Simple notification system
- Simple file system for document management
- RESTful API

### Login

Next-Auth is used for session management. Accounts were saved to a MongoDB database hosted on Atlas.

![alt-text][1]

### Docs

Users could create a simulated file system and upload and delete documents. When a file is uploaded, it is pushed to an AWS S3 bucket (see `POST /api/doc/s3-upload-ul`) which triggers an AWS Lambda function (see [this other repo](https://github.com/markCwatson/autocortext-lambdas)). The Lambda function fetches the file, converts it to plain text, then pushes it to our server (see `POST /api/setup/aws-lambda`) which breaks it into chunks and passes it through the RAG system (Retrieval Augmented Generation system).

![alt-text][2]

### Troubleshoot

This is where users would interact with AutoCortext to help them troubleshoot issues related to their equipment. The user could save their conversation into history. On save, the user could choose if the conversation should be used to help train the AI (i.e., "fine-tune", but honestly, this didn't work very well). The user could select between concise and verbose modes and choose the target audience. The response would be tailored to these selections.

![alt-text][3]

### Jobs

From the troubleshooting section, a user could create a job and add it to a custom Kanban board. The user could tag other users in the comment section on a job including AutoCortext, which would respond on the ticket.

![alt-text][4]

## Getting Started

To run locally, you have to follow these setup instructions.

## Node

You will need to run this project in a NodeJs environment using v19.1.0. The easiest way to achieve this is though the use of a Node Version Manager (NVM) tool. See next sections.

### nvm-windows (Windows)

Install the `nvm-setup.exe` executable from [here](https://github.com/coreybutler/nvm-windows/releases). When install/setup is complete, confirm by running

```shell
nvm -v
```

Now install the required version of node.

```shell
nvm install v19.1.0
```

### nvm (Mac and Linux)

Install `nvm` to manage node versions, and make sure `v19.1.0` is one of the versions installed. Run this to setup your node environment.

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

source ~/.bashrc

nvm install v19.1.0
```

### Set Node version

Go to the root of this project. Use nvm to set the correct node environment. On Mac/Linux

```shell
nvm use
```

and in a Windows powershell

```shell
nvm use $(Get-Content .nvmrc)
```

## Dependencies

Now you need NextJs and other dependencies installed on your machine. Go to the root of this project and run

```shell
npm install --force
```

## Run locally

First you need to create a `.env` file at the root of this project. Copy the `.env.example` file and rename it to `.env`. IMPORTANT: do not modify the `.env.example` file in any way. The `.env.example` file is included in the repository, and if you add secret environment variables here and it gets checked into the repository, the secret variables can be stolen by bad actors.

Get the required environment variables from Mark and add them to the new `.env` file.

Now you can run the development server:

```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data Conversion and Vector Embedding

Make sure `python3` is installed on your system. A python script is used to convert PDF files to TXT.

I've found vector embeddings work better when PDF documentation is converted to text format. Place PDF files in the `/scripts/convert/pdf` folder and run the `convert_pdf.py` python script to convert them.

```shell
python3 ./scripts/convert/convert_pdf.py
```

Text files will show up in the `/scripts/convert/text` folder. Move the PDF files to the `/scripts/convert/completed` folder when done. Talk to Mark about getting them to show up in the `/dashboard/docs` page.

## Adding new vector embeddings

To create vector embeddings from TXT docs, place them in the `/scripts/convert/text` folder, run the app in the local/dev environment, and go to the `http://localhost:3000/dashboard/embed` page. If you have the required access, you'll see "Create index and embeddings" button. When you click this button, the text files will be taken from the `/scripts/convert/text` folder, used to create vector embeddings, and uploaded to Pinecone. When done, move the text file(s) into the `/scripts/convert/completed` folder so it is not upserted to Pinecone again. On Max/Linux, combine the completed TXT files into one compressed file using:

```shell
tar czf completed.tar.gz /scripts/convert/completed
```

Pinecone is eventually consistent, so there can be a delay before your upserted vectors are available to query. Use the describe_index_stats operation to check if the current vector count matches the number of vectors you upserted:

```shell
PINECONE_API_KEY=
INDEX_HOST=

curl -X POST "https://$INDEX_HOST/describe_index_stats" \
  -H "Api-Key: $PINECONE_API_KEY" \
```

#

[1]: gif/1-login.gif 'Demo of AutoCortext login/out'
[2]: gif/2-docs.gif 'Demo of AutoCortext docs'
[3]: gif/3-tshoot.gif 'Demo of AutoCortext troubleshooting'
[4]: gif/4-jobs.gif 'Demo of AutoCortext jobs'
