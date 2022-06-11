# movie-review-testing-script
Script written to test programs written for the Movie Review Pt.3 lesson of the [Solana Course]("https://github.com/Unboxed-Software/solana-course").

To run this script, clone the repo and paste your program id in to the program_id variable.
Install dependencies
```
npm install
```
Compile TS file to JS
```
npx tsc
```
Run compiled JS file
```
node index.js
```

A successful run will console log something like this
```
Program id: J3EykHhCyDJ28mjvVriAhZkUnmdcLQevzgtYwNxQJw9d
Fee payer: DMHevqTdXiRuwZK2GRQpuvdgUT7JXvDa9xskeXjv9Ze8
creating init instruction
Requesting Airdrop of 2 SOL...
Airdrop received
sending tx
https://explorer.solana.com/tx/46gukbziQYrySFSjMXhnXrSKPMjnBZfP8Gyp3sB1VhPBiwuLELKbMB5en6Rs5xi8MxmEc19c54eJoN87u4o3SCTN?cluster=devnet
Derived PDA:  2rhzq95Du3LhRihcXEd5RJaXVZQ8h2XkvgUi1yfgThGp
Program id: J3EykHhCyDJ28mjvVriAhZkUnmdcLQevzgtYwNxQJw9d
Fee payer: DMHevqTdXiRuwZK2GRQpuvdgUT7JXvDa9xskeXjv9Ze8
creating update instruction
sending tx
https://explorer.solana.com/tx/51atjWGSNPMZGEDQCskNiNwpLcbYcMEyQZaaTHdDdAjAcT7vQwgnifXsPX2yMT6q9dWfXg4GaQK7dqqfnuWK7AEX?cluster=devnet
````
Don't forget to plug your program id into the script!!
