# L1-L2 Messaging

A crucial feature of a Layer 2 is its ability to interact with Layer 1.

Starknet has its own L1 <> L2 Messaging system, which is different from its consensus mechanism and the submission of state updates on L1. Messaging is a way for smart-contracts on L1 to interact with smart-contracts on L2 (or the other way around), allowing us to do "cross-chain" transactions. For example, we can do some computations on a chain and use the result of this computation on the other chain.

Bridges on Starknet all use L1-L2 messaging. Let's say that you want to bridge tokens from Ethereum to Starknet. You will simply have to deposit your tokens in the L1 bridge contract, which will automatically trigger the minting of the same token on L2. Another good use case for L1-L2 messaging would be [DeFi pooling](https://starkware.co/resource/defi-pooling/).

Let's dive into the details.

## The StarknetMessaging Contract

The crucial component of the L1 <> L2 Messaging system is the [`StarknetCore`](https://etherscan.io/address/0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4) contract. It is a set of Solidity contracts deployed on Ethereum that allows Starknet to function properly. One of the contracts of `StarknetCore` is called `StarknetMessaging` and it is the contract responsible for passing messages between Starknet and Ethereum. `StarknetMessaging` follows an [interface](https://github.com/starkware-libs/cairo-lang/blob/4e233516f52477ad158bc81a86ec2760471c1b65/src/starkware/starknet/eth/IStarknetMessaging.sol#L6) with functions allowing to send message to L2, receiving messages on L1 from L2 and canceling messages.

```js
interface IStarknetMessaging is IStarknetMessagingEvents {

    function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external returns (bytes32);

    function consumeMessageFromL2(uint256 fromAddress, uint256[] calldata payload)
        external
        returns (bytes32);

    function startL1ToL2MessageCancellation(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external;

    function cancelL1ToL2Message(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload,
        uint256 nonce
    ) external;
}
```

<span class="caption"> Starknet messaging contract interface</span>

The Starknet sequencer can receive the messages sent from Ethereum to the `StarknetMessaging` contract and trigger the appropriate functions on L2, or send messages to `StarknetCore` on L1.

## Sending messages from Ethereum to Starknet

If you want to send messages from Ethereum to Starknet, your Solidity contracts must call the `sendMessageToL2` function of the `StarknetMessaging` contract. To receive these messages on Starknet, you will need to annotate functions that can be called from L1 with the `#[l1_handler]` attribute.

Let's take an example. It is adapted from the [starknet-edu L1-L2 exercises](https://github.com/starknet-edu/starknet-messaging-bridge/tree/main). It's a contract that can receive a message sent from L1 and store it, and also send a message to L1.

To give a bit of context, here we have two contracts, one on Ethereum and the other on Starknet. Both interact with each other. The goal of the workshop is to find a way to earn points by sending messages from one chain to the other.

Here is a snippet of the solidity code to send a simple message from Ethereum to Starknet:

```rust
function ex01SendMessageToL2(uint256 value) external payable{

    // This function call requires money to send L2 messages, we check there is enough
    require(msg.value>=10000000000, "Message fee missing");

    // Sending the message to the l2 contract
    // Creating the payload
    uint256[] memory payload = new uint256[](1);
    // Adding the value to the payload
    payload[0] = value;
    // Sending the message
    starknetCore.sendMessageToL2{value: 10000000000}(l2Evaluator, ex01_selector, payload);
}
```

The signature of `StarknetCore.sendMessageToL2` is:

```js
function sendMessageToL2(
        uint256 toAddress,
        uint256 selector,
        uint256[] calldata payload
    ) external override returns (bytes32);
```

In `ex01SendMessageToL2`, we first construct the message (the payload). It is an array of `uint256`. Then we call `StarknetCore.sendMessageToL2`. The first parameter is the L2 contract address. The second is the selector (or the `sn_keccak` hash of the name of the function we want to call on L2), followed by the payload. We add a fee to it as a `msg.value` because we need to pay the transaction on L2.

On the Starknet side, to receive this message, we have:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_04_L1_L2_messaging/src/lib.cairo:here}}
```

We need to add the `#[l1_handler]` attribute to our function. L1 handlers are special functions that can only be triggered by the sequencer following a message sent from L1. There is nothing particular to do to receive transactions from L1, as the message is relayed by the sequencer automatically. In your `#[l1_handler]` functions, it is important to verify the sender of the L1 message to ensure that our contract can only receive messages from a trusted L1 contract.

## Sending messages from Starknet to Ethereum

When sending messages from Starknet to Ethereum, you will have to use the `send_message_to_l1` syscall in your Cairo contracts. This syscall allows you to send messages to the `StarknetMessaging` contract on L1. Unlike L1-to-L2 messages, L2-to-L1 messages are not automatically consumed, which means that you will need your Solidity contract to call the `consumeMessageFromL2` function explicitly in order to consume the message.

To send a message from L2 to L1, what we would do on Starknet is:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_04_L1_L2_messaging/src/lib.cairo:l2l1}}
```

We simply build the payload and pass it, along with the L1 contract address, to the syscall function.

On L1, the important part is to build the same payload as on L2. Then you call `starknetCore.consumeMessageFromL2` by passing the L2 contract address and the payload.

```js
function ex02ReceiveMessageFromL2(uint256 player_l2_address, uint256 message) external payable{

        require(msg.value>=10000000000, "Message fee missing");
        // Consuming the message
        // Reconstructing the payload of the message we want to consume
        uint256[] memory payload = new uint256[](2);
        // Adding the address of the player on L2
        payload[0] = caller_l2_address;
        // Adding the message
        payload[1] = message;
        // Adding a constraint on the message, to make sure players read BOTH contracts ;-)
        require(message>3121906, 'Message too small');
        require(message<4230938, 'Message too big');

        // If the message constructed above was indeed sent by starknet, this returns the hash of the message
        // If the message was NOT sent by starknet, the cal will revert
        starknetCore.consumeMessageFromL2(l2Evaluator, payload);

        // Firing an event, for fun
        emit MessageReceived(message);
    }
```

It is important to remember that on L1 we are sending a payload of `uint256`, but the basic data type on Starknet is `felt252`; however, `felt252` are approximatively 4 bits smaller than `uint256`. So we have to pay attention to the values contained in the payload of the messages we are sending. If, on L1, we build a message with values above the maximum `felt252`, the message will be stuck and never consumed on L2.

If you want to learn more about the messaging mechanism, you can visit the [Starknet documentation](https://docs.starknet.io/documentation/architecture_and_concepts/L1-L2_Communication/messaging-mechanism/).
