# Ascend AI

## Getting Started

Install `nvm` to manage node versions, and make sure `v19.1.0` is one of the versions installed. Run this to setup your node environment.

```shell
nvm use
```

Run the development server:

```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data

I've found vector embeddings work better when PDF documentation is converted to text format. Place PDF files in the `/public` folder and run the included python script to convert them.

```shell
python3 ./scripts/convert_pdf.py
```

Text files will show up in the `/training` folder.

## Pineconne

To create vector embeddings from TXT docs, place them in the `/training` folder, run the app in the local/dev environment, and enable the `CreateEmbeddings` component on the documents page. You'll see a button appear.

Pinecone is eventually consistent, so there can be a delay before your upserted vectors are available to query. Use the describe_index_stats operation to check if the current vector count matches the number of vectors you upserted:

```shell
PINECONE_API_KEY=
INDEX_HOST=

curl -X POST "https://$INDEX_HOST/describe_index_stats" \
  -H "Api-Key: $PINECONE_API_KEY" \
```
