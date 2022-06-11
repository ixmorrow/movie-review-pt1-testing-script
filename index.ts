const {
    Connection,
    sendAndConfirmTransaction,
    Keypair,
    Transaction,
    PublicKey,
    TransactionInstruction,
    SystemProgram
  } = require("@solana/web3.js");
  import { Buffer } from 'buffer';
  import * as borsh from "@project-serum/borsh";

  const RPC_ENDPOINT_URL = "https://api.devnet.solana.com";
  const commitment = 'confirmed';
  const connection = new Connection(RPC_ENDPOINT_URL, commitment);

  // YOUR PROGRAM ID HERE //
  const program_id = new PublicKey("");

  //MY WALLET SETTING
  // const id_json_path = require('os').homedir() + "/.config/solana/test-wallet.json";
  // const secret = Uint8Array.from(JSON.parse(require("fs").readFileSync(id_json_path)));
  // const wallet = Keypair.fromSecretKey(secret as Uint8Array);

  
  const createReviewIx = (i: Buffer, feePayer: typeof PublicKey, movie: typeof PublicKey) => {
    return new TransactionInstruction({
      keys: [
        {
            pubkey: feePayer,
            isSigner: true,
            isWritable: false,
        },
        {
          pubkey: movie,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }
      ],
      data: i,
      programId: program_id,
    });
  };

  const updateReviewIx = (i: Buffer, feePayer: typeof PublicKey, movie: typeof PublicKey) => {
    return new TransactionInstruction({
      keys: [
        {
            pubkey: feePayer,
            isSigner: true,
            isWritable: false,
        },
        {
          pubkey: movie,
          isSigner: false,
          isWritable: true,
        }
      ],
      data: i,
      programId: program_id,
    });
  };

  const IX_DATA_LAYOUT = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);


  async function createNewReview(title: string, rating: number, description: string, feePayer: typeof Keypair) {

    console.log("Program id: " + program_id.toBase58());
    console.log("Fee payer: " + feePayer.publicKey);

    const tx = new Transaction();

    let utf8Encode = new TextEncoder();
    let buff = utf8Encode.encode(title);

    const review_pda = (await PublicKey.findProgramAddress(
      [feePayer.publicKey.toBuffer(), buff],
      program_id
    ))[0];

    const payload = {
      variant: 0,
      title: title,
      rating: rating,
      description: description,
    }
    const msgBuffer = Buffer.alloc(1000);
    IX_DATA_LAYOUT.encode(payload, msgBuffer);
    const postIxData = msgBuffer.slice(0, IX_DATA_LAYOUT.getSpan(msgBuffer));

    console.log("creating init instruction");

    const ix = createReviewIx(postIxData, feePayer.publicKey, review_pda);
    tx.add(ix);

    if ((await connection.getBalance(feePayer.publicKey)) < 1.0) {
        console.log("Requesting Airdrop of 2 SOL...");
        await connection.requestAirdrop(feePayer.publicKey, 2e9);
        console.log("Airdrop received");
      }
  

    let signers = [feePayer];

    console.log("sending tx");
    let txid = await sendAndConfirmTransaction(connection, tx, signers, {
      skipPreflight: true,
      preflightCommitment: "confirmed",
      confirmation: "confirmed",
    });
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`);

  }

  async function updateReview(review_pda: typeof PublicKey, title: string, rating: number, description: string, feePayer: typeof Keypair){
    console.log("Program id: " + program_id.toBase58());
    console.log("Fee payer: " + feePayer.publicKey);

    const tx = new Transaction();

    let utf8Encode = new TextEncoder();
    //let buff = utf8Encode.encode(title);

    // const review_pda = (await PublicKey.findProgramAddress(
    //   [feePayer.publicKey.toBuffer(), buff],
    //   program_id
    // ))[0];

    const payload = {
      variant: 1,
      title: title,
      description: description,
      rating: rating,
    }
    const msgBuffer = Buffer.alloc(1000);
    IX_DATA_LAYOUT.encode(payload, msgBuffer);
    const postIxData = msgBuffer.slice(0, IX_DATA_LAYOUT.getSpan(msgBuffer));

    console.log("creating update instruction");

    const ix = updateReviewIx(postIxData, feePayer.publicKey, review_pda);
    tx.add(ix);

    if ((await connection.getBalance(feePayer.publicKey)) < 1.0) {
        console.log("Requesting Airdrop of 2 SOL...");
        await connection.requestAirdrop(feePayer.publicKey, 2e9);
        console.log("Airdrop received");
      }
  

    let signers = [feePayer];

    console.log("sending tx");
    let txid = await sendAndConfirmTransaction(connection, tx, signers, {
      skipPreflight: true,
      preflightCommitment: "confirmed",
      confirmation: "confirmed",
    });
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`);

  }

  async function createAndUpdateReview(title: string, rating: number, description: string, updatedRating: number, updatedDescription: string, feePayer: typeof PublicKey){
    await createNewReview(title, rating, description, feePayer)

    let utf8Encode = new TextEncoder();
    let buff = utf8Encode.encode(title);

    const review_pda = (await PublicKey.findProgramAddress(
      [feePayer.publicKey.toBuffer(), buff],
      program_id
    ))[0];

    console.log("Derived PDA: ", review_pda.toBase58())

    await updateReview(review_pda, title, updatedRating, updatedDescription, feePayer)
  }

  

  async function main(){

    const feePayer = Keypair.generate()

    createAndUpdateReview("Pulp Fiction", 5, "Samual L with a fro", 5, "Royale with Cheese", feePayer)
    
  }

  main()