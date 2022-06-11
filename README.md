# movie-review-pt1-testing-script
Script written to test programs written for the Movie Review Pt.1 lesson of the [Solana Course]("https://github.com/Unboxed-Software/solana-course").

To run this script, clone the repo and paste your program id in to the program_id variable.
Install dependencies
```
npm install
```
Compile TS file to JS
```
npx tsc
```
Run compile JS file
```
node index.js
```

A successful run will console log something like this
```
Program id: J3EykHhCyDJ28mjvVriAhZkUnmdcLQevzgtYwNxQJw9d
Fee payer: 51i4WsvYEdJvY6HYv6y5htCtaNdx7wbUMpHWTpoVC6Ph
creating init instruction
Requesting Airdrop of 2 SOL...
Airdrop received
sending tx
https://explorer.solana.com/tx/3dWogzU6HYNStUBiyHbdAYsn8MT6Jv8LHR3Kpw6xeKU6LASHiitPj1mWnppQfxDfmng17C2fBtBP9auv2DXssDms?cluster=devnet
````
Don't forget to plug your program id into the script!!
