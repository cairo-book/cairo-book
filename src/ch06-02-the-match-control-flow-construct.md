# The Match Control Flow Construct

<!-- TODO : update mention of chapter 18 (on patterns and matching chapter) in paragraph below -->

Cairo has an extremely powerful control flow construct called `match` that allows you to compare a value against a series of patterns and then execute code based on which pattern matches. Patterns can be made up of literal values, variable names, wildcards, and many other things. The power of match comes from the expressiveness of the patterns and the fact that the compiler confirms that all possible cases are handled.

Think of a match expression as being like a coin-sorting machine: coins slide down a track with variously sized holes along it, and each coin falls through the first hole it encounters that it fits into. In the same way, values go through each pattern in a match, and at the first pattern the value “fits”, the value falls into the associated code block to be used during execution.

Speaking of coins, let’s use them as an example using match! We can write a function that takes an unknown US coin and, in a similar way as the counting machine, determines which coin it is and returns its value in cents, as shown in Listing 6-3.

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_03/src/lib.cairo:all}}
```

Listing 6-3: An enum and a match expression that has the variants of the enum as its patterns

Let’s break down the `match` in the `value_in_cents` function. First we list the `match` keyword followed by an expression, which in this case is the value `coin`. This seems very similar to a conditional expression used with if, but there’s a big difference: with if, the condition needs to evaluate to a Boolean value, but here it can be any type. The type of coin in this example is the `Coin` enum that we defined on the first line.

Next are the `match` arms. An arm has two parts: a pattern and some code. The first arm here has a pattern that is the value `Coin::Penny(_)` and then the `=>` operator that separates the pattern and the code to run. The code in this case is just the value `1`. Each arm is separated from the next with a comma.

When the `match` expression executes, it compares the resultant value against the pattern of each arm, in order. If a pattern matches the value, the code associated with that pattern is executed. If that pattern doesn’t match the value, execution continues to the next arm, much as in a coin-sorting machine. We can have as many arms as we need: in the above example, our match has four arms.

In Cairo, the order of the arms must follow the same order as the enum.

The code associated with each arm is an expression, and the resultant value of the expression in the matching arm is the value that gets returned for the entire match expression.

We don’t typically use curly brackets if the match arm code is short, as it is in our example where each arm just returns a value. If you want to run multiple lines of code in a match arm, you must use curly brackets, with a comma following the arm. For example, the following code prints “Lucky penny!” every time the method is called with a `Coin::Penny`, but still returns the last value of the block, `1`:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/no_listing_04_match_arms/src/lib.cairo:here}}
```

## Patterns That Bind to Values

Another useful feature of match arms is that they can bind to the parts of the values that match the pattern. This is how we can extract values out of enum variants.

As an example, let’s change one of our enum variants to hold data inside it. From 1999 through 2008, the United States minted quarters with different designs for each of the 50 states on one side. No other coins got state designs, so only quarters have this extra value. We can add this information to our `enum` by changing the `Quarter` variant to include a `UsState` value stored inside it, which we’ve done in Listing 6-4.

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_04/src/lib.cairo:enum_def}}
```

Listing 6-4: A `Coin` enum in which the `Quarter` variant also holds a `UsState` value

Let’s imagine that a friend is trying to collect all 50 state quarters. While we sort our loose change by coin type, we’ll also call out the name of the state associated with each quarter so that if it’s one our friend doesn’t have, they can add it to their collection.

In the match expression for this code, we add a variable called `state` to the pattern that matches values of the variant `Coin::Quarter`. When a `Coin::Quarter` matches, the `state` variable will bind to the value of that quarter’s state. Then we can use `state` in the code for that arm, like so:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_04/src/lib.cairo:function}}
```

