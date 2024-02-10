# Auto Cortext by Ascend Engineering

## Getting Started

To run locally, or to contribute to this project, you have to follow these setup instructions. 

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

To create vector embeddings from TXT docs, place them in the `/scripts/convert/text` folder, run the app in the local/dev environment, and go to the `http://localhost:3000/dashboard/embed` page. If you have the required access, you'll see "Create index and embeddings" button. When you click this button, the text files will be taken from the `/scripts/convert/text` folder, used to create vector embeddings, and uploaded to Pinecone. When done, move the text file(s) into the `/scripts/convert/completed` folder so it is not upserted to Pinecone again.

Pinecone is eventually consistent, so there can be a delay before your upserted vectors are available to query. Use the describe_index_stats operation to check if the current vector count matches the number of vectors you upserted:

```shell
PINECONE_API_KEY=
INDEX_HOST=

curl -X POST "https://$INDEX_HOST/describe_index_stats" \
  -H "Api-Key: $PINECONE_API_KEY" \
```
