const {
    Connection,
    sendAndConfirmTransaction,
    Keypair,
    Transaction,
    PublicKey,
    TransactionInstruction,
  } = require("@solana/web3.js");
  import { Buffer } from 'buffer';
  import * as borsh from "@project-serum/borsh";

  const RPC_ENDPOINT_URL = "https://api.devnet.solana.com";
  const commitment = 'confirmed';
  const connection = new Connection(RPC_ENDPOINT_URL, commitment);

  // YOUR PROGRAM ID HERE //
  const program_id = new PublicKey("");
  // pubkey of movie review account that was already created
  const moviePubKey = new PublicKey("3WtyV8jSvkVNPPhKqC4guxW3wsXjeMVPH94EFvNumc4t")

  
  const userInputIx = (i: Buffer, feePayer: typeof PublicKey, movie: typeof PublicKey) => {
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
          isWritable: false,
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


  async function main(title: string, rating: number, description: string) {
    const feePayer = Keypair.generate();

    console.log("Program id: " + program_id.toBase58());
    console.log("Fee payer: " + feePayer.publicKey);

    const tx = new Transaction();

    let utf8Encode = new TextEncoder();
    let buff = utf8Encode.encode(title);

    const userInfo = (await PublicKey.findProgramAddress(
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

    const ix = userInputIx(postIxData, feePayer.publicKey, moviePubKey);
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

  main("Forest Gump", 5, "Run Forest, Run.")