To print the value of a variant of an enum in Cairo, we need to add an implementation for the `print` function for the `debug::PrintTrait`:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_04/src/lib.cairo:print_impl}}
```

If we were to call `value_in_cents(Coin::Quarter(UsState::Alaska))`, `coin` would be `Coin::Quarter(UsState::Alaska)`. When we compare that value with each of the match arms, none of them match until we reach `Coin::Quarter(state)`. At that point, the binding for state will be the value `UsState::Alaska`. We can then use that binding in the `PrintTrait`, thus getting the inner state value out of the `Coin` enum variant for `Quarter`.

## Matching with Options

In the previous section, we wanted to get the inner `T` value out of the `Some` case when using `Option<T>`; we can also handle `Option<T>` using `match`, as we did with the `Coin` enum! Instead of comparing coins, we’ll compare the variants of `Option<T>`, but the way the `match` expression works remains the same.

Let’s say we want to write a function that takes an `Option<u8>` and, if there’s a value inside, adds `1` to that value. If there isn’t a value inside, the function should return the `None` value and not attempt to perform any operations.

This function is very easy to write, thanks to match, and will look like Listing 6-5.

```rust
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_05/src/lib.cairo:all}}
```

<span class="caption">Listing 6-5: A function that uses a match
expression on an `Option<u8>`</span>

Note that your arms must respect the same order as the enum defined in the `OptionTrait` of the core Cairo lib.

```rust,noplayground
enum Option<T> {
    Some: T,
    None,
}
```

Let’s examine the first execution of `plus_one` in more detail. When we call `plus_one(five)`, the variable `x` in the body of `plus_one` will have the value `Some(5)`. We then compare that against each match arm:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_05/src/lib.cairo:option_some}}
```

Does `Option::Some(5)` value match the pattern `Option::Some(val)`? It does! We have the same variant. The `val` binds to the value contained in `Option::Some`, so `val` takes the value `5`. The code in the match arm is then executed, so we add `1` to the value of `val` and create a new `Option::Some` value with our total `6` inside. Because the first arm matched, no other arms are compared.

Now let’s consider the second call of `plus_one` in our main function, where `x` is `Option::None`. We enter the match and compare to the first arm:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_05/src/lib.cairo:option_some}}
```

The `Option::Some(val)` value doesn’t match the pattern `Option::None`, so we continue to the next arm:

```rust
{{#include ../listings/ch06-enums-and-pattern-matching/listing_05_05/src/lib.cairo:option_none}}
```

It matches! There’s no value to add to, so the program stops and returns the `Option::None` value on the right side of `=>`.

Combining `match` and enums is useful in many situations. You’ll see this pattern a lot in Cairo code: `match` against an enum, bind a variable to the data inside, and then execute code based on it. It’s a bit tricky at first, but once you get used to it, you’ll wish you had it in all languages. It’s consistently a user favorite.

## Matches Are Exhaustive

There’s one other aspect of match we need to discuss: the arms’ patterns must cover all possibilities. Consider this version of our `plus_one` function, which has a bug and won’t compile:

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/no_listing_07_missing_match_arm/src/lib.cairo:here}}
```

```bash
$ scarb cairo-run --available-gas=200000000
    error: Unsupported match. Currently, matches require one arm per variant,
    in the order of variant definition.
    --> test.cairo:34:5
        match x {
        ^*******^
    Error: failed to compile: ./src/test.cairo
```

Cairo knows that we didn’t cover every possible case, and even knows which pattern we forgot! Matches in Cairo are exhaustive: we must exhaust every last possibility in order for the code to be valid. Especially in the case of `Option<T>`, when Cairo prevents us from forgetting to explicitly handle the `None` case, it protects us from assuming that we have a value when we might have null, thus making the billion-dollar mistake discussed earlier impossible.

## Match 0 and the \_ Placeholder

Using enums, we can also take special actions for a few particular values, but for all other values take one default action. Currently only `0` and the `_`operator are supported.

Imagine we’re implementing a game where, you get a random number between 0 and 7. If you have 0, you win. For all other values you lose. Here's a match that implements that logic, with the number hardcoded rather than a random value.

```rust,noplayground
{{#include ../listings/ch06-enums-and-pattern-matching/no_listing_06_match_zero/src/lib.cairo:here}}
```

The first arm, the pattern is the literal values 0. For the last arm that covers every other possible value, the pattern is the character `_`. This code compiles, even though we haven’t listed all the possible values a `felt252` can have, because the last pattern will match all values not specifically listed. This catch-all pattern meets the requirement that `match` must be exhaustive. Note that we have to put the catch-all arm last because the patterns are evaluated in order. If we put the catch-all arm earlier, the other arms would never run, so Cairo will warn us if we add arms after a catch-all!

<!-- TODO : might need to link the end of this chapter to patterns and matching chapter -->
