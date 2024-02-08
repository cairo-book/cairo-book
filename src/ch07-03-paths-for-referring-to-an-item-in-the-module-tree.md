## Paths for Referring to an Item in the Module Tree

To show Cairo where to find an item in a module tree, we use a path in the same way we use a path when navigating a filesystem. To call a function, we need to know its path.

A path can take two forms:

- An _absolute path_ is the full path starting from a crate root. The absolute path begins with the crate name.
- A _relative path_ starts from the current module.

Both absolute and relative paths are followed by one or more identifiers separated by double colons (`::`).

To illustrate this notion let's take back our example Listing 7-1 for the restaurant we used in the last chapter. We have a crate named _restaurant_ in which we have a module named _front_of_house_ that contains a module named _hosting_. The _hosting_ module contains a function named `add_to_waitlist`. We want to call the `add_to_waitlist` function from the `eat_at_restaurant` function. We need to tell Cairo the path to the `add_to_waitlist` function so it can find it.

<span class="filename">Filename: src/lib.cairo</span>

```rust,noplayground
{{#include ../listings/ch07-managing-cairo-projects-with-packages-crates-and-modules/listing_07_02/src/lib.cairo:paths}}
```

<span class="caption">Listing 7-2: Calling the `add_to_waitlist` function using absolute and relative paths</span>

The first time we call the `add_to_waitlist` function in `eat_at_restaurant`,
we use an absolute path. The `add_to_waitlist` function is defined in the same
crate as `eat_at_restaurant`. In Cairo, absolute paths start from the crate root, which you need to refer to by using the crate name. You can imagine a filesystem with the same structure: we’d specify the path `/front_of_house/hosting/add_to_waitlist` to run the `add_to_waitlist` program; using the crate name to start from the crate root is like using `/` to start from the filesystem root in your shell.

The second time we call `add_to_waitlist`, we use a relative path. The path starts with _front_of_house_, the name of the module defined at the same level of the module tree as `eat_at_restaurant`. Here the filesystem equivalent would be using the path `./front_of_house/hosting/add_to_waitlist`. Starting with a module name means that the path is relative to the current module.

Let’s try to compile Listing 7-2 and find out why it won’t compile yet! We get the following error:

```shell
error: Item `restaurant::front_of_house::hosting` is not visible in this context.
 --> restaurant/src/lib.cairo:9:33
    restaurant::front_of_house::hosting::add_to_waitlist();
                                ^*****^

error: Item `restaurant::front_of_house::hosting::add_to_waitlist` is not visible in this context.
 --> restaurant/src/lib.cairo:9:42
    restaurant::front_of_house::hosting::add_to_waitlist();
                                         ^*************^

error: Item `restaurant::front_of_house::hosting` is not visible in this context.
 --> restaurant/src/lib.cairo:12:21
    front_of_house::hosting::add_to_waitlist();
                    ^*****^

error: Item `restaurant::front_of_house::hosting::add_to_waitlist` is not visible in this context.
 --> restaurant/src/lib.cairo:12:30
    front_of_house::hosting::add_to_waitlist();
                             ^*************^

error: could not compile `restaurant` due to previous error
```

The error messages say that module _hosting_ and the `add_to_waitlist` function are not visible. In other words, we have the correct paths for the hosting module and the add_to_waitlist function, but Cairo won’t let us use them because it doesn’t have access to them. In Cairo, all items (functions, methods, structs, enums, modules, and constants) are private to parent modules by default. If you want to make an item like a function or struct private, you put it in a module.

Items in a parent module can’t use the private items inside child modules, but items in child modules can use the items in their ancestor modules. This is because child modules wrap and hide their implementation details, but the child modules can see the context in which they’re defined. To continue with our metaphor, think of the privacy rules as being like the back office of a restaurant: what goes on in there is private to restaurant customers, but office managers can see and do everything in the restaurant they operate.

Cairo chose to have the module system function this way so that hiding inner implementation details is the default. That way, you know which parts of the inner code you can change without breaking outer code. However, Rust does give you the option to expose inner parts of child modules’ code to outer ancestor modules by using the pub keyword to make an item public.

