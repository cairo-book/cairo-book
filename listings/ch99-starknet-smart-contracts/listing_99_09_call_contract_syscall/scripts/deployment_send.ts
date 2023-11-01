//    const compiledSierra = json.parse(fs.readFileSync("/Users/akashneelesh/Desktop/cairo-gateway-contracts/target/dev/router_gatewayContract.sierra.json").toString("ascii"));
// declare & deploy a Cairov2.0.0 contract.
// use Starknet.js v5.14.1, starknet-devnet 0.5.3
// launch with npx ts-node src/scripts/cairo12-devnet/1.declareThenDeployHello.ts

import {
  Provider,
  Account,
  Contract,
  hash,
  ec,
  InvokeTransactionReceiptResponse,
  RpcProvider,
  json,
  num,
  Calldata,
  HexCalldata,
  cairo,
  CallData,
  constants,
  RawArgsArray,
  uint256,
  RawCalldata,
  RawArgsObject,
  shortString,
} from "starknet";
import fs from "fs";
// import {accountTestnet4privateKey, accountTestnet4Address} from "../../A1priv/A1priv"
import * as dotenv from "dotenv";
dotenv.config();

//          👇👇👇
// 🚨🚨🚨   Launch 'starknet-devnet --seed 0 --cairo-compiler-manifest /D/Cairo1-dev/cairo/Cargo.toml --compiler-args "--add-pythonic-hints "' before using this script.
//          👆👆👆
//encode.addHexPrefix - signatureTestV5
//hash.pedersen([account, price]); -> testOfficialStarknetJs

async function main() {
  //initialize Provider
  //const provider = new Provider({ sequencer: { baseUrl: "http://127.0.0.1:5050" } });
  const provider = new Provider({
    sequencer: { network: constants.NetworkName.SN_GOERLI },
  });
  console.log("✅ Connected to Testnew.");

  // initialize existing predeployed account 0 of Devnet
  // const privateKey = "0xe3e70682c2094cac629f6fbed82c07cd";
  // const accountAddress: string = "0x7e00d496e324876bbc8531f2d9a82bf154d1a04a50218ee74cdd372f75a551a";
  const privateKey = process.env.PRIVATE_KEY as string;
  const accountAddress = process.env.ADDRESS as string;
  const account0 = new Account(provider, accountAddress, privateKey);
  console.log(
    "✅ Predeployed account connected\nOZ_ACCOUNT_ADDRESS=",
    account0.address
  );
  //console.log('OZ_ACCOUNT_PRIVATE_KEY=', privateKey);

  // Declare & deploy Test contract in devnet
  const compiledSierra = json.parse(
    fs
      .readFileSync("target/dev/syscall_sender_contract.contract_class.json")
      .toString("ascii")
  );
  const compiledCasm = json.parse(
    fs
      .readFileSync(
        "target/dev/syscall_sender_contract.compiled_contract_class.json"
      )
      .toString("ascii")
  );

  const deployResponse = await account0.declare({
    contract: compiledSierra,
    casm: compiledCasm,
  });
  const contractClassHash = deployResponse.class_hash;

  console.log("Contract Class hash =", contractClassHash);

  await provider.waitForTransaction(deployResponse.transaction_hash);

  const { transaction_hash: th2, address } = await account0.deployContract({
    classHash: contractClassHash,
  });
  console.log("contract_address =", address);
  await provider.waitForTransaction(th2);

  const myTestContract = new Contract(compiledSierra.abi, address, provider);
  console.log("✅ Test Contract connected at =", myTestContract.address);
  myTestContract.connect(account0);

  // ---------------------------------------------------------------------------------------------------------->>>
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
