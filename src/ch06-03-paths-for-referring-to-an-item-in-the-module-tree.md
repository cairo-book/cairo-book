## Paths for Referring to an Item in the Module Tree

To show Cairo where to find an item in a module tree, we use a path in the same way we use a path when navigating a filesystem. To call a function, we need to know its path.

A path can take two forms:

- An _absolute path_ is a full path starting from the crate module, in Cairo, absolute paths starts by the identifier of the crate module.
- A _relative path_ starts depends on the current module and uses `super`, or an identifier in the current module.

Both absolute and relative paths are followed by one or more identifiers
separated by double colons (`::`).

To illustrate this notion let's take back our example for the restaurant we used in the last chapter. We have a module named `front_of_house` that contains a module named `hosting`. The `hosting` module contains a function named `add_to_waitlist`. We want to call the `add_to_waitlist` function from the `eat_at_restaurant` function. We need to tell Cairo the path to the `add_to_waitlist` function so it can find it.

<span class="filename">Filename: src/lib.cairo</span>

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}


pub fn eat_at_restaurant() {
    // Absolute path
    restaurant::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles

    // Relative path Method 1
    front_of_house::hosting::add_to_waitlist(); // ✅ Compiles

    // Relative path Method 2
    super::lib::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles
}
```

The first time we call the `add_to_waitlist` function in `eat_at_restaurant`,
we use an absolute path. The `add_to_waitlist` function is defined in the same
crate as `eat_at_restaurant`. In Cairo it's not possible you need to specify the crate module identifier,
in our example it's `restaurant`.

We then included two methods to import `add_to_waitlist` with a relative path.

For the first method, the path starts with `front_of_house`, the name of the module
defined at the same level of the module tree as `eat_at_restaurant`. Here the
filesystem equivalent would be using the path
`./front_of_house/hosting/add_to_waitlist`. Starting with a module name means
that the path is relative to the current module.

The second method is similar to the first one but we use the `super` keyword to start the path from the parent module. Here the filesystem equivalent would be using the path `../front_of_house/hosting/add_to_waitlist`.

### Starting Relative Paths with `super`

Choosing whether to use a `super` or not is a decision you’ll make
based on your project, and depends on whether you’re more likely to move item
definition code separately from or together with the code that uses the item.
For example, if we move the `front_of_house` module and the `eat_at_restaurant`
function into a module named `customer_experience` like so:

<span class="filename">Filename: src/lib.cairo</span>

```rust
mod customer_experience {
    mod front_of_house {
        mod hosting {
            fn add_to_waitlist() {}

            fn seat_at_table() {}
        }

        mod serving {
            fn take_order() {}

            fn serve_order() {}

            fn take_payment() {}
        }
    }

    fn eat_at_restaurant() {
        // Absolute path
        restaurant::customer_experience::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles

        // Relative path Method 1
        front_of_house::hosting::add_to_waitlist(); // ✅ Compiles

        // Relative path Method 2
        super::customer_experience::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles
    }
}
```

We need to update the path that uses `super` because it won't compile as we added the `customer_experience` module. Now super is relative to the `customer_experience` module and not the `lib` file. Moreover we also need to update the absolute path because we moved the `front_of_house` module into the `customer_experience` module.

However, if we moved the `eat_at_restaurant` function separately into a module
named `dining` like so:

<span class="filename">Filename: src/lib.cairo</span>

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}

mod dining {
    fn eat_at_restaurant() {
        // Absolute path
        restaurant::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles

        // Relative path Methods
        front_of_house::hosting::add_to_waitlist(); // ❌ Doesn't compile
        super::front_of_house::hosting::add_to_waitlist(); // ✅ Compiles
    }
}
```

In order to compile here we needed to use the `super` keyword, the super permits to access the `front_of_house` module from the `dining` module. The `super` keyword is relative to the current module and will take the parent module so we can't keep the same path with `::lib::`.

You could also use the `super` keyword here like so:

```rust
mod dining {
    use super::front_of_house;

    fn eat_at_restaurant() {
        front_of_house::hosting::add_to_waitlist(); // ✅ Compile
    }
}
```

This small change here using the `use` keyword permits to use the `front_of_house` module without having to specify the path or to use the `super` keyword directly in the function.