### Exposing Paths with the `pub` keyword

Let’s return to the previous error that told us the _hosting_ module and the `add_to_waitlist` function are not visible. We want the `eat_at_restaurant` function in the parent module to have access to the `add_to_waitlist` function in the child module, so we mark the _hosting_ module and the `add_to_waitlist` function with the pub keyword, as shown here:

<span class="filename">Filename: src/lib.cairo</span>

```rust,noplayground
{{#include ../listings/ch07-managing-cairo-projects-with-packages-crates-and-modules/no_listing_03_pub/src/lib.cairo}}
```

Adding the `pub` keyword in front of `mod hosting;` makes the module public. With this change, if we can access _front_of_house_, we can access _hosting_. But the contents of hosting are still private; making the module public doesn’t make its contents public. The `pub` keyword on a module only lets code in its ancestor modules refer to it, not access its inner code. Because modules are containers, there’s not much we can do by only making the module public; we need to go further and choose to make one or more of the items within the module public as well.

This is why we also make the `add_to_waitlist` function public by adding the `pub` keyword before its definition.

Now the code will compile! To see why adding the `pub` keyword lets us use these paths in `add_to_waitlis`t` with respect to the privacy rules, let’s look at the absolute and the relative paths.

In the absolute path, we start with the crate root, the root of our crate’s module tree. The _front_of_house_ module is defined in the crate root. While _front_of_house_ isn’t public, because the `eat_at_restaurant` function is defined in the same module as _front_of_house_ (that is, _front_of_house_ and `eat_at_restaurant` are siblings), we can refer to _front_of_house_ from `eat_at_restaurant`. Next is the _hosting_ module marked with `pub`. We can access the parent module of _hosting_, so we can access _hosting_ itself. Finally, the `add_to_waitlist` function is marked with `pub` and we can access its parent module, so this function call works!

In the relative path, the logic is the same as the absolute path except for the first step: rather than starting from the crate root, the path starts from _front_of_house_. The _front_of_house_ module is defined within the same module as `eat_at_restaurant`, so the relative path starting from the module in which `eat_at_restaurant` is defined works. Then, because _hosting_ and `add_to_waitlist` are marked with `pub`, the rest of the path works, and this function call is valid!

### Starting Relative Paths with `super`

We can construct relative paths that begin in the parent module, rather than the current module or the crate root, by using `super` at the start of the path. This is like starting a filesystem path with the `..` syntax. Using `super` allows us to reference an item that we know is in the parent module, which can make rearranging the module tree easier when the module is closely related to the parent, but the parent might be moved elsewhere in the module tree someday.

Consider the code in Listing 7-3 that models the situation in which a chef fixes an incorrect order and personally brings it out to the customer. The function `fix_incorrect_order` defined in the _back_of_house_ module calls the function `deliver_order` defined in the parent module by specifying the path to `deliver_order` starting with `super`:

<span class="filename">Filename: src/lib.cairo</span>

```rust,noplayground
{{#include ../listings/ch07-managing-cairo-projects-with-packages-crates-and-modules/listing_07_03/src/lib.cairo}}
```

<span class="caption">Listing 7-3: Calling a function using a relative path starting with `super`</span>

Here you can see directly that you access a parent's module easily using `super`, which wasn't the case previously.
Note that the _back_of_house_ is kept private, as external users are not supposed to interact with the back of house directly.

### Making Structs and Enums public

We can also use `pub` to designate structs and enums as public, but there are a few details extra to the usage of `pub` with structs and enums.

- If we use `pub` before a struct definition, we make the struct public, but the struct’s fields will still be private. We can make each field public or not on a case-by-case basis.
- In contrast, if we make an enum public, all of its variants are then public. We only need the `pub` before the enum keyword.

There’s one more situation involving `pub` that we haven’t covered, and that is our last module system feature: the `use` keyword. We’ll cover `use` by itself first, and then we’ll show how to combine `pub` and `use`.



