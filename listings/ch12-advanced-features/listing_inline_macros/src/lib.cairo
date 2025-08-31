// ANCHOR: make_array_macro
macro make_array {
    ($($x:expr), *) => {
        {
            let mut arr = $defsite::ArrayTrait::new();
            $(arr.append($x);)*
            arr
        }
    };
}
// ANCHOR_END: make_array_macro

#[cfg(test)]
#[test]
fn test_make_array() {
    // ANCHOR: make_array_usage
    let a = make_array![1, 2, 3];
    // ANCHOR_END: make_array_usage
    let expected = array![1, 2, 3];
    assert_eq!(a, expected);
}

// ANCHOR: hygiene_e2e_module
mod hygiene_demo {
    // A helper available at the macro definition site
    fn def_bonus() -> u8 {
        10
    }

    // Adds the defsite bonus, regardless of what exists at the callsite
    pub macro add_defsite_bonus {
        ($x: expr) => { $x + $defsite::def_bonus() };
    }

    // Adds the callsite bonus, resolved where the macro is invoked
    pub macro add_callsite_bonus {
        ($x: expr) => { $x + $callsite::bonus() };
    }

    // Exposes a variable to the callsite using `expose!`.
    pub macro apply_and_expose_total {
        ($base: expr) => {
            let total = $base + 1;
            expose!(let exposed_total = total;);
        };
    }

    // A helper macro that reads a callsite-exposed variable
    pub macro read_exposed_total {
        () => { $callsite::exposed_total };
    }

    // Wraps apply_and_expose_total and then uses another inline macro
    // that accesses the exposed variable via `$callsite::...`.
    pub macro wrapper_uses_exposed {
        ($x: expr) => {
            {
                $defsite::apply_and_expose_total!($x);
                $defsite::read_exposed_total!()
            }
        };
    }
}
// ANCHOR_END: hygiene_e2e_module

//ANCHOR: hygiene_demo
use hygiene_demo::{
    add_callsite_bonus, add_defsite_bonus, apply_and_expose_total, wrapper_uses_exposed,
};
#[cfg(test)]
#[test]
fn test_hygiene_e2e() {
    // ANCHOR: hygiene_e2e_usage

    // Callsite defines its own `bonus` — used only by callsite-resolving macro
    let bonus = | | -> u8 {
        20
    };
    let price: u8 = 5;
    assert_eq!(add_defsite_bonus!(price), 15); // uses defsite::def_bonus() = 10
    assert_eq!(add_callsite_bonus!(price), 25); // uses callsite::bonus() = 20

    // Call in statement position; it exposes `exposed_total` at the callsite
    apply_and_expose_total!(3);
    assert_eq!(exposed_total, 4);

    // A macro invoked by another macro can access exposed values via `$callsite::...`
    let w = wrapper_uses_exposed!(7);
    assert_eq!(w, 8);
    // ANCHOR_END: hygiene_e2e_usage
}
// ANCHOR_END: hygiene_demo


