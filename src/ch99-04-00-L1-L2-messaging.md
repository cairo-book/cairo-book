# L1-L2 Messaging

A crucial feature for a layer is its ability to interact with the layer 1.

Starknet is no exception to this rule and has its own L1 <> L2 Messaging system. Here we are not talking about the consensus and the post of state updates on L1 but a way for smart-contracts on L1 to interact with smart-contracts on L2 (or the other way round). Hence we can do "cross-chain" transactions. We can do things on a chain and see the result on ther other. For instance, think about bridges. Bridges on Staknet all use L1-L2 messaging. Let's say you want to bridge tokens from Ethereum to Starknet. You will simply have to deposit your tokens in the L1 smart-contracts an it will automatically trigger the mint of the same token on L2. Another good usecase for this would be [DeFi pooling](https://starkware.co/resource/defi-pooling/).

Let's dive into the details.

The crucial component of the L1 <> L1 Messaging system is `StarknetCore`. It is a set of contracts deployed on Ethereum that allows Starknet to function properly. One of the contracts of `StarknetCore` is called `StarknetMessaging` and it plays the role of a third party between your contracts on L1 and those on L2. `StarknetMessaging` follows an [interface](https://github.com/starkware-libs/cairo-lang/blob/4e233516f52477ad158bc81a86ec2760471c1b65/src/starkware/starknet/eth/IStarknetMessaging.sol#L6) with function allowing to send message to L2, receiving messages on L1 from L2 and canceling messages. Starknet' Sequencer is able to see and receive these messages and to trigger the appropriate functions on L2 or sending messages to `StarknetCore` on L1. So on Ethereum, your contracts have to do a call to the `StarknetMessaging` contract and either call `sendMessageToL2` or `consumeMessageFromL2`. On Starknet, you must use the attribute `#[l1_handler]` on the functions that can receive messages from L1 and use the syscall `send_message_to_l1` for those sending messages to L1.

Let's take an example. It comes from the starknet-edu [repo](https://github.com/starknet-edu/starknet-messaging-bridge/tree/main).

To give a bit of context, here we have two contracts, one on L1 and the other on L2. Both interact with each other. The goal of the workshop is to find a way to earn the points.

Here is a snippet of the solidity code:

```rust
function ex01SendMessageToL2(uint256 player_l2_address, uint256 message) external payable{

    // This function call requires money to send L2 messages, we check there is enough
    require(msg.value>=10000000000, "Message fee missing");

    // Sending the message to the evaluator
    // Creating the payload
    uint256[] memory payload = new uint256[](3);
    // Adding player address on L2
    payload[0] = player_l2_address;
    // Adding player address on L1
    payload[1] = uint256(uint160(msg.sender));
    // Adding player message
    payload[2] = message;
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

In `ex01SendMessageToL2`, we first construct the message (the payload). It is an array of `uint256`. Then we call `StarknetCore.sendMessageToL2`. The first parameter is the L2 contract. The second is the selector (or the hash of the signature of the function we cant to call on L2) and then the paylod. We had a fee to it as a `msg.value` because we need to pay the transaction on L2.

On Starknet side we have:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_04_L1-L2-messaging.cairo:here}}
```

We need to add the `#[l1_handler]` attribute to our contract. This means that this function can only be used in L1 handler transactions which are special functions triggered by the sequencer according to the messages sent on L1. There is nothing particular to do to receive transactions from L1 beside that. It is important to verify the origin of the transaction so that we ensure that our contract can only receive messages from a trusted L1 contract.

To send a message in the opposite direction, what we would do on Starknet is:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_04_L1-L2-messaging.cairo:l2l1}}
```

We simply build the payload and pass it, along with the L1 contract address, to the syscall.

and on L1:

```js
function ex02ReceiveMessageFromL2(uint256 player_l2_address, uint256 message) external payable{

        require(msg.value>=10000000000, "Message fee missing");
        // Consuming the message
        // Reconstructing the payload of the message we want to consume
        uint256[] memory payload = new uint256[](2);
        // Adding the address of the player on L2
        payload[0] = player_l2_address;
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

On L1, the important part is to build the exact same payload as on L2. Then you call `starknetCore.consumeMessageFromL2` by passing the L2 contract address and the payload.

It is important to notice that when we send a message from L1 to L2, you have nothing to do on L2. The message is automatically consumed on L2 and the associated transaction triggered. But if we do the opposite, we have to manually consume the message on L1.

Another important issue to remember is that on L1 we use `uint256` and on L2 we are dealing with `felt252`. `felt252` are smaller than `uint256`. So we have to pay attention to the size of the messages we are sending. If, on L1, we build a message which size is above the maximum felt value, the message will never be consumed on L2.

If you want to learn more you can visit the [Starknet doc](https://docs.starknet.io/documentation/architecture_and_concepts/L1-L2_Communication/messaging-mechanism/).